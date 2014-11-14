(function() {
  var audioReg, cachedNames, dMsg, dMsgIdx, dThreadMsgIdx, friends, gMsg, getLang, getUserInfoCache, getUserVoice, initIdF, isLastIdF, lastReadMail, notif, notifIdx, setNextIdF, stream, streamIdx, wall, wallIdx;
  wallIdx = -1;
  wall = [];
  notif = [];
  notifIdx = -1;
  dMsg = [];
  dMsgIdx = -1;
  dThreadMsgIdx = 0;
  stream = [];
  streamIdx = -1;
  friends = [];
  lastReadMail = "";
  gMsg = "";
  audioReg = new RegExp('([^#]+)');
  cachedNames = {};
  getUserInfoCache = function(userId) {
    if (!cachedNames[userId]) {
      cachedNames[userId] = social.facebook.getUserInfo(userId);
    }
    return cachedNames[userId];
  };
  initIdF = function(len) {
    if (readOrder === "chrono") {
      return len - 1;
    } else {
      return 0;
    }
  };
  setNextIdF = function(id) {
    if (readOrder === "chrono") {
      return id - 1;
    } else {
      return id + 1;
    }
  };
  isLastIdF = function(id, len) {
    if (readOrder === "chrono" && id < 0) {
      return 1;
    } else if (readOrder === "antechrono" && (id > len - 1 || id < 0)) {
      return 1;
    } else {
      return 0;
    }
  };
  getUserVoice = function(from, lang) {
    var gender, tmpId, voice, voices;
    try {
      log("from: " + JSON.stringify(from));
      gender = from.gender === "female" ? "F" : "M";
      voices = karotz.tts.filter({
        "lang": lang,
        "sex": gender
      });
      tmpId = parseInt(from.id);
      log("tmpId: " + tmpId);
      log("voices length: " + voices.length);
      log("" + tmpId % voices.length);
      voice = voices[tmpId % voices.length];
    } catch (error) {
      log(error);
      voice = karotz.tts.voices[msgLang];
    }
    return voice != null ? voice : voice = karotz.tts.voices["en"];
  };
  getLang = function(txt) {
    var tmpLang;
    if (langType === "auto") {
      tmpLang = google.getLang(txt);
      if (tmpLang === null) {
        tmpLang = mainLang;
      }
    } else {
      tmpLang = langType;
    }
    return tmpLang;
  };
  readFacebookFsm.run = function(cb) {
    readFacebookFsm.onEnd = cb;
    return readFacebookFsm.readFacebook();
  };
  readFacebookFsm.runNotification = function(cb) {
    readFacebookFsm.onEnd = cb;
    return readFacebookFsm.readNotification();
  };
  readFacebookFsm.onFacebookNoConfError = function(cb) {
    log("onFacebookNoConfError");
    led.readFacebook();
    readFacebookFsm.onEnd = cb;
    gMsg = __("message.error.noConf", {
      name: __("facebook")
    });
    return karotz.chain.play(__("audio.error")).tts(gMsg, mainLang).exec(function() {
      return readFacebookFsm.stop();
    });
  };
  readFacebookFsm.onFacebookNotification = function() {
    var msg;
    log("onFacebookNotification");
    log("onFacebookNotification notif.length : " + notif.length);
    if (isLastIdF(notifIdx, notif.length)) {
      if (notif.length > 0) {
        karotz.chain.tts(__("notif.end"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
      } else {
        readFacebookFsm.stop();
      }
      return;
    }
    log("idx: " + notifIdx);
    log("created_time: " + notif[notifIdx].created_time);
    social.facebook.saveLastNotification(notif[notifIdx].created_time);
    msg = "";
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon1, "");
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon2, "");
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon3, "");
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon4, "");
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon1, "");
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon2, "");
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon3, "");
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon4, "");
    if (parentalControl) {
      notif[notifIdx].title_text = assCleaner(notif[notifIdx].title_text);
      notif[notifIdx].body_text = assCleaner(notif[notifIdx].body_text);
    }
    msg += notif[notifIdx].title_text + " : " + notif[notifIdx].body_text + ". ";
    log(msg);
    return karotz.chain.tts(msg, mainLang).exec(function() {
      if (readFacebookFsm.current === "FacebookNotification") {
        return readFacebookFsm.next();
      }
    });
  };
  readFacebookFsm.onFacebookNotificationStop = function() {
    log("onFacebookNotificationStop");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookNotificationSkip = function() {
    log("onFacebookNotificationSkip");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookNotificationNext = function() {
    log("onFacebookNotificationNext");
    notifIdx--;
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookInit = function() {
    var data, sum, ttsCb;
    log("onFacebookInit");
    led.work();
    wallIdx = -1;
    wall = [];
    notif = [];
    notifIdx = -1;
    dMsg = [];
    dMsgIdx = -1;
    dThreadMsgIdx = 0;
    stream = [];
    streamIdx = -1;
    friends = [];
    gMsg = __("facebook") + " : " + __("message.youhave");
    if (useFacebookDMsg) {
      dMsg = social.facebook.getMail(social.facebook.getLastMail());
      if (dMsg.error_code) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.facebook"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
        return;
      }
      if (dMsg.length > 0) {
        if (dMsg.length > 1) {
          gMsg += __("message.new.facebook.dmsg.pl", {
            num: dMsg.length
          }) + ", ";
        } else {
          gMsg += __("message.new.facebook.dmsg.s", {
            num: dMsg.length
          }) + ",) ";
        }
      }
      dMsgIdx = initIdF(dMsg.length);
    }
    if (useFacebookNotification) {
      log("getuseFacebookNotification");
      notif = social.facebook.getNotification(social.facebook.getLastNotification());
      if (notif.error_code) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.facebook"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
        return;
      }
      if (notif.length > 0) {
        if (notif.length > 1) {
          gMsg += __("message.new.facebook.notif.pl", {
            num: notif.length
          }) + ", ";
        } else {
          gMsg += __("message.new.facebook.notif.s", {
            num: notif.length
          }) + ", ";
        }
      }
      notifIdx = initIdF(notif.length);
    }
    if (useFacebookWall) {
      log("getWall");
      wall = social.facebook.getWall(social.facebook.getLastWall());
      if (wall.error_code) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.facebook"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
        return;
      }
      if (wall.length > 0) {
        if (wall.length > 1) {
          gMsg += __("message.new.facebook.wall.pl", {
            num: wall.length
          }) + ", ";
        } else {
          gMsg += __("message.new.facebook.wall.s", {
            num: wall.length
          }) + ", ";
        }
      }
      wallIdx = initIdF(wall.length);
    }
    if (useFacebookStream) {
      log("getStream");
      stream = social.facebook.getStream(social.facebook.getLastStream());
      if (stream.error_code) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.facebook"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
        return;
      }
      if (stream.length > 0) {
        if (stream.length > 1) {
          gMsg += __("message.new.facebook.stream.pl", {
            num: stream.length
          }) + ", ";
        } else {
          gMsg += __("message.new.facebook.stream.s", {
            num: stream.length
          }) + ", ";
        }
      }
      streamIdx = initIdF(stream.length);
    }
    log("thread " + JSON.stringify(dMsg));
    gMsg += __("message.clicktolisten");
    ttsCb = function() {};
    sum = dMsg.length + notif.length + wall.length + stream.length;
    if (sum === 0) {
      ttsCb = function() {
        led.readFacebook();
        return karotz.chain.tts(__("message.noNew.facebook"), mainLang).exec(function() {
          if (readFacebookFsm.current === "FacebookInit") {
            return readFacebookFsm.stop();
          }
        });
      };
    } else {
      ttsCb = function() {
        led.waitUser();
        return karotz.chain.play(__("audio.start")).tts(gMsg, mainLang).exec(function() {
          return setTimeout(10000, function() {
            if (readFacebookFsm.current === "FacebookInit") {
              return readFacebookFsm.stop();
            }
          });
        });
      };
    }
    if (sum === 0 && launchType.name === 'SCHEDULER') {
      return readFacebookFsm.stop();
    } else {
      if (isConnected === false) {
        data = {};
        return karotz.start2(ttsCb, data);
      } else {
        return ttsCb();
      }
    }
  };
  readFacebookFsm.onFacebookWall = function() {
    var lastReadWall;
    log("onFacebookWall: " + wallIdx);
    if (isLastIdF(wallIdx, wall.length)) {
      if (wall.length > 0) {
        karotz.chain.tts(__("wall.end"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
      } else {
        readFacebookFsm.stop();
      }
      return;
    }
    log("created_time: " + wall[wallIdx].created_time);
    lastReadWall = wall[wallIdx].created_time;
    social.facebook.saveLastWall(lastReadWall);
    if (!Math.floor(Math.random() * 3)) {
      karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    }
    if (wall[wallIdx].attachment && wall[wallIdx].attachment.caption) {
      if (wall[wallIdx].attachment.caption === "soundcloud.com") {
        readFacebookFsm.streamSound(wall[wallIdx]);
        return;
      } else if (wall[wallIdx].attachment.caption === "www.youtube.com" || wall[wallIdx].attachment.caption === "www.wat.tv" || wall[wallIdx].attachment.caption === "www.dailymotion.com") {
        readFacebookFsm.next();
        return;
      } else if (wall[wallIdx].attachment.media) {
        readFacebookFsm.streamMedia(wall[wallIdx]);
        return;
      }
    } else if (wall[wallIdx].message) {
      readFacebookFsm.streamText(wall[wallIdx], readFacebookFsm.current);
      return;
    }
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookWallStop = function() {
    log("onFacebookWallStop");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookWallSkip = function() {
    log("onFacebookWallSkip");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookWallNext = function() {
    log("onFacebookWallNext");
    wallIdx = setNextIdF(wallIdx);
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookStream = function() {
    var lastReadStream;
    log("onFacebookStream: " + streamIdx);
    if (isLastIdF(streamIdx, stream.length)) {
      if (stream.length > 0) {
        karotz.chain.tts(__("stream.end"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
      } else {
        readFacebookFsm.stop();
      }
      return;
    }
    log("idx: " + streamIdx);
    log("created_time: " + stream[streamIdx].created_time);
    lastReadStream = stream[streamIdx].created_time;
    social.facebook.saveLastStream(lastReadStream);
    if (!Math.floor(Math.random() * 3)) {
      karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    }
    if (stream[streamIdx].attachment && stream[streamIdx].attachment.caption) {
      if (stream[streamIdx].attachment.caption === "soundcloud.com") {
        readFacebookFsm.streamSound(stream[streamIdx]);
        return;
      } else if (stream[streamIdx].attachment.caption === "www.youtube.com" || stream[streamIdx].attachment.caption === "www.wat.tv" || stream[streamIdx].attachment.caption === "www.dailymotion.com") {
        readFacebookFsm.streamText(stream[streamIdx], readFacebookFsm.current);
        return;
      } else if (stream[streamIdx].attachment.media) {
        readFacebookFsm.streamMedia(stream[streamIdx]);
        return;
      }
    } else if (stream[streamIdx].message) {
      readFacebookFsm.streamText(stream[streamIdx]);
      return;
    }
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookStreamStop = function() {
    log("onFacebookStreamStop");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookStreamSkip = function() {
    log("onFacebookStreamSkip");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookStreamNext = function() {
    log("onFacebookStreamNext");
    streamIdx = setNextIdF(streamIdx);
    return readFacebookFsm.next();
  };
  readFacebookFsm.streamMedia = function(obj) {
    var from, msg, msgLang, voice;
    log("StreamMedia");
    from = getUserInfoCache(obj.actor_id);
    msg = obj.attachment.name;
    msgLang = getLang(msg);
    log("message lang: " + msgLang);
    voice = getUserVoice(from, msgLang);
    return karotz.chain.tts(__("message.from", {
      name: from.name
    }), mainLang).tts(msg, voice.name).exec(function() {
      return readFacebookFsm.next();
    });
  };
  readFacebookFsm.replaceLink = function(text, lang) {
    if (lang !== void 0) {
      text = text.replace(cleanToTts.httpLink, cleanToTts.httpLinkTxt[lang]);
    }
    return text;
  };
  readFacebookFsm.streamText = function(obj) {
    var from, msgLang, voice;
    log("StreamText");
    msgLang = getLang(obj.message);
    log("message lang: " + msgLang);
    from = getUserInfoCache(obj.actor_id);
    voice = getUserVoice(from, msgLang);
    obj.message = readFacebookFsm.replaceLink(obj.message, msgLang);
    obj.message = obj.message.replace(cleanToTts.emoticon1, "");
    obj.message = obj.message.replace(cleanToTts.emoticon2, "");
    obj.message = obj.message.replace(cleanToTts.emoticon3, "");
    obj.message = obj.message.replace(cleanToTts.emoticon4, "");
    if (parentalControl) {
      obj.message = assCleaner(obj.message);
    }
    return karotz.chain.tts(__("message.from", {
      name: from.name
    }), mainLang).tts(obj.message, voice.name).exec(function() {
      return readFacebookFsm.next();
    });
  };
  readFacebookFsm.streamSound = function(obj) {
    var audioUrl, from, m;
    log("StreamSound");
    from = getUserInfoCache(obj.actor_id);
    m = audioReg.exec(obj.attachment.href);
    audioUrl = m[1] + "/download";
    return karotz.chain.tts(__("message.audio", {
      name: from.name
    }), mainLang).play(audioUrl).exec(function() {
      return readFacebookFsm.next();
    });
  };
  readFacebookFsm.onFacebookDirect = function() {
    var msg;
    log("onFacebookMessage: " + dMsgIdx);
    led.readFacebook();
    if (isLastIdF(dMsgIdx, dMsg.length)) {
      if (dMsg.length > 0) {
        karotz.chain.tts(__("message.end"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
      } else {
        log("RETURN ");
        readFacebookFsm.stop();
      }
      return;
    }
    log("idx: " + dMsgIdx);
    social.facebook.saveLastMail(dMsg[dMsgIdx].messages[dThreadMsgIdx].created_time);
    if (!Math.floor(Math.random() * 3)) {
      karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    }
    msg = dMsg[dMsgIdx].messages[dThreadMsgIdx];
    msg.message = msg.body;
    msg.actor_id = msg.author_id;
    log("msg " + JSON.stringify(msg));
    if (msg.attachment && msg.attachment.caption) {
      if (msg.attachment.caption === "soundcloud.com") {
        readFacebookFsm.streamSound(msg);
        return;
      } else if (msg.attachment.caption === "www.youtube.com" || msg.attachment.caption === "www.wat.tv" || msg.attachment.caption === "www.dailymotion.com") {
        readFacebookFsm.next();
        return;
      } else if (msg.attachment.media) {
        readFacebookFsm.streamMedia(msg);
        return;
      }
    } else if (msg.message) {
      readFacebookFsm.streamText(msg, readFacebookFsm.current);
      return;
    }
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookDirectStop = function() {
    log("onFacebookDirectStop");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookDirectSkip = function() {
    log("onFacebookDirectSkip");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookDirectNext = function() {
    log("onFacebookDirectNext");
    dThreadMsgIdx++;
    if (dThreadMsgIdx >= dMsg[dMsgIdx].messages.length) {
      dThreadMsgIdx = 0;
      dMsgIdx = setNextIdF(dMsgIdx);
    }
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookMessageMedia = function() {
    var from, msg, msgLang, voice;
    from = getUserInfoCache(wall[wallIdx].actor_id);
    msg = wall[wallIdx].attachment.name;
    msgLang = getLang(msg);
    log("message lang: " + msgLang);
    if (parentalControl) {
      msg = assCleaner(msg);
    }
    voice = getUserVoice(from, msgLang);
    return karotz.chain.tts(__("message.from", {
      name: from.name
    }), mainLang).tts(msg, voice.name).exec(function() {
      return readFacebookFsm.next();
    });
  };
  readFacebookFsm.onFacebookMessageText = function() {
    var from, msgLang, voice;
    log("onFacebookMessageText");
    msgLang = getLang(wall[wallIdx].message);
    log("message lang: " + msgLang);
    from = getUserInfoCache(wall[wallIdx].actor_id);
    voice = getUserVoice(from, msgLang);
    if (parentalControl) {
      wall[wallIdx].message = assCleaner(wall[wallIdx].message);
    }
    return karotz.chain.tts(__("message.from", {
      name: from.name
    }), mainLang).tts(wall[wallIdx].message, voice.name).exec(function() {
      return readFacebookFsm.next();
    });
  };
  readFacebookFsm.onFacebookMessageSound = function() {
    var audioUrl, from, m;
    log("onFacebookMessageSound");
    from = getUserInfoCache(wall[wallIdx].actor_id);
    m = audioReg.exec(wall[wallIdx].attachment.href);
    audioUrl = m[1] + "/download";
    return karotz.chain.tts(__("message.audio", {
      name: from.name
    }), mainLang).play(audioUrl).exec(function() {
      return readFacebookFsm.next();
    });
  };
}).call(this);
