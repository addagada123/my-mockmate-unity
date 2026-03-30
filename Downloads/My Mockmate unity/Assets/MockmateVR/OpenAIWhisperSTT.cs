using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

/// <summary>
/// Unified OpenAI Whisper STT implementation for both Editor and WebGL.
/// Uses UnityEngine.Microphone in Editor/Standalone.
/// Interfaces with WebGLWhisperSTT logic in WebGL.
/// </summary>
public class OpenAIWhisperSTT : MonoBehaviour
{
    [Header("Settings")]
    public string apiKey = "";
    public string model = "whisper-1";
    public string language = "en";

    [Header("Dependencies")]
    public STTClient sttClient;

    private const string WhisperUrl = "https://api.openai.com/v1/audio/transcriptions";

    private AudioClip _recording;
    private bool _isRecording;
    public bool isRecording
    {
        get
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            var webGLSTT = GetComponent<WebGLWhisperSTT>();
            if (webGLSTT == null) webGLSTT = FindAnyObjectByType<WebGLWhisperSTT>();
            if (webGLSTT != null) return webGLSTT.isRecording;
            return false;
#else
            return _isRecording;
#endif
        }
    }
    private string _microphoneName;

    void Awake()
    {
        if (sttClient == null)
            sttClient = GetComponent<STTClient>();
    }

    public void StartSpeechToText()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        var webGLSTT = GetComponent<WebGLWhisperSTT>();
        if (webGLSTT == null) webGLSTT = FindAnyObjectByType<WebGLWhisperSTT>();
        if (webGLSTT != null) {
            webGLSTT.StartSpeechToText();
            return;
        }
        else {
            Debug.LogWarning("[OpenAIWhisperSTT] WebGLWhisperSTT not found on this object or in the scene! Recording cannot start in WebGL.");
        }
#endif

        if (_isRecording) return;
        
#if !UNITY_WEBGL || UNITY_EDITOR
        _microphoneName = Microphone.devices.Length > 0 ? Microphone.devices[0] : null;
        if (string.IsNullOrEmpty(_microphoneName))
        {
            Debug.LogError("[OpenAIWhisperSTT] No microphone found.");
            return;
        }

        Debug.Log("[OpenAIWhisperSTT] Recording started...");
        _recording = Microphone.Start(_microphoneName, false, 30, 44100);
        _isRecording = true;
#else
        Debug.LogWarning("[OpenAIWhisperSTT] Native Microphone not supported on WebGL. Use WebGLWhisperSTT instead.");
#endif
    }

    public void StopSpeechToText()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        var webGLSTT = GetComponent<WebGLWhisperSTT>();
        if (webGLSTT == null) webGLSTT = FindAnyObjectByType<WebGLWhisperSTT>();
        if (webGLSTT != null) {
            webGLSTT.StopSpeechToText();
            return;
        }
#endif

#if !UNITY_WEBGL || UNITY_EDITOR
        Debug.Log("[OpenAIWhisperSTT] Recording stopped. Transcribing...");
        int lastPos = Microphone.GetPosition(_microphoneName);
        Microphone.End(_microphoneName);
        _isRecording = false;

        if (lastPos > 0)
        {
            StartCoroutine(TranscribeAudio(_recording, lastPos));
        }
        else
        {
            Debug.LogWarning("[OpenAIWhisperSTT] Recording length was zero.");
        }
#endif
    }

    private IEnumerator TranscribeAudio(AudioClip clip, int samplesCount)
    {
        if (string.IsNullOrEmpty(apiKey))
        {
            Debug.LogError("[OpenAIWhisperSTT] API Key is missing!");
            yield break;
        }

        byte[] wavData = GetWavData(clip, samplesCount);
        
        WWWForm form = new WWWForm();
        form.AddBinaryData("file", wavData, "recording.wav", "audio/wav");
        form.AddField("model", model);
        form.AddField("language", language);

        using (UnityWebRequest www = UnityWebRequest.Post(WhisperUrl, form))
        {
            www.SetRequestHeader("Authorization", "Bearer " + apiKey);

            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("[OpenAIWhisperSTT] Request failed: " + www.error + "\n" + www.downloadHandler.text);
            }
            else
            {
                string jsonResponse = www.downloadHandler.text;
                Debug.Log("[OpenAIWhisperSTT] Response: " + jsonResponse);
                
                // Parse simple JSON: {"text": "..."}
                WhisperResponse response = JsonUtility.FromJson<WhisperResponse>(jsonResponse);
                if (sttClient != null && !string.IsNullOrEmpty(response.text))
                {
                    sttClient.OnSpeechRecognized(response.text);
                }
            }
        }
    }

    [Serializable]
    private class WhisperResponse
    {
        public string text;
    }

    // Helper to convert AudioClip segment to WAV format bytes
    private byte[] GetWavData(AudioClip clip, int samplesCount)
    {
        float[] samples = new float[samplesCount * clip.channels];
        clip.GetData(samples, 0);

        using (MemoryStream stream = new MemoryStream())
        {
            using (BinaryWriter writer = new BinaryWriter(stream))
            {
                // WAV Header
                writer.Write(new char[4] { 'R', 'I', 'F', 'F' });
                writer.Write(36 + samples.Length * 2);
                writer.Write(new char[4] { 'W', 'A', 'V', 'E' });
                writer.Write(new char[4] { 'f', 'm', 't', ' ' });
                writer.Write(16);
                writer.Write((short)1); // PCM
                writer.Write((short)clip.channels);
                writer.Write(clip.frequency);
                writer.Write(clip.frequency * clip.channels * 2);
                writer.Write((short)(clip.channels * 2));
                writer.Write((short)16); // bits per sample
                writer.Write(new char[4] { 'd', 'a', 't', 'a' });
                writer.Write(samples.Length * 2);

                foreach (float sample in samples)
                {
                    writer.Write((short)(sample * 32767f));
                }
            }
            return stream.ToArray();
        }
    }
}
