using System.Collections;
using UnityEngine;

public class AvatarTTS : MonoBehaviour
{
    public AudioSource audioSource;

    public IEnumerator Speak(string text)
    {
        Debug.Log("TTS: " + text);

        // TEMPORARY: simulate speaking time
        float speakTime = Mathf.Clamp(text.Length * 0.05f, 2f, 8f);

        yield return new WaitForSeconds(speakTime);
    }
}