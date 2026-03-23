using UnityEngine;

/// <summary>
/// Updated Talk Animation script for Mockmate VR.
/// This script handles the procedural jaw movement based on a simulated voice wave.
/// </summary>
public class MockmateVRTalkAnimation : MonoBehaviour
{
    [Header("Animation Settings")]
    public Transform jawBone;
    public float jawOpenAmount = 25f; // Increased for better visibility
    public float talkSpeed = 12f;     // Slightly faster for a more dynamic feel
    public float noiseIntensity = 0.5f; // Random variance to make it look more natural

    [Header("Animator Sync")]
    public Animator animator;
    public string talkBoolParam = "isTalking";
    public string typeBoolParam = "isTyping";

    private bool _isSpeaking = false;
    private Quaternion _jawStartRot;

    void Start()
    {
        if (jawBone != null)
        {
            _jawStartRot = jawBone.localRotation;
        }
        else
        {
            Debug.LogWarning("[MockmateVR] Jaw Bone not assigned to VRTalkAnimation script!");
        }

        if (animator == null)
        {
            animator = GetComponent<Animator>();
        }
    }

    /// <summary>
    /// Starts the mouth movement and triggers the animator bool.
    /// </summary>
    public void StartTalking()
    {
        _isSpeaking = true;
        if (animator != null) animator.SetBool(talkBoolParam, true);
    }

    /// <summary>
    /// Stops the mouth movement and resets the jaw position.
    /// </summary>
    public void StopTalking()
    {
        _isSpeaking = false;
        if (animator != null) animator.SetBool(talkBoolParam, false);
        
        // Reset jaw position
        if (jawBone != null)
        {
            jawBone.localRotation = _jawStartRot;
        }
    }

    /// <summary>
    /// Starts the typing animation bool.
    /// </summary>
    public void StartTyping()
    {
        if (animator != null) animator.SetBool(typeBoolParam, true);
    }

    /// <summary>
    /// Stops the typing animation bool.
    /// </summary>
    public void StopTyping()
    {
        if (animator != null) animator.SetBool(typeBoolParam, false);
    }

    void Update()
    {
        if (_isSpeaking && jawBone != null)
        {
            // Create a procedural wave with some random noise for realism
            float baseWave = Mathf.Abs(Mathf.Sin(Time.time * talkSpeed));
            float noise = Random.Range(-noiseIntensity, noiseIntensity);
            float angle = (baseWave + noise) * jawOpenAmount;

            // Clamp the angle so it doesn't go negative or too far
            angle = Mathf.Clamp(angle, 0, jawOpenAmount * 1.5f);

            // Apply rotation to the jaw bone (assuming X-axis rotation opens the mouth)
            jawBone.localRotation = _jawStartRot * Quaternion.Euler(angle, 0, 0);
        }
    }
}
