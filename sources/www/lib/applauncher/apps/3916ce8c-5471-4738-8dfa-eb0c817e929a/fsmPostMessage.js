(function() {
  postMessageFsm.run = function(phrasePostMessage, cb) {
    postMessageFsm.onEnd = function() {
      if (cb) {
        return cb();
      }
    };
    return postMessageFsm.postMessage(phrasePostMessage);
  };
  postMessageFsm.onPostMessage = function(phrasePostMessage) {
    var msgSent, retFb, retTwitter;
    log("onPostMessage");
    if (phrasePostMessage === null || phrasePostMessage === void 0) {
      log("onPostMessage null message");
      postMessageFsm.stop();
      return;
    }
    led.work();
    retTwitter = {};
    retFb = {};
    if (useFacebook) {
      log("SEND FB MSG");
      retFb = social.facebook.postMessage(phrasePostMessage);
    }
    if (useTwitter) {
      log("SEND TWITTER MSG");
      retTwitter = social.twitter.sendMsg(phrasePostMessage);
    }
    log("retFb: " + JSON.stringify(retFb));
    log("retTwitter: " + JSON.stringify(retTwitter));
    if (!retTwitter.error) {
      retTwitter.error = 0;
    }
    if (!retFb.error) {
      retFb.error = 0;
    }
    if (retFb.error && retTwitter.error) {
      karotz.tts.voices[mainLang].say(__("postMessage.error"), function(event) {
        if (event === "TERMINATED") {
          return postMessageFsm.error();
        }
      });
      return karotz.chain.play(__("audio.error")).tts(__("postMessage.error.twitter"), mainLang).exec(function() {
        return postMessageFsm.error();
      });
    } else if (retFb.error) {
      karotz.tts.voices[mainLang].say(__("postMessage.error.facebook"), function(event) {
        if (event === "TERMINATED") {
          return postMessageFsm.error();
        }
      });
      return karotz.chain.play(__("audio.error")).tts(__("postMessage.error.facebook"), mainLang).exec(function() {
        return postMessageFsm.error();
      });
    } else if (retTwitter.error) {
      karotz.tts.voices[mainLang].say(__("postMessage.error.twitter"), function(event) {
        if (event === "TERMINATED") {
          return postMessageFsm.error();
        }
      });
      return karotz.chain.play(__("audio.error")).tts(__("postMessage.error.twitter"), mainLang).exec(function() {
        return postMessageFsm.error();
      });
    } else {
      msgSent = __("postMessage.messageSent");
      return karotz.chain.play(__("audio.ok")).tts(msgSent, mainLang).exec(function() {
        return postMessageFsm.stop();
      });
    }
  };
}).call(this);
