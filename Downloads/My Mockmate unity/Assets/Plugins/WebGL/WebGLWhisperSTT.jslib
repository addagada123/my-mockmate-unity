var WebGLWhisperSTT = {
    $whisperData: {
        recorder: null,
        chunks: [],
        apiKey: "",
        unityObjectName: "",
        unityMethodName: ""
    },

    InitWhisperSTT: function (apiKey, objectName, methodName) {
        whisperData.apiKey = UTF8ToString(apiKey);
        whisperData.unityObjectName = UTF8ToString(objectName);
        whisperData.unityMethodName = UTF8ToString(methodName);
        console.log("WhisperSTT Initialized for: " + whisperData.unityObjectName);
    },

    StartRecording: function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("Microphone not supported in this browser.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                whisperData.chunks = [];
                whisperData.recorder = new MediaRecorder(stream);
                whisperData.recorder.ondataavailable = function (e) {
                    whisperData.chunks.push(e.data);
                };
                whisperData.recorder.onstop = function () {
                    if (whisperData.vadInterval) { clearInterval(whisperData.vadInterval); }
                    var blob = new Blob(whisperData.chunks, { type: 'audio/wav' });
                    SendToWhisper(blob);
                    
                    // Stop all tracks to release microphone
                    stream.getTracks().forEach(track => track.stop());
                };
                whisperData.recorder.start();
                console.log("Recording started...");

                // --- VAD Logic ---
                try {
                    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    if (AudioContextClass) {
                        var audioCtx = new AudioContextClass();
                        var source = audioCtx.createMediaStreamSource(stream);
                        var analyser = audioCtx.createAnalyser();
                        analyser.fftSize = 512;
                        source.connect(analyser);
                        
                        var dataArray = new Uint8Array(analyser.frequencyBinCount);
                        var silenceStart = Date.now();
                        var isSpeaking = false;
                        var silenceThreshold = 5; 
                        var silenceDelayMs = 3500;
                        
                        whisperData.vadInterval = setInterval(function() {
                            if (!whisperData.recorder || whisperData.recorder.state === "inactive") {
                                clearInterval(whisperData.vadInterval);
                                return;
                            }
                            
                            analyser.getByteFrequencyData(dataArray);
                            var sum = 0;
                            for (var i = 0; i < dataArray.length; i++) { sum += dataArray[i]; }
                            var average = sum / dataArray.length;
                            
                            if (average > silenceThreshold) {
                                isSpeaking = true;
                                silenceStart = Date.now();
                            } else {
                                if (isSpeaking && (Date.now() - silenceStart > silenceDelayMs)) {
                                    console.log("WebGL VAD: Silence detected! Auto-stopping recording.");
                                    isSpeaking = false;
                                    clearInterval(whisperData.vadInterval);
                                    whisperData.recorder.stop();
                                    SendMessage(whisperData.unityObjectName, "OnRecordingAutoStopped", "");
                                }
                            }
                        }, 100);
                    }
                } catch(e) {
                    console.error("VAD Setup Error:", e);
                }
                // --- End VAD Logic ---
            })
            .catch(function (err) {
                console.error("Error accessing microphone: " + err);
            });
    },

    StopRecording: function () {
        if (whisperData.recorder && whisperData.recorder.state !== "inactive") {
            whisperData.recorder.stop();
            console.log("Recording stopped.");
        }
    },

    $SendToWhisper: function (blob) {
        var formData = new FormData();
        formData.append("file", blob, "recording.wav");
        formData.append("model", "whisper-1");

        fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + whisperData.apiKey
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            var transcript = data.text || "";
            SendMessage(whisperData.unityObjectName, whisperData.unityMethodName, transcript);
        })
        .catch(error => {
            console.error("Whisper API Error: ", error);
            SendMessage(whisperData.unityObjectName, whisperData.unityMethodName, "ERROR: " + error.message);
        });
    }
};

autoAddDeps(WebGLWhisperSTT, '$whisperData');
autoAddDeps(WebGLWhisperSTT, '$SendToWhisper');
mergeInto(LibraryManager.library, WebGLWhisperSTT);
