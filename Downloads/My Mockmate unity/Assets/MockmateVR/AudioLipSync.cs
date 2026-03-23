using UnityEngine;

public class AudioLipSync : MonoBehaviour
{
    public AudioSource audioSource;
    public SkinnedMeshRenderer faceRenderer;

    public int mouthBlendIndex = 0; // mouthOpen index
    public float sensitivity = 100f;

    private float[] samples = new float[256];

    void Update()
    {
        if (!audioSource.isPlaying) return;

        audioSource.GetOutputData(samples, 0);

        float sum = 0;

        for (int i = 0; i < samples.Length; i++)
            sum += Mathf.Abs(samples[i]);

        float volume = sum / samples.Length;

        float mouthValue = Mathf.Clamp(volume * sensitivity, 0, 100);

        faceRenderer.SetBlendShapeWeight(mouthBlendIndex, mouthValue);
    }
}