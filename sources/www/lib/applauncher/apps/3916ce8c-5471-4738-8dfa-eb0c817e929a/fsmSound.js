(function() {
  var sound;
  sound = null;
  soundFsm.run = function(cb) {
    soundFsm.onEnd = function() {
      if (cb) {
        return cb();
      }
    };
    if (!social.soundcloud.post) {
      log("noSoundcloud post undefined -> notoken");
      return soundFsm.noToken();
    } else {
      return karotz.chain.tts(__("sound.record"), mainLang).exec(function() {
        if (soundFsm.can("sound")) {
          return soundFsm.sound();
        }
      });
    }
  };
  soundFsm.onNoToken = function() {
    karotz.multimedia.stop();
    karotz.ears.reset();
    led.readTwitter();
    return karotz.chain.play(__("audio.error")).tts(__("message.error.soundcloud"), mainLang).exec(function() {
      log("onNoToken");
      return soundFsm.next();
    });
  };
  soundFsm.onRecordSound = function() {
    log("onRecordSound");
    sound = null;
    led.waitUser();
    return karotz.multimedia.record(function(event) {
      log("record callback: " + JSON.stringify(event));
      if (event.type !== "TERMINATED" && event.type !== "CANCEL") {
        return;
      }
      sound = event.data;
      return soundFsm.next();
    });
  };
  soundFsm.onStopRecordSound = function() {
    log("onStopRecordSound");
    return karotz.multimedia.stop();
  };
  soundFsm.onPostSound = function() {
    var msg, rtnSocialPost;
    log("onPostSound");
    led.work();
    msg = __("sound.title");
    log("msg " + msg);
    rtnSocialPost = social.soundcloud.postSound(sound, msg);
    return social.soundcloud.shareForce(rtnSocialPost.id, useFacebook, false, msg, function(rtn) {
      var msgSent;
      log("callback: rtn: " + rtn);
      if (rtn < 0) {
        return karotz.chain.tts(__("sound.error"), mainLang).exec(function() {
          return soundFsm.next();
        });
      } else {
        msgSent = __("sound.done");
        return karotz.chain.tts(msgSent, mainLang).exec(function() {
          return soundFsm.next();
        });
      }
    });
  };
}).call(this);
