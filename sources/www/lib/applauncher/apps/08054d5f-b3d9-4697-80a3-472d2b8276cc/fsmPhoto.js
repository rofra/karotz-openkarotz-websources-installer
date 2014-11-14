(function() {
  var photoRunning, phrasePostPhoto;
  phrasePostPhoto = null;
  photoRunning = true;
  photoFsm.run = function(phrasePostMessage, cb) {
    photoFsm.onEnd = function() {
      photoRunning = false;
      photoFsm.next();
      if (cb) {
        return cb();
      }
    };
    if (phrasePostMessage === null || phrasePostMessage === void 0) {
      log("photoFsm.run phrasePostMessage error");
      karotz.chain.play(__("audio.error")).exec(function() {
        photoRunning = false;
        return photoFsm.error();
      });
      return;
    }
    return karotz.chain.tts(__("photo.begin"), mainLang).exec(function() {
      photoRunning = true;
      if (photoFsm.can("photo")) {
        return photoFsm.photo(phrasePostMessage);
      } else {
        return log("######## can NOT PHOTO");
      }
    });
  };
  photoFsm.onPhoto = function(phrasePostPhoto) {
    log("onPhoto");
    log("onPhoto : " + phrasePostPhoto);
    led.waitUser();
    return karotz.webcam.photo("file", function(event) {
      var msgSent, retTwitter;
      log("PHOTO CB: " + event.type);
      led.work();
      if (event.type !== 'TERMINATED') {
        return;
      }
      if (photoRunning === false) {
        photoFsm.stop();
        return;
      }
      retTwitter = {};
      if (useTwitter) {
        log("SEND TWITTER PHOTO");
        retTwitter = social.twitter.sendMediaMsg(phrasePostPhoto, event.data);
      }
      log("retTwitter: " + JSON.stringify(retTwitter));
      if (!retTwitter.error) {
        retTwitter.error = 0;
      }
      if (retTwitter.error) {
        karotz.tts.voices[mainLang].say(__("photo.error"), function(event) {
          if (event === "TERMINATED") {
            return photoFsm.error();
          }
        });
        return karotz.chain.play(__("audio.error")).tts(__("photo.error"), mainLang).exec(function() {
          return photoFsm.error();
        });
      } else {
        if (__("photo.label") === phrasePostPhoto) {
          if (useFacebook) {
            msgSent = __("photoF.done");
          } else if (useTwitter) {
            msgSent = __("photoT.done");
          }
        } else {
          if (useFacebook) {
            msgSent = __("photomessageF.done");
          } else if (useTwitter) {
            msgSent = __("photomessageT.done");
          }
        }
        return karotz.chain.play(__("audio.ok")).tts(msgSent, mainLang).exec(function() {
          return photoFsm.stop();
        });
      }
    });
  };
}).call(this);
