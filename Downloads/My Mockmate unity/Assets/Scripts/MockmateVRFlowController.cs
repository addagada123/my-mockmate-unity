using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Events;

public class MockmateVRFlowController : MonoBehaviour
{
    [Header("Dependencies")]
    [SerializeField] private MockmateVRApiClient apiClient;

    [Header("VR Behavior")]
    [SerializeField] private bool autoStartWhenTokenPresent = true;
    [SerializeField] private bool autoSpeakWhenQuestionArrives = true;
    [SerializeField] private float simulatedSpeakCharsPerSecond = 18f;
    [SerializeField] private float prepTimeSeconds = 10f;
    [SerializeField] private float silenceGapSeconds = 3f;
    [SerializeField] private float minListenSeconds = 1f;
    [SerializeField] private int initialFetchRetryCount = 8;
    [SerializeField] private float initialFetchRetryDelaySeconds = 1f;
    [SerializeField] private float speechCompletionFallbackSeconds = 20f;
    [SerializeField] private float nextQuestionDelaySeconds = 3.5f;

    [Header("Editor Preview")]

    [Header("Events")]
    public UnityEvent<string> OnQuestionReceived;
    public UnityEvent OnQuestionSpeakingStart;
    public UnityEvent OnQuestionSpeakingEnd;
    public UnityEvent<float> OnPrepTick;
    public UnityEvent OnAnswerNow;
    public UnityEvent OnListeningStart;
    public UnityEvent OnListeningEnd;
    public UnityEvent<string> OnStatusMessage;
    public UnityEvent<string> OnError;
    public UnityEvent<float> OnRunningScoreUpdated;
    public UnityEvent<float> OnCompleted;
    public UnityEvent<string> OnCompletedMessage;

    /// <summary>True while a VR interview flow is actively running.</summary>
    public bool IsFlowActive => _busy || (_currentQuestion != null && !_completed);

    private VrQuestion _currentQuestion;
    private float _startedAt;
    private bool _busy;
    private bool _isListening;
    private bool _completed;
    private bool _flowStarting;
    private bool _manualSubmitRequested;
    private bool _awaitingQuestionSpeechCompletion;
    private bool _listeningEndedNotified;
    private string _transcript = "";
    private float _lastTranscriptUpdateAt = -1f;
    private int _activeQuestionIndex = 0;

    private void Awake()
    {
        if (apiClient == null)
            apiClient = GetComponent<MockmateVRApiClient>();
    }

    private void Start()
    {
        _startedAt = Time.time;
        if (autoStartWhenTokenPresent && apiClient != null && !string.IsNullOrWhiteSpace(apiClient.BridgeToken))
            BeginFlow();
    }


    public void BeginFlow()
    {
        if (_busy || _flowStarting) return;
        if (apiClient == null)
        {
            RaiseError("API client missing");
            return;
        }
        if (string.IsNullOrWhiteSpace(apiClient.BridgeToken))
        {
            RaiseError("Bridge token is required");
            return;
        }
        _completed = false;
        _flowStarting = true;
        _manualSubmitRequested = false;
        _currentQuestion = null;
        _startedAt = Time.time;
        PublishStatus("Fetching first question...");
        StartCoroutine(FetchInitialQuestionWithRetry());
    }

    public void SetApiBase(string apiBase)
    {
        if (apiClient == null) return;
        apiClient.SetApiBase(apiBase);
        PublishStatus("API base updated");
    }

    public void SetBridgeToken(string bridgeToken)
    {
        if (apiClient == null) return;
        apiClient.SetBridgeToken(bridgeToken);
        PublishStatus("Bridge token updated");
    }

    private void OnNextQuestionFetched(VrNextResponse response, string error)
    {
        _flowStarting = false;
        if (!string.IsNullOrEmpty(error))
        {
            _busy = false;
            RaiseError($"Fetch question failed: {error}");
            return;
        }

        if (response == null || response.completed || response.current_question == null)
        {
            CompleteFlow();
            return;
        }

        _currentQuestion = response.current_question;
        _activeQuestionIndex = response.current_question_index;
        _transcript = "";
        _lastTranscriptUpdateAt = -1f;

        OnQuestionReceived?.Invoke(_currentQuestion.question);
        PublishStatus($"Question {_activeQuestionIndex + 1}/{Mathf.Max(1, response.total_questions)} loaded");

        StopAllCoroutines();
        StartCoroutine(RunQuestionLifecycle(_currentQuestion.question));
    }

    private IEnumerator RunQuestionLifecycle(string questionText)
    {
        _busy = true;
        _manualSubmitRequested = false;

        if (autoSpeakWhenQuestionArrives)
        {
            OnQuestionSpeakingStart?.Invoke();
            PublishStatus("Interviewer speaking...");
            // Estimate how long speech will take at the configured reading speed.
            float speakDuration = Mathf.Clamp(
                (questionText ?? string.Empty).Length / Mathf.Max(5f, simulatedSpeakCharsPerSecond),
                1f, 20f);
            // Add a generous buffer for Backend TTS network round-trip (download + decode)
            // Without this buffer the timeout fires before audio has even been fetched.
            const float ttsFetchBuffer = 15f;
            float maxWait = Mathf.Max(speakDuration + ttsFetchBuffer, speechCompletionFallbackSeconds);
            _awaitingQuestionSpeechCompletion = HasExternalSpeechHandler();
            if (_awaitingQuestionSpeechCompletion)
            {
                float waited = 0f;
                while (_awaitingQuestionSpeechCompletion && waited < maxWait)
                {
                    waited += Time.deltaTime;
                    yield return null;
                }

                if (_awaitingQuestionSpeechCompletion)
                {
                    PublishStatus("Speech completion timeout reached. Continuing interview flow...");
                    _awaitingQuestionSpeechCompletion = false;
                }
            }
            else
            {
                yield return new WaitForSeconds(speakDuration);
            }
            OnQuestionSpeakingEnd?.Invoke();
        }

        yield return PrepCountdownCoroutine();
        OnAnswerNow?.Invoke();
        PublishStatus("Answer now");

        _isListening = true;
        _listeningEndedNotified = false;
        _lastTranscriptUpdateAt = Time.time;
        OnListeningStart?.Invoke();
        PublishStatus("Listening for answer...");

        float listenStart = Time.time;
        while (_isListening && !_completed)
        {
            float now = Time.time;
            bool minListenDone = (now - listenStart) >= minListenSeconds;
            bool silenceExceeded = _lastTranscriptUpdateAt > 0 && (now - _lastTranscriptUpdateAt) >= silenceGapSeconds;
            bool hasTranscript = !string.IsNullOrWhiteSpace(_transcript);

            if (minListenDone && hasTranscript && silenceExceeded)
            {
                _isListening = false;
                break;
            }
            yield return null;
        }

        EndListeningSession();
        _busy = false;

        if (!_completed && !_manualSubmitRequested)
            SubmitCurrentAnswer(_transcript.Trim());

        _manualSubmitRequested = false;
    }

    private IEnumerator PrepCountdownCoroutine()
    {
        float remaining = Mathf.Max(0f, prepTimeSeconds);
        while (remaining > 0f)
        {
            OnPrepTick?.Invoke(remaining);
            PublishStatus($"Prepare your answer: {Mathf.CeilToInt(remaining)}s");
            yield return new WaitForSeconds(1f);
            remaining -= 1f;
        }
        OnPrepTick?.Invoke(0f);
    }

    public void AppendTranscriptChunk(string textChunk)
    {
        if (!_isListening) return;
        if (string.IsNullOrWhiteSpace(textChunk)) return;

        string normalizedChunk = textChunk.Trim();
        if (normalizedChunk.Length == 0)
            return;

        // ── Reject STT error strings (e.g. "ERROR: Proxy error: 429") ──
        // These come through when the backend STT proxy fails. We must not treat
        // them as valid transcript content or the interview will submit an error
        // string as the answer, causing index mismatches and 409 responses.
        if (normalizedChunk.StartsWith("ERROR:", StringComparison.OrdinalIgnoreCase) ||
            normalizedChunk.StartsWith("ERROR :", StringComparison.OrdinalIgnoreCase))
        {
            Debug.LogWarning($"[MockmateVR] STT returned an error chunk (ignoring): {normalizedChunk}");
            return;
        }

        // Some STT integrations repeatedly emit the full transcript-so-far or duplicate
        // chunks while the speaker is silent. Ignore no-op updates so silence detection
        // can advance to the next question.
        if (string.Equals(_transcript, normalizedChunk, StringComparison.OrdinalIgnoreCase) ||
            _transcript.EndsWith(normalizedChunk, StringComparison.OrdinalIgnoreCase))
            return;

        if (_transcript.Length > 0) _transcript += " ";
        _transcript += normalizedChunk;
        _lastTranscriptUpdateAt = Time.time;
    }

    /// <summary>
    /// For compatibility with STT clients that expect this exact name.
    /// </summary>
    public void OnTranscriptionReceived(string text)
    {
        AppendTranscriptChunk(text);
    }

    public void ForceSubmitCurrentAnswer()
    {
        if (_currentQuestion == null) return;
        if (!_isListening) return;
        _manualSubmitRequested = true;
        _isListening = false;
        EndListeningSession();
        _busy = false;
        SubmitCurrentAnswer(_transcript.Trim());
    }

    public void NotifyQuestionSpeechCompleted()
    {
        if (_awaitingQuestionSpeechCompletion)
            _awaitingQuestionSpeechCompletion = false;
    }

    public void SubmitCurrentAnswer(string transcript)
    {
        if (_currentQuestion == null)
        {
            RaiseError("No current question loaded");
            return;
        }

        // ── Sanitize transcript: strip leftover error strings before submitting ──
        string clean = transcript?.Trim() ?? "";
        // Remove any error chunks that slipped through (defensive check)
        if (clean.StartsWith("ERROR:", StringComparison.OrdinalIgnoreCase))
        {
            Debug.LogWarning("[MockmateVR] Transcript starts with an error string. Skipping submission.");
            // Fetch next question instead of submitting bad data
            StartCoroutine(apiClient.FetchNextQuestion(OnNextQuestionFetched));
            return;
        }

        if (string.IsNullOrWhiteSpace(clean))
        {
            // No answer detected (silence / STT failure). Submit placeholder so
            // the session can continue rather than hanging.
            Debug.LogWarning("[MockmateVR] No transcript detected. Submitting placeholder answer.");
            clean = "(no answer detected)";
        }

        _busy = true;
        StartCoroutine(apiClient.SubmitAnswer(_activeQuestionIndex, clean, OnAnswerSubmitted));
    }

    private void OnAnswerSubmitted(VrAnswerResponse response, string error)
    {
        if (!string.IsNullOrEmpty(error))
        {
            _busy = false;
            RaiseError($"Submit answer failed: {error}");
            return;
        }

        if (response == null)
        {
            _busy = false;
            RaiseError("Empty answer response");
            return;
        }

        OnRunningScoreUpdated?.Invoke(response.running_percentage);

        if (response.completed)
        {
            CompleteFlow();
            return;
        }

        if (response.next_question != null)
        {
            _currentQuestion = response.next_question;
            _activeQuestionIndex = response.next_question_index;
            _transcript = "";
            _lastTranscriptUpdateAt = -1f;
            OnQuestionReceived?.Invoke(_currentQuestion.question);
            StopAllCoroutines();
            StartCoroutine(WaitAndStartNextQuestion(_currentQuestion.question));
            return;
        }

        StartCoroutine(apiClient.FetchNextQuestion(OnNextQuestionFetched));
    }

    private IEnumerator WaitAndStartNextQuestion(string questionText)
    {
        _busy = true;
        if (nextQuestionDelaySeconds > 0)
        {
            PublishStatus($"Next question in {nextQuestionDelaySeconds}s...");
            yield return new WaitForSeconds(nextQuestionDelaySeconds);
        }
        StartCoroutine(RunQuestionLifecycle(questionText));
    }

    public void CompleteFlow()
    {
        if (_completed) return;
        _completed = true;
        _flowStarting = false;
        _isListening = false;
        EndListeningSession();
        int elapsed = Mathf.RoundToInt(Time.time - _startedAt);
        _busy = true;
        StartCoroutine(apiClient.CompleteTest(elapsed, OnCompletePosted));
    }

    private void OnCompletePosted(VrCompleteResponse response, string error)
    {
        if (!string.IsNullOrEmpty(error))
        {
            _busy = false;
            RaiseError($"Complete test failed: {error}");
            return;
        }
        if (response == null)
        {
            _busy = false;
            RaiseError("Empty complete response");
            return;
        }
        string msg = $"Test completed. Score: {response.percentage:F1}%";
        _busy = false;
        PublishStatus(msg);
        OnCompletedMessage?.Invoke(msg);
        OnCompleted?.Invoke(response.percentage);
    }

    private void PublishStatus(string message)
    {
        Debug.Log("[MockmateVR] " + message);
        OnStatusMessage?.Invoke(message);
    }

    private void RaiseError(string message)
    {
        Debug.LogError("[MockmateVR] " + message);
        OnError?.Invoke(message);
        PublishStatus("Error: " + message);
    }

    private bool IsInitializationRaceError(string error)
    {
        if (string.IsNullOrWhiteSpace(error))
            return false;

        string normalized = error.ToLowerInvariant();
        return normalized.Contains("vr test not initialized");
    }

    private bool HasExternalSpeechHandler()
    {
        // Returns true only if there is at least one persistent Inspector-wired listener
        // on OnQuestionSpeakingStart. Using _awaitingQuestionSpeechCompletion here was
        // circular logic — it's set to the result of this function, so it was always false
        // on the first call, bypassing the wait entirely.
        return OnQuestionSpeakingStart != null &&
               OnQuestionSpeakingStart.GetPersistentEventCount() > 0;
    }

    private void EndListeningSession()
    {
        if (_listeningEndedNotified)
            return;

        _listeningEndedNotified = true;
        OnListeningEnd?.Invoke();
    }


    private IEnumerator FetchInitialQuestionWithRetry()
    {
        int maxAttempts = Mathf.Max(1, initialFetchRetryCount + 1);
        for (int attempt = 1; attempt <= maxAttempts; attempt++)
        {
            bool completed = false;
            VrNextResponse response = null;
            string error = null;

            yield return apiClient.FetchNextQuestion((res, err) =>
            {
                response = res;
                error = err;
                completed = true;
            });

            if (!completed)
                yield break;

            if (string.IsNullOrEmpty(error))
            {
                OnNextQuestionFetched(response, null);
                yield break;
            }

            bool shouldRetry =
                attempt < maxAttempts &&
                IsInitializationRaceError(error);

            if (!shouldRetry)
            {
                OnNextQuestionFetched(response, error);
                yield break;
            }

            PublishStatus($"VR session still syncing, retrying question fetch ({attempt}/{maxAttempts - 1})...");
            yield return new WaitForSeconds(Mathf.Max(0.1f, initialFetchRetryDelaySeconds));
        }
    }
}
