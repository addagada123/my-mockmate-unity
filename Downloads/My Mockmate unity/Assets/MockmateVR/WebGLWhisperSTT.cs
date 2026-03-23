using UnityEngine;
using System.Runtime.InteropServices;

public class WebGLWhisperSTT : MonoBehaviour
{
    public string apiKey = "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";
    public string language = "en";
    public STTClient sttClient;

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void InitWhisperSTT(string apiKey, string language, string objectName, string methodName);

    [DllImport("__Internal")]
    private static extern void StartRecording();

    [DllImport("__Internal")]
    private static extern void StopRecording();
#endif

    void Start()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        if (string.IsNullOrEmpty(apiKey))
        {
            Debug.LogError("WebGLWhisperSTT: API Key is missing!");
            return;
        }
        InitWhisperSTT(apiKey, language, gameObject.name, "OnTranscriptionReceived");
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

    // Called from JSLib via SendMessage
    public void OnTranscriptionReceived(string text)
    {
        Debug.Log("WebGL Whisper Result: " + text);
        if (sttClient != null)
        {
            sttClient.OnSpeechRecognized(text);
        }
    }
}
