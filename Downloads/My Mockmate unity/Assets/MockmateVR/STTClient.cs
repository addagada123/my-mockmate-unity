using UnityEngine;
using UnityEngine.Events;

public class STTClient : MonoBehaviour
{
    [System.Serializable]
    public class TranscriptChunkEvent : UnityEvent<string> { }

    public string LastTranscript = "";
    public TranscriptChunkEvent OnTranscriptChunk;

    public void OnSpeechRecognized(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return;

        string clean = text.Trim();
        LastTranscript = string.IsNullOrEmpty(LastTranscript) ? clean : $"{LastTranscript} {clean}";
        OnTranscriptChunk?.Invoke(clean);
        Debug.Log("Streaming transcript: " + LastTranscript);
    }

    public void ClearTranscript()
    {
        LastTranscript = "";
    }

    public string GetTranscript()
    {
        return LastTranscript;
    }
}
