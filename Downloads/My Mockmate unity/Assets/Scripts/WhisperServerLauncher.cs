using System.IO;
using UnityEngine;

public class WhisperServerLauncher : MonoBehaviour
{
#if !UNITY_WEBGL || UNITY_EDITOR
    [SerializeField] private bool autoStartOnAwake = true;
    [SerializeField] private int port = 8081;
    [SerializeField] private int threads = 8;

    private System.Diagnostics.Process whisperProcess;
    public bool IsRunning => whisperProcess != null && !whisperProcess.HasExited;

    private void Start()
    {
        if (autoStartOnAwake)
            EnsureStarted();
    }

    public bool EnsureStarted()
    {
        if (IsRunning) return true;

        string whisperFolder = Path.Combine(Application.streamingAssetsPath, "whisper");
        string exePath = Path.Combine(whisperFolder, "whisper-server.exe");
        string modelPath = Path.Combine(whisperFolder, "ggml-base.en.bin");

        if (!File.Exists(exePath))
        {
            Debug.LogError("Whisper executable not found: " + exePath);
            return false;
        }
        if (!File.Exists(modelPath))
        {
            Debug.LogError("Whisper model not found: " + modelPath);
            return false;
        }

        var psi = new System.Diagnostics.ProcessStartInfo
        {
            FileName = exePath,
            Arguments = $"-m \"{modelPath}\" -p {port} -t {Mathf.Max(1, threads)}",
            WorkingDirectory = whisperFolder,
            CreateNoWindow = true,
            UseShellExecute = false
        };

        whisperProcess = System.Diagnostics.Process.Start(psi);
        if (whisperProcess == null)
        {
            Debug.LogError("Failed to start Whisper server process.");
            return false;
        }

        Debug.Log($"Whisper server started on port {port}.");
        return true;
    }

    private void OnApplicationQuit()
    {
        if (IsRunning)
        {
            whisperProcess.Kill();
            Debug.Log("Whisper server stopped.");
        }
    }
#else
    // WebGL: Whisper runs via browser JS bridge (WebGLWhisperSTT.jslib)
    private void Start()
    {
        Debug.Log("[WhisperServerLauncher] Skipped on WebGL — using JS bridge instead.");
    }
    public bool EnsureStarted() => false;
    public bool IsRunning => false;
#endif
}
