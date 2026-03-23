using System.Collections;
using UnityEngine;

public class AudioRecorder : MonoBehaviour
{
    public OpenAIWhisperSTT openAIWhisper;
    public STTClient sttClient;

    public float silenceThreshold = 0.01f;
    public float silenceDuration = 3.5f;
    public float maxRecordSeconds = 45f;

#if !UNITY_WEBGL
    private string device;
    private AudioClip clip;
    private int sampleRate = 16000;
    private int lastSample;
#endif

    public IEnumerator RecordOnce()
    {
        if (openAIWhisper == null)
        {
            Debug.LogError("OpenAIWhisperSTT dependency not set on AudioRecorder.");
            yield break;
        }

        openAIWhisper.StartSpeechToText();

        Debug.Log("Recording started (OpenAI)");
        float silenceTimer = 0f;
        float startedAt = Time.time;
        while (true)
        {
#if !UNITY_WEBGL
            float loudness = GetLoudness();
            if (loudness < silenceThreshold)
            {
                silenceTimer += Time.deltaTime;
                if (silenceTimer > silenceDuration)
                {
                    Debug.Log("Silence detected - stopping recording for OpenAI upload");
                    break;
                }
            }
            else
            {
                silenceTimer = 0f;
            }
#endif
#if UNITY_WEBGL
            if (!openAIWhisper.isRecording)
            {
                Debug.Log("WebGL Auto-Stop detected in loop.");
                break;
            }
#endif

            if (Time.time - startedAt >= maxRecordSeconds)
            {
                Debug.LogWarning("Recording reached max duration - stopping recording");
                break;
            }

            yield return null;
        }

#if UNITY_WEBGL
        if (openAIWhisper.isRecording)
        {
            openAIWhisper.StopSpeechToText();
        }
#else
        openAIWhisper.StopSpeechToText();
#endif
        Debug.Log("Recording finished and sent to OpenAI");
        
        // Wait a bit for the transcript to be processed (OpenAIWhisperSTT triggers sttClient.OnTranscriptChunk)
        yield return new WaitForSeconds(1.0f);
    }

#if !UNITY_WEBGL
    private float GetLoudness()
    {
        int micPosition = Microphone.GetPosition(device) - 128;
        if (micPosition < 0 || clip == null) return 0f;

        float[] samples = new float[128];
        clip.GetData(samples, micPosition);
        float level = 0f;
        foreach (float s in samples)
            level += Mathf.Abs(s);
        return level / samples.Length;
    }
#endif

    private static byte[] ConvertToPCM16(float[] samples)
    {
        byte[] pcm = new byte[samples.Length * 2];
        for (int i = 0; i < samples.Length; i++)
        {
            short value = (short)Mathf.Clamp(samples[i] * 32767f, short.MinValue, short.MaxValue);
            byte[] bytes = System.BitConverter.GetBytes(value);
            pcm[i * 2] = bytes[0];
            pcm[i * 2 + 1] = bytes[1];
        }
        return pcm;
    }
}
