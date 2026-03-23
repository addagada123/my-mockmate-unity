using UnityEngine;

public class MockmateVRSttBridge : MonoBehaviour
{
    [SerializeField] private STTClient sttClient;
    [SerializeField] private MockmateVRFlowController flowController;

    private void Awake()
    {
        if (sttClient == null)
            sttClient = FindFirstObjectByType<STTClient>();
        if (flowController == null)
            flowController = FindFirstObjectByType<MockmateVRFlowController>();
    }

    private void OnEnable()
    {
        if (sttClient != null)
            sttClient.OnTranscriptChunk.AddListener(ForwardChunk);
    }

    private void OnDisable()
    {
        if (sttClient != null)
            sttClient.OnTranscriptChunk.RemoveListener(ForwardChunk);
    }

    private void ForwardChunk(string textChunk)
    {
        if (flowController == null || string.IsNullOrWhiteSpace(textChunk))
            return;

        flowController.AppendTranscriptChunk(textChunk);
    }
}
