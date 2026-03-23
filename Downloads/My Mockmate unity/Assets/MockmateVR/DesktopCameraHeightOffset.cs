using UnityEngine;
using UnityEngine.XR;

public class DesktopCameraHeightOffset : MonoBehaviour
{
    [Tooltip("The simulated eye-level height in meters for desktop browsers.")]
    public float desktopHeight = 1.7f; // Average human eye-level height

    void Start()
    {
        // If a VR headset is NOT actively rendering, we simulate a standing height
        if (!XRSettings.isDeviceActive)
        {
            Vector3 newPosition = transform.localPosition;
            newPosition.y = desktopHeight;
            transform.localPosition = newPosition;
            
            Debug.Log($"[MockmateVR] Camera offset to {desktopHeight}m because VR headset is not active.");
        }
    }
}
