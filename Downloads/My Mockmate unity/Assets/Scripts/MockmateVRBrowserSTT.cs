using System;
using System.Runtime.InteropServices;
using UnityEngine;

/// <summary>
/// Free alternative to OpenAI Whisper using the browser's native webkitSpeechRecognition.
/// </summary>
public class MockmateVRBrowserSTT : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void StartNativeSTT(string objectName);

    public void StartSpeechToText() => StartRecording();
    public void StopSpeechToText() => StopRecording();

    public void StartRecording()
    {
        if (Application.platform != RuntimePlatform.WebGLPlayer)
        {
            Debug.LogWarning("[BrowserSTT] Only supported in WebGL.");
            return;
        }

        Debug.Log("[BrowserSTT] Starting native recognition...");
        StartNativeSTT(gameObject.name);
    }

    public void StopRecording()
    {
        // Native recognition usually auto-stops on silence, but we could add an explicit stop if needed
    }

    public STTClient.TranscriptChunkEvent OnTranscriptChunk;
    public STTClient sttClient;

    // Called via SendMessage from index.html (legacy/bridged)
    public void OnTranscriptionReceived(string text) => OnTranscriptChunkReceived(text);

    // Standardized event handler
    public void OnTranscriptChunkReceived(string text)
    {
        Debug.Log($"[BrowserSTT] Transcription received: {text}");
        
        if (OnTranscriptChunk != null)
            OnTranscriptChunk.Invoke(text);

        if (sttClient != null)
            sttClient.OnSpeechRecognized(text);

        // Fallback if not using a centralized glue
        if (OnTranscriptChunk == null && sttClient == null)
        {
            var flow = FindFirstObjectByType<MockmateVRFlowController>();
            if (flow != null)
                flow.AppendTranscriptChunk(text);
        }
    }
}
