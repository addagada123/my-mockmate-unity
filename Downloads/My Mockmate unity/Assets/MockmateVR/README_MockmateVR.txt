Mockmate VR Integration (already added)

What was added:
- MockmateVRApiClient.cs
- MockmateVRInterviewManager.cs
- MockmateVRAutoBootstrap.cs

How to run:
1) Start backend + frontend from My Mockmate project.
2) In web app: open test -> select difficulty -> click "Take Test in VR".
3) Copy the shown bridge_token.
4) Play this Unity scene.
5) In top-left debug panel:
   - paste API Base (example: http://127.0.0.1:8000)
   - paste bridge_token
   - click "Apply Config"
   - click "Start Interview"
6) Flow:
   - question fetched from backend
   - avatar talking bool "isTalking" toggles automatically
   - click "Listen" and answer (Windows editor/standalone uses DictationRecognizer STT)
   - click "Submit" to save score and go next
7) After final question, completion is auto-posted to backend performance data.

Notes:
- If speech recognition is unavailable on device, type transcript directly in the Transcript box and submit.
- If your animator uses another bool parameter, open MockmateVRManager in runtime and change "talkingBoolParameter".
