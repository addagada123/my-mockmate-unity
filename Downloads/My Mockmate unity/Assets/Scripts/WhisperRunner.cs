using UnityEngine;

public class WhisperRunner : MonoBehaviour
{
    public STTClient stt;

    public void Transcribe(string audioPath)
    {
#if !UNITY_WEBGL || UNITY_EDITOR
        string exe = Application.streamingAssetsPath + "/whisper/main.exe";
        string model = Application.streamingAssetsPath + "/whisper/ggml-base.en.bin";

        System.Diagnostics.ProcessStartInfo psi = new System.Diagnostics.ProcessStartInfo();
        psi.FileName = exe;
        psi.Arguments = $"-m \"{model}\" -f \"{audioPath}\" -nt -otxt";
        psi.RedirectStandardOutput = true;
        psi.UseShellExecute = false;
        psi.CreateNoWindow = true;

        System.Diagnostics.Process process = System.Diagnostics.Process.Start(psi);
        string output = process.StandardOutput.ReadToEnd();
        process.WaitForExit();

        Debug.Log("Whisper Output:\n" + output);
        if (stt != null)
            stt.OnSpeechRecognized(output);
#else
        Debug.LogWarning("[WhisperRunner] Process.Start not supported on WebGL. Use WebGLWhisperSTT instead.");
#endif
    }
}