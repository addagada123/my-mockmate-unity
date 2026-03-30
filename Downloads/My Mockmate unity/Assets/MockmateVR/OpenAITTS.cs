using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using System.Text;
using System;

public class OpenAITTS : MonoBehaviour
{
    public AudioSource audioSource;
    public string apiKey = "";
    public bool LastSpeakSucceeded { get; private set; }

    [Serializable]
    private class TtsRequest
    {
        public string model = "gpt-4o-mini-tts";
        public string voice = "alloy";
        public string input;
    }

    public IEnumerator Speak(string text)
    {
        LastSpeakSucceeded = false;
        if (audioSource == null)
        {
            Debug.LogError("OpenAITTS: AudioSource is not assigned.");
            yield break;
        }
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            Debug.LogError("OpenAITTS: API key is empty.");
            yield break;
        }
        if (string.IsNullOrWhiteSpace(text))
            yield break;

        string url = "https://api.openai.com/v1/audio/speech";
        string json = JsonUtility.ToJson(new TtsRequest { input = text });

        UnityWebRequest request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();

        request.SetRequestHeader("Authorization", "Bearer " + apiKey);
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("TTS failed: " + request.error);
            yield break;
        }

        byte[] audioData = request.downloadHandler.data;

        string path = Application.persistentDataPath + "/tts.mp3";
        System.IO.File.WriteAllBytes(path, audioData);

        using (UnityWebRequest www = UnityWebRequestMultimedia.GetAudioClip("file://" + path, AudioType.MPEG))
        {
            yield return www.SendWebRequest();
            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("OpenAITTS audio load failed: " + www.error);
                yield break;
            }

            AudioClip clip = DownloadHandlerAudioClip.GetContent(www);
            if (clip == null)
            {
                Debug.LogError("OpenAITTS returned empty clip.");
                yield break;
            }
            audioSource.clip = clip;
            audioSource.Play();
            while (audioSource.isPlaying)
                yield return null;
            LastSpeakSucceeded = true;
        }
    }
}
