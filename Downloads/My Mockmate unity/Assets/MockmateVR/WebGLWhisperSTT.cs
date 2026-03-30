using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;

public class WebGLWhisperSTT : MonoBehaviour
{
    [SerializeField] private MockmateVRApiClient apiClient;
    public string language = "en";
    public STTClient sttClient;
    public STTClient.TranscriptChunkEvent OnTranscriptChunk;

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void InitWhisperSTT(string bridgeToken, string apiBase, string language, string objectName, string methodName);

    [DllImport("__Internal")]
    private static extern void StartRecording();

    [DllImport("__Internal")]
    private static extern void StopRecording();
#endif

    void Start()
    {
        if (apiClient == null)
            apiClient = FindAnyObjectByType<MockmateVRApiClient>();
            
        if (sttClient == null)
            sttClient = FindAnyObjectByType<STTClient>();

        StartCoroutine(InitializeProxyRoutine());
    }

    private IEnumerator InitializeProxyRoutine()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        // Wait for API client to have a token
        while (apiClient != null && string.IsNullOrEmpty(apiClient.BridgeToken))
        {
            yield return new WaitForSeconds(0.5f);
        }

        if (apiClient != null && !string.IsNullOrEmpty(apiClient.BridgeToken))
        {
            Debug.Log("WebGLWhisperSTT: Initializing with Bridge Token.");
            InitWhisperSTT(apiClient.BridgeToken, apiClient.ApiBase, language, gameObject.name, "OnTranscriptionReceived");
        }
        else
        {
            Debug.LogError("WebGLWhisperSTT: Failed to initialize. MockmateVRApiClient or Bridge Token missing.");
        }
#else
        yield break;
#endif
    }

    public bool isRecording = false;

    public void StartSpeechToText()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        isRecording = true;
        StartRecording();
#else
        Debug.LogWarning("WebGLWhisperSTT: Only works in WebGL build.");
#endif
    }

    public void StopSpeechToText()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        isRecording = false;
        StopRecording();
#endif
    }

    public void OnRecordingAutoStopped(string empty)
    {
        Debug.Log("WebGLWhisperSTT: Auto-stopped by VAD.");
        isRecording = false;
    }

    // Called from JSLib via SendMessage (bridged systems)
    public void OnTranscriptionReceived(string text) => OnTranscriptChunkReceived(text);

    // Called from index.html manually or via JSLib
    public void OnTranscriptChunkReceived(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return;

        // Guard: drop error strings — they must never reach the FlowController
        // as they would be submitted as the user's answer, causing 409 conflicts.
        if (text.TrimStart().StartsWith("ERROR:", System.StringComparison.OrdinalIgnoreCase))
        {
            Debug.LogWarning("[WebGLWhisperSTT] Dropped error string: " + text);
            return;
        }

        Debug.Log("[WebGLWhisperSTT] Transcript received: " + text);

        if (OnTranscriptChunk != null)
            OnTranscriptChunk.Invoke(text);

        if (sttClient != null)
            sttClient.OnSpeechRecognized(text);
    }
}
