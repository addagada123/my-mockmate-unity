mergeInto(LibraryManager.library, {
    SpeakNative: function (text, objectName) {
        if (window.speakNative) {
            window.speakNative(UTF8ToString(text), UTF8ToString(objectName));
        } else {
            console.error("[WebSpeech-JSLib] speakNative not found in index.html");
        }
    },

    StartNativeSTT: function (objectName) {
        if (window.startNativeSTT) {
            window.startNativeSTT(UTF8ToString(objectName));
        } else {
            console.error("[WebSpeech-JSLib] startNativeSTT not found in index.html");
        }
    }
});
