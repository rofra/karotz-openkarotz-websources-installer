(function() {
  var isAlreadyOnEnd;
  fsm.onFacebookRun = function() {
    return readFacebookFsm.run(function() {
      return fsm.next();
    });
  };
  fsm.onFacebookNotificationRun = function() {
    if (!useFacebook) {
      return readFacebookFsm.noConf(function() {
        return fsm.next();
      });
    } else {
      return readFacebookFsm.runNotification(function() {
        return fsm.next();
      });
    }
  };
  fsm.onFacebookRunAsr = function() {
    if (!useFacebook) {
      return readFacebookFsm.noConf(function() {
        return fsm.next();
      });
    } else {
      return readFacebookFsm.run(function() {
        return fsm.next();
      });
    }
  };
  isAlreadyOnEnd = 0;
  fsm.onExit = function() {
    if (isAlreadyOnEnd) {
      return;
    }
    isAlreadyOnEnd = 1;
    return karotz.multimedia.play(__("audio.stop"), function(event) {
      if (event !== "OK") {
        return exit();
      }
    });
  };
  fsm.onFacebookRunScheduler = function() {
    return readFacebookFsm.run(function() {
      return fsm.next();
    });
  };
  fsm.onTwitterRun = function() {
    return readTwitterFsm.run(function() {
      return fsm.next();
    });
  };
  fsm.onTwitterRunAsr = function() {
    if (!useTwitter) {
      return readTwitterFsm.noConf(function() {
        return fsm.next();
      });
    } else {
      return readTwitterFsm.run(function() {
        return fsm.next();
      });
    }
  };
  fsm.onTwitterRunScheduler = function() {
    return readTwitterFsm.run(function() {
      return fsm.next();
    });
  };
  fsm.onPostPhoto = function() {
    return photoFsm.run(__("photo.label"), function() {
      return fsm.next();
    });
  };
  fsm.onPostSound = function() {
    return soundFsm.run(function() {
      return fsm.next();
    });
  };
  fsm.onRecordPostMessage = function() {
    return getMessageFsm.run(function(phraseGetMessage) {
      return postMessageFsm.run(phraseGetMessage, function() {
        return fsm.next();
      });
    });
  };
  fsm.onRecordPostMessagePhoto = function() {
    return getMessageFsm.run(function(phraseGetMessage) {
      return photoFsm.run(phraseGetMessage, function() {
        return fsm.next();
      });
    });
  };
}).call(this);
