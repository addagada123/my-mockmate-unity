using UnityEngine;

/// <summary>
/// Unified bridge for VR animations. 
/// Handles Talking (with procedural jaw wiggle), Typing, and Animator parameters.
/// </summary>
public class MockmateVRAnimationBridge : MonoBehaviour
{
    [Header("Animator Control")]
    public Animator animator;
    public string talkBoolParam = "isTalking";
    public string typeBoolParam = "isTyping";
    public bool animateListeningState = false;

    [Header("Procedural Jaw (Optional)")]
    public Transform jawBone;
    public float jawOpenAmount = 20f;
    public float talkSpeed = 10f;
    [Range(0f, 1f)] public float talkJitter = 0.15f;

    [Header("Blend Shape Lip Sync (Optional)")]
    public SkinnedMeshRenderer faceRenderer;
    [Tooltip("Common names include MouthOpen, mouthOpen, viseme_aa, viseme_O. Check the Unity Console on startup for available blend shape names on your avatar.")]
    public string[] mouthBlendShapeNames = { 
        // Optimized for Ready Player Me & High-Fidelity avatars
        "mouthOpen", "MouthOpen", "viseme_aa", "viseme_O", "viseme_E", "viseme_U", "viseme_kk", "viseme_CH",
        // Generic / Mixamo
        "OpenMouth", "JawOpen", "Jaw_Open",
        // MetaHuman / ARKit 
        "jawOpen", "mouthClose",
        // VRoid / VRM
        "A", "Oh", "Aa",
    };
    [Range(0f, 100f)] public float mouthBlendShapeMaxWeight = 100f;
    [Range(0f, 100f)] public float mouthBlendShapeRestWeight = 0f;
    [Range(0f, 1f)] public float mouthBlendShapeSmoothing = 0.2f;

    private bool _isSpeaking = false;
    private Quaternion _jawStartRot;
    private int[] _mouthBlendShapeIndices;
    private float _currentMouthWeight;

    void Start()
    {
        if (animator == null) animator = GetComponentInChildren<Animator>();
        if (faceRenderer == null)
            faceRenderer = FindFaceRenderer();

        if (jawBone != null) _jawStartRot = jawBone.localRotation;
        CacheMouthBlendShapes();
        ApplyMouthWeight(mouthBlendShapeRestWeight, true);
        
        Debug.Log($"[MockmateVR-Animation] Ready. Animator={animator != null} FaceRenderer={faceRenderer != null} JawBone={jawBone != null} BlendShapes={(_mouthBlendShapeIndices != null ? _mouthBlendShapeIndices.Length.ToString() : "0")}");
    }

    private SkinnedMeshRenderer FindFaceRenderer()
    {
        SkinnedMeshRenderer[] smrs = GetComponentsInChildren<SkinnedMeshRenderer>();
        string[] priorityKeywords = { "Renderer_Face", "Head", "Face", "Avatar" };

        // Phase 1: priority name match
        foreach (string kw in priorityKeywords)
            foreach (var smr in smrs)
                if (smr.sharedMesh != null && smr.sharedMesh.blendShapeCount > 0 &&
                    smr.name.IndexOf(kw, System.StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    Debug.Log($"[MockmateVR-Animation] Found face renderer (priority): {smr.name}");
                    LogBlendShapes(smr);
                    return smr;
                }

        // Phase 2: first renderer with ANY blend shapes
        foreach (var smr in smrs)
            if (smr.sharedMesh != null && smr.sharedMesh.blendShapeCount > 0)
            {
                Debug.Log($"[MockmateVR-Animation] Found renderer with blend shapes (fallback): {smr.name}");
                LogBlendShapes(smr);
                return smr;
            }

        Debug.LogWarning("[MockmateVR-Animation] No SkinnedMeshRenderer with blend shapes found. Lip sync will use Animator only.");
        return null;
    }

    private static void LogBlendShapes(SkinnedMeshRenderer smr)
    {
        if (smr.sharedMesh == null) return;
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        sb.AppendLine($"[MockmateVR-Animation] Blend shapes on '{smr.name}' ({smr.sharedMesh.blendShapeCount} total):");
        for (int i = 0; i < smr.sharedMesh.blendShapeCount; i++)
            sb.AppendLine($"  [{i}] {smr.sharedMesh.GetBlendShapeName(i)}");
        Debug.Log(sb.ToString());
    }


    [ContextMenu("Start Talking")]
    public void StartTalking()
    {
        Debug.Log("[MockmateVR-Animation] StartTalking called.");
        StopTyping();
        _isSpeaking = true;
        if (animator != null) animator.SetBool(talkBoolParam, true);
    }

    [ContextMenu("Stop Talking")]
    public void StopTalking()
    {
        Debug.Log("[MockmateVR-Animation] StopTalking called.");
        _isSpeaking = false;
        if (animator != null) animator.SetBool(talkBoolParam, false);
        if (jawBone != null) jawBone.localRotation = _jawStartRot;
        ApplyMouthWeight(mouthBlendShapeRestWeight, true);
    }

    [ContextMenu("Start Typing")]
    public void StartTyping()
    {
        Debug.Log("[MockmateVR-Animation] StartTyping called.");
        StopTalking();
        if (animateListeningState && animator != null && !string.IsNullOrWhiteSpace(typeBoolParam))
            animator.SetBool(typeBoolParam, true);
    }

    [ContextMenu("Stop Typing")]
    public void StopTyping()
    {
        if (animator != null && !string.IsNullOrWhiteSpace(typeBoolParam))
            animator.SetBool(typeBoolParam, false);
    }

    void Update()
    {
        bool updatedSpeakingPose = false;

        if (_isSpeaking && jawBone != null)
        {
            // Multi-frequency noise for more natural jaw movement
            float noise = Mathf.PerlinNoise(Time.time * talkSpeed * 0.7f, 0f) * 0.5f + 
                          Mathf.PerlinNoise(Time.time * talkSpeed * 1.5f, 100f) * 0.5f;
            float targetAngle = Mathf.Abs(Mathf.Sin(Time.time * talkSpeed + (noise * talkJitter * 10f))) * jawOpenAmount;
            
            // Apply smoothing
            jawBone.localRotation = Quaternion.Slerp(jawBone.localRotation, _jawStartRot * Quaternion.Euler(targetAngle, 0, 0), 0.3f);
            updatedSpeakingPose = true;
        }

        if (_isSpeaking && HasMouthBlendShapes())
        {
            float noise = Mathf.PerlinNoise(100f, Time.time * talkSpeed * 0.7f);
            float targetWeight = Mathf.Abs(Mathf.Sin(Time.time * talkSpeed + (noise * talkJitter * 10f))) * mouthBlendShapeMaxWeight;
            ApplyMouthWeight(targetWeight, false);
            updatedSpeakingPose = true;
        }

        // Fallback when no jaw bone and no blend shapes: animate the avatar's transform
        // with a subtle head-nod so the user can see the interviewer is "speaking".
        if (_isSpeaking && !updatedSpeakingPose && animator != null)
        {
            // Handled by Animator's isTalking bool state — nothing extra needed here.
            updatedSpeakingPose = true;
        }

        if (!_isSpeaking && HasMouthBlendShapes())
        {
            ApplyMouthWeight(mouthBlendShapeRestWeight, false);
        }
    }

    private void CacheMouthBlendShapes()
    {
        if (faceRenderer == null)
            faceRenderer = GetComponentInChildren<SkinnedMeshRenderer>();

        Mesh sharedMesh = faceRenderer != null ? faceRenderer.sharedMesh : null;
        if (sharedMesh == null || sharedMesh.blendShapeCount == 0)
        {
            _mouthBlendShapeIndices = null;
            return;
        }

        System.Collections.Generic.List<int> indices = new System.Collections.Generic.List<int>();
        foreach (string shapeName in mouthBlendShapeNames)
        {
            if (string.IsNullOrWhiteSpace(shapeName))
                continue;

            int index = sharedMesh.GetBlendShapeIndex(shapeName);
            if (index >= 0 && !indices.Contains(index))
                indices.Add(index);
        }

        _mouthBlendShapeIndices = indices.Count > 0 ? indices.ToArray() : null;
    }

    private bool HasMouthBlendShapes()
    {
        return faceRenderer != null && _mouthBlendShapeIndices != null && _mouthBlendShapeIndices.Length > 0;
    }

    private void ApplyMouthWeight(float targetWeight, bool immediate)
    {
        if (!HasMouthBlendShapes())
            return;

        float clampedTarget = Mathf.Clamp(targetWeight, 0f, 100f);
        _currentMouthWeight = immediate
            ? clampedTarget
            : Mathf.Lerp(_currentMouthWeight, clampedTarget, 1f - Mathf.Pow(1f - mouthBlendShapeSmoothing, Time.deltaTime * 60f));

        for (int i = 0; i < _mouthBlendShapeIndices.Length; i++)
            faceRenderer.SetBlendShapeWeight(_mouthBlendShapeIndices[i], _currentMouthWeight);
    }
}
