var WebGLWhisperSTT = {
    $whisperData: {
        recorder: null,
        chunks: [],
        apiKey: "",
        language: "en",
        unityObjectName: "",
        unityMethodName: ""
    },

    InitWhisperSTT: function (apiKey, language, objectName, methodName) {
        _whisperData.apiKey = UTF8ToString(apiKey);
        _whisperData.language = UTF8ToString(language);
        _whisperData.unityObjectName = UTF8ToString(objectName);
        _whisperData.unityMethodName = UTF8ToString(methodName);
        console.log("WhisperSTT Initialized for: " + _whisperData.unityObjectName + " (Lang: " + _whisperData.language + ")");
    },

    StartRecording: function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("Microphone not supported in this browser.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                _whisperData.chunks = [];
                _whisperData.recorder = new MediaRecorder(stream);
                _whisperData.recorder.ondataavailable = function (e) {
                    _whisperData.chunks.push(e.data);
                };
                _whisperData.recorder.onstop = function () {
                    if (_whisperData.vadInterval) { clearInterval(_whisperData.vadInterval); }
                    var blob = new Blob(_whisperData.chunks, { type: 'audio/wav' });
                    _SendToWhisper(blob);
                    
                    // Stop all tracks to release microphone
                    stream.getTracks().forEach(function(track) { track.stop(); });
                };
                _whisperData.recorder.start();
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
                        
                        _whisperData.vadInterval = setInterval(function() {
                            if (!_whisperData.recorder || _whisperData.recorder.state === "inactive") {
                                clearInterval(_whisperData.vadInterval);
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
                                    clearInterval(_whisperData.vadInterval);
                                    _whisperData.recorder.stop();
                                    SendMessage(_whisperData.unityObjectName, "OnRecordingAutoStopped", "");
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
        if (_whisperData.recorder && _whisperData.recorder.state !== "inactive") {
            _whisperData.recorder.stop();
            console.log("Recording stopped.");
        }
    },

    $SendToWhisper: function (blob) {
        var formData = new FormData();
        formData.append("file", blob, "recording.wav");
        formData.append("model", "whisper-1");
        if (_whisperData.language) {
            formData.append("language", _whisperData.language);
        }

        fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + _whisperData.apiKey
            },
            body: formData
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var transcript = data.text || "";
            SendMessage(_whisperData.unityObjectName, _whisperData.unityMethodName, transcript);
        })
        .catch(function(error) {
            console.error("Whisper API Error: ", error);
            SendMessage(_whisperData.unityObjectName, _whisperData.unityMethodName, "ERROR: " + error.message);
        });
    }
};

autoAddDeps(WebGLWhisperSTT, '$whisperData');
autoAddDeps(WebGLWhisperSTT, '$SendToWhisper');
mergeInto(LibraryManager.library, WebGLWhisperSTT);
