var WebGLWhisperSTT = {
    InitWhisperSTT: function (bridgeToken, apiBase, language, objectName, methodName) {
        // Merge with _whisperData so bridge_token set by index.html is available
        var existing = window._whisperData || {};
        window.WebGLWhisperState = {
            recorder: null,
            chunks: [],
            bridgeToken: UTF8ToString(bridgeToken) || existing.bridgeToken || "",
            apiBase: UTF8ToString(apiBase) || existing.apiBase || "",
            language: UTF8ToString(language) || existing.language || "en",
            unityObjectName: UTF8ToString(objectName),
            unityMethodName: UTF8ToString(methodName)
        };
        // Keep _whisperData in sync
        window._whisperData = window.WebGLWhisperState;
        console.log("WhisperSTT Initialized via Proxy: " + window.WebGLWhisperState.apiBase);
    },

    StartRecording: function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("Microphone not supported in this browser.");
            return;
        }

        if (!window.WebGLWhisperState) window.WebGLWhisperState = {};

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                window.WebGLWhisperState.chunks = [];
                window.WebGLWhisperState.recorder = new MediaRecorder(stream);
                window.WebGLWhisperState.recorder.ondataavailable = function (e) {
                    window.WebGLWhisperState.chunks.push(e.data);
                };
                window.WebGLWhisperState.recorder.onstop = function () {
                    if (window.WebGLWhisperState.vadInterval) { clearInterval(window.WebGLWhisperState.vadInterval); }
                    var blob = new Blob(window.WebGLWhisperState.chunks, { type: 'audio/wav' });

                    // --- Inline SendToWhisper logic ---
                    var state = window.WebGLWhisperState;
                    var formData = new FormData();
                    formData.append("file", blob, "recording.wav");
                    
                    var url = state.apiBase + "/vr-bridge/transcribe?bridge_token=" + encodeURIComponent(state.bridgeToken);
                    if (state.language) {
                        url += "&language=" + encodeURIComponent(state.language);
                    }

                    fetch(url, {
                        method: "POST",
                        body: formData
                    })
                    .then(function(response) { 
                        if (!response.ok) throw new Error("Proxy error: " + response.status);
                        return response.json(); 
                    })
                    .then(function(data) {
                        var transcript = (data.text || "").trim();
                        // Only forward to Unity if we got actual speech content
                        if (transcript) {
                            SendMessage(state.unityObjectName, state.unityMethodName, transcript);
                        } else {
                            console.warn("[WhisperSTT] Empty transcript returned - skipping SendMessage.");
                        }
                    })
                    .catch(function(error) {
                        // CRITICAL FIX: Do NOT send "ERROR:..." strings to Unity.
                        // If they reach Unity they get appended to the transcript and
                        // submitted as the user's answer, causing 409 index conflicts.
                        console.warn("[WhisperSTT] Transcription failed (will not send to Unity):", error.message);
                    });
                    // --- End Inline SendToWhisper ---
                    
                    // Stop all tracks to release microphone
                    stream.getTracks().forEach(function(track) { track.stop(); });
                };
                window.WebGLWhisperState.recorder.start();
                console.log("Recording started (Proxy mode)...");

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
                        
                        window.WebGLWhisperState.vadInterval = setInterval(function() {
                            if (!window.WebGLWhisperState.recorder || window.WebGLWhisperState.recorder.state === "inactive") {
                                clearInterval(window.WebGLWhisperState.vadInterval);
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
                                    clearInterval(window.WebGLWhisperState.vadInterval);
                                    window.WebGLWhisperState.recorder.stop();
                                    SendMessage(window.WebGLWhisperState.unityObjectName, "OnRecordingAutoStopped", "");
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
        if (window.WebGLWhisperState && window.WebGLWhisperState.recorder && window.WebGLWhisperState.recorder.state !== "inactive") {
            window.WebGLWhisperState.recorder.stop();
            console.log("Recording stopped.");
        }
    }
};

mergeInto(LibraryManager.library, WebGLWhisperSTT);

