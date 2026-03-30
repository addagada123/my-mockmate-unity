using UnityEngine;

/// <summary>
/// Robust look-at script for Mockmate VR Interviewer.
/// Automatically finds the main camera (player) and maintains eye contact with smoothing.
/// </summary>
public class MockmateVRLookAt : MonoBehaviour
{
    [Header("Targeting")]
    [Tooltip("If null, will automatically find the Main Camera on Start.")]
    public Transform target;
    
    [Header("Settings")]
    public float rotationSpeed = 2.5f;
    public bool lockYAxis = true;
    public Vector3 offsetRotation = Vector3.zero;

    void Start()
    {
        // Auto-discovery of the player's head/camera
        if (target == null && Camera.main != null)
        {
            target = Camera.main.transform;
            Debug.Log("[MockmateVRLookAt] Auto-assigned target to Main Camera.");
        }
    }

    void LateUpdate()
    {
        if (target == null) return;

        // Calculate direction to target
        Vector3 targetPos = target.position;
        if (lockYAxis)
        {
            // Keep the interviewer standing upright
            targetPos.y = transform.position.y;
        }

        Vector3 direction = targetPos - transform.position;
        if (direction.sqrMagnitude < 0.01f) return;

        // Create look rotation and apply smoothing
        Quaternion lookRotation = Quaternion.LookRotation(direction);
        if (offsetRotation != Vector3.zero)
        {
            lookRotation *= Quaternion.Euler(offsetRotation);
        }

        transform.rotation = Quaternion.Slerp(
            transform.rotation,
            lookRotation,
            Time.deltaTime * rotationSpeed
        );
    }
}
