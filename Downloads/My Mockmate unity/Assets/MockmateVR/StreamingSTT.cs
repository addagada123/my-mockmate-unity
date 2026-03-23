using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class StreamingSTT : MonoBehaviour
{
    public string serverURL = "http://127.0.0.1:8081/inference";
    public STTClient sttClient;
    public WhisperServerLauncher whisperLauncher;
    public float startupWarmupSeconds = 1.5f;

    private bool serverWarmupDone;

    public void SendAudioChunk(byte[] audio)
    {
        if (audio == null || audio.Length == 0)
            return;
        StartCoroutine(SendRequest(audio));
    }

    IEnumerator SendRequest(byte[] audio)
    {
        if (whisperLauncher != null && !serverWarmupDone)
        {
            bool started = whisperLauncher.EnsureStarted();
            if (!started)
            {
                Debug.LogError("STT Error: Whisper could not be started.");
                yield break;
            }

            if (startupWarmupSeconds > 0f)
                yield return new WaitForSeconds(startupWarmupSeconds);

            serverWarmupDone = true;
        }

        UnityWebRequest request = new UnityWebRequest(serverURL, "POST");
        request.timeout = 10;

        request.uploadHandler = new UploadHandlerRaw(audio);
        request.downloadHandler = new DownloadHandlerBuffer();

        request.SetRequestHeader("Content-Type", "application/octet-stream");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            string transcript = request.downloadHandler.text;

            if (sttClient != null)
            {
                sttClient.OnSpeechRecognized(transcript);
            }
        }
        else
        {
            Debug.LogError("STT Error: " + request.error);
        }
    }
}
