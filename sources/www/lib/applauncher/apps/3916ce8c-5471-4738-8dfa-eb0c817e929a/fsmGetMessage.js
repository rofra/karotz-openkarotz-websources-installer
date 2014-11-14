(function() {
  var phraseGetMessage, sound;
  sound = null;
  phraseGetMessage = null;
  getMessageFsm.run = function(cb) {
    log("################# getMEssage");
    log("################# getMessageFsm.current : " + getMessageFsm.current);
    getMessageFsm.onAccept = function() {
      led.work();
      getMessageFsm.stop();
      if (cb) {
        return cb(phraseGetMessage);
      }
    };
    getMessageFsm.onCancel = function() {
      getMessageFsm.stop();
      if (cb) {
        return cb(null);
      }
    };
    led.waitUser();
    return karotz.chain.tts(__("getMessage.record"), mainLang).exec(function() {
      if (getMessageFsm.can("getMessage")) {
        return getMessageFsm.getMessage();
      }
    });
  };
  getMessageFsm.onRecordMessage = function() {
    log("onRecordSound");
    sound = null;
    return karotz.multimedia.record(function(event) {
      log("record callback: " + JSON.stringify(event));
      if (event.type !== "TERMINATED" && event.type !== "CANCEL") {
        return;
      }
      sound = event.data;
      return karotz.chain.play(__("audio.ok")).exec(function() {
        return getMessageFsm.next();
      });
    });
  };
  getMessageFsm.onConvertMessage = function() {
    log("googleAsr");
    led.work();
    phraseGetMessage = google.asr(sound, mainLang);
    log("googleASR recognize " + phraseGetMessage);
    if (phraseGetMessage === void 0 || phraseGetMessage === null) {
      led.waitUser();
      return karotz.chain.play(__("audio.error")).tts(__("getMessage.errorReco"), mainLang).exec(function() {
        return getMessageFsm.retry();
      });
    } else {
      log("CHAIN");
      led.waitUser();
      if (phraseGetMessage.length > 140) {
        phraseGetMessage = phraseGetMessage.substr(0, 139);
      }
      return karotz.chain.tts(__("getMessage.understand") + ": " + phraseGetMessage + ". " + __("getMessage.understandEnd"), mainLang).exec(function() {
        log("CHAIN CB");
        return setTimeout(10000, function() {
          if (getMessageFsm.current === "ConvertMessage") {
            return getMessageFsm.stop();
          }
        });
      });
    }
  };
  getMessageFsm.onStopRecordMessage = function() {
    log("onStopRecordMessage");
    return karotz.multimedia.stop();
  };
}).call(this);
