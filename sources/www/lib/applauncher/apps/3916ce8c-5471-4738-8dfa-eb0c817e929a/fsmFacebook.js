(function() {
  var CheckLinkTxt, audioReg, cachedNames, dMsg, dMsgIdx, dThreadMsgIdx, friends, gMsg, getLang, getUserInfoCache, getUserVoice, initIdF, isLastIdF, lastReadMail, notif, notifIdx, setNextIdF, stream, streamIdx, wall, wallIdx;
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
  CheckLinkTxt = new Array();
  CheckLinkTxt["fr"] = __("message.checkLink.fr");
  CheckLinkTxt["en"] = __("message.checkLink.en");
  CheckLinkTxt["de"] = __("message.checkLink.de");
  CheckLinkTxt["es"] = __("message.checkLink.es");
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
  readFacebookFsm.onMarkAsRead = function() {
    log("onMarkAsRead : save last id");
    log("######### dMsg.length " + dMsg.length);
    log("######### notif.length " + notif.length);
    log("######### stream.length " + stream.length);
    if (dMsg.length > 0) {
      social.facebook.saveLastMail(dMsg[0].messages[0].created_time);
    }
    if (notif.length > 0) {
      social.facebook.saveLastNotification(notif[0].created_time);
    }
    if (stream.length > 0) {
      social.facebook.saveLastStream(stream[0].created_time);
    }
    return readFacebookFsm.next();
  };
  getUserVoice = function(from, lang) {
    var voice;
    return voice = karotz.tts.voices[lang];
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
    var current_created_time, msg;
    log("onFacebookNotification");
    log("onFacebookNotification notifIdx : " + notifIdx + ". notif.length : " + notif.length);
    if (isLastIdF(notifIdx, notif.length)) {
      log("## onFacebookNotification isLastIdF");
      if (notif.length > 0) {
        log("## onFacebookNotification notif.length > 0");
        karotz.chain.tts(__("notif.end"), mainLang).exec(function() {
          return readFacebookFsm.nexttype();
        });
      } else {
        log("## onFacebookNotification notif.length < 0");
        readFacebookFsm.nexttype();
      }
      return;
    }
    current_created_time = notif[notifIdx].created_time;
    log("created_time: " + current_created_time);
    if (readOrder === "chrono") {
      social.facebook.saveLastNotification(notif[notifIdx].created_time);
    } else {
      social.facebook.saveLastNotification(notif[0].created_time);
    }
    msg = "";
    if (notifIdx === initIdF(notif.length)) {
      if (notif.length > 1) {
        msg += __("notification.pl");
      } else {
        msg += __("notification.s");
      }
    }
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
      log("###### current  FacebookNotification post tts");
      if (readFacebookFsm.current === "FacebookNotification" && notifIdx >= 0 && !isLastIdF(notifIdx, notif.length) && current_created_time === notif[notifIdx].created_time) {
        log("current : FacebookNotification " + current_created_time + " :: " + notif[notifIdx].created_time);
        return readFacebookFsm.next();
      } else {
        return log("###### current  FacebookNotification post tts. not next");
      }
    });
  };
  readFacebookFsm.onFacebookNotificationStop = function() {
    log("onFacebookNotificationStop");
    karotz.tts.stop();
    karotz.multimedia.stop();
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookNotificationSkip = function() {
    log("onFacebookNotificationSkip");
    karotz.tts.stop();
    karotz.multimedia.stop();
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookNotificationNext = function() {
    log("onFacebookNotificationNext");
    notifIdx = setNextIdF(notifIdx);
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookInit = function() {
    var data, mess, message_count, sum, ttsCb, _i, _len;
    log("onFacebookInit");
    led.work();
    delete wall;
    delete notif;
    delete stream;
    delete friends;
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
    if (launchType.name === 'SCHEDULER') {
      gMsg = __("facebook") + " : " + __("message.youhave");
    } else {
      gMsg = __("message.youhave");
    }
    message_count = 0;
    if (useFacebookDMsg) {
      dMsg = social.facebook.getMail(social.facebook.getLastMail());
      if (dMsg.error_code) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.facebook"), mainLang).exec(function() {
          return readFacebookFsm.stop();
        });
        return;
      }
      if (dMsg.length > 0) {
        for (_i = 0, _len = dMsg.length; _i < _len; _i++) {
          mess = dMsg[_i];
          log("mess : " + mess.messages.length);
          message_count += mess.messages.length;
        }
        log("message_count : " + message_count);
        if (message_count > 1) {
          gMsg += __("message.new.facebook.dmsg.pl", {
            num: message_count
          }) + ", ";
        } else {
          gMsg += __("message.new.facebook.dmsg.s", {
            num: message_count
          }) + ",) ";
        }
        dMsgIdx = initIdF(dMsg.length);
        dThreadMsgIdx = dMsg[dMsgIdx].messages.length - 1;
      }
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
          gMsg += __("message.new.facebook.notif.s") + ", ";
        }
        notifIdx = initIdF(notif.length);
      }
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
        streamIdx = initIdF(stream.length);
      }
    }
    log("thread " + JSON.stringify(dMsg));
    sum = message_count + notif.length + stream.length;
    log("sum message: " + sum);
    if (sum === 1) {
      gMsg += __("message.clicktolisten.s");
    } else if (sum > 1) {
      gMsg += __("message.clicktolisten.pl");
    }
    ttsCb = function() {};
    if (sum === 0) {
      ttsCb = function() {
        var isConnected;
        isConnected = true;
        led.readFacebook();
        return karotz.chain.tts(__("message.noNew.facebook"), mainLang).exec(function() {
          if (readFacebookFsm.current === "FacebookInit") {
            return readFacebookFsm.stop();
          }
        });
      };
    } else {
      ttsCb = function() {
        var isConnected;
        isConnected = true;
        led.waitUser();
        if (launchType.name === 'SCHEDULER') {
          log("onTwitterMessageInit SCHEDULER");
          return karotz.chain.play(__("audio.start")).tts(gMsg, mainLang).exec(function() {
            return setTimeout(10000, function() {
              if (readFacebookFsm.current === "FacebookInit") {
                return readFacebookFsm.stop();
              }
            });
          });
        } else {
          log("onTwitterMessageInit not SCHEDULER");
          return karotz.chain.tts(gMsg, mainLang).exec(function() {
            return setTimeout(10000, function() {
              if (readFacebookFsm.current === "FacebookInit") {
                return readFacebookFsm.stop();
              }
            });
          });
        }
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
          return readFacebookFsm.nexttype();
        });
      } else {
        readFacebookFsm.nexttype();
      }
      return;
    }
    log("created_time: " + wall[wallIdx].created_time);
    lastReadWall = wall[wallIdx].created_time;
    social.facebook.saveLastWall(lastReadWall);
    if (!Math.floor(Math.random() * 3)) {
      karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    }
    if (wall[wallIdx].attachment && wall[wallIdx].attachment.href && wall[wallIdx].attribution) {
      if (wall[wallIdx].attribution === "SoundCloud") {
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
          return readFacebookFsm.nexttype();
        });
      } else {
        readFacebookFsm.nexttype();
      }
      return;
    }
    log("idx: " + streamIdx);
    log("created_time: " + stream[streamIdx].created_time);
    lastReadStream = stream[streamIdx].created_time;
    if (readOrder === "chrono") {
      social.facebook.saveLastStream(lastReadStream);
    } else {
      social.facebook.saveLastStream(stream[0].created_time);
    }
    if (!Math.floor(Math.random() * 3)) {
      karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    }
    if (stream[streamIdx].attachment && stream[streamIdx].attribution) {
      log("########### attribution : " + stream[streamIdx].attribution);
      log("########### href : " + stream[streamIdx].attachment.href);
    }
    if (stream[streamIdx].attachment && stream[streamIdx].attachment.href) {
      if (stream[streamIdx].attribution && stream[streamIdx].attribution === "SoundCloud") {
        readFacebookFsm.streamSound(stream[streamIdx]);
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
  readFacebookFsm.onFacebookStreamSkip2 = function() {
    log("onFacebookStreamSkip2");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookStreamNext = function() {
    log("onFacebookStreamNext");
    streamIdx = setNextIdF(streamIdx);
    return readFacebookFsm.next();
  };
  readFacebookFsm.streamMedia = function(obj) {
    var from, msg, msgLang, txt_from;
    log("StreamMedia");
    from = getUserInfoCache(obj.actor_id);
    msg = obj.message + ". ";
    log("message txxt: " + msg);
    msg = readFacebookFsm.replaceLink(msg, msgLang);
    msg = msg.replace(cleanToTts.emoticon1, "");
    msg = msg.replace(cleanToTts.emoticon2, "");
    msg = msg.replace(cleanToTts.emoticon3, "");
    msg = msg.replace(cleanToTts.emoticon4, "");
    if (parentalControl) {
      msg = assCleaner(msg);
    }
    log("message txxt: " + msg);
    msgLang = getLang(msg);
    log("message lang: " + msgLang);
    msg += CheckLinkTxt[msgLang];
    msg += "" + obj.attachment.name;
    txt_from = "";
    if (readFacebookFsm.current === "FacebookDirect") {
      txt_from = __("message.from", {
        name: from.name
      });
    } else if (readFacebookFsm.current === "FacebookStream") {
      txt_from = __("post.from", {
        name: from.name
      });
    }
    return karotz.chain.tts(txt_from, mainLang).tts(msg, msgLang).exec(function() {
      return readFacebookFsm.next();
    });
  };
  readFacebookFsm.replaceLink = function(text, lang) {
    if (lang !== void 0) {
      text = text.replace(cleanToTts.httpLink, cleanToTts.httpLinkTxt[lang]);
      text = text.replace(cleanToTts.httpsLink, cleanToTts.httpLinkTxt[lang]);
    }
    return text;
  };
  readFacebookFsm.streamText = function(obj) {
    var from, msgLang, txt_from;
    log("##### StreamText");
    msgLang = getLang(obj.message);
    log("message lang: " + msgLang);
    log("message obj.actor_id: " + obj.actor_id);
    from = getUserInfoCache(obj.actor_id);
    log("message from: " + from);
    log("message txxt: " + obj.message);
    obj.message = readFacebookFsm.replaceLink(obj.message, msgLang);
    obj.message = obj.message.replace(cleanToTts.emoticon1, "");
    obj.message = obj.message.replace(cleanToTts.emoticon2, "");
    obj.message = obj.message.replace(cleanToTts.emoticon3, "");
    obj.message = obj.message.replace(cleanToTts.emoticon4, "");
    log("message txxt: " + obj.message);
    if (parentalControl) {
      obj.message = assCleaner(obj.message);
    }
    log("message txxt: " + obj.message);
    log("message TTS");
    txt_from = "";
    if (readFacebookFsm.current === "FacebookDirect") {
      txt_from = __("message.from", {
        name: from.name
      });
    } else if (readFacebookFsm.current === "FacebookStream") {
      txt_from = __("post.from", {
        name: from.name
      });
    }
    return karotz.chain.tts(txt_from, mainLang).exec(function() {
      log("################# readFacebookFsm.current " + readFacebookFsm.current);
      if (readFacebookFsm.current === "MarkAsRead" || readFacebookFsm.current === "End" || readFacebookFsm.current === "WaitAction") {
        return log("################# TTS NOT START");
      } else {
        log("################# TTS START");
        return karotz.chain.tts(obj.message, msgLang).exec(function() {
          if (readFacebookFsm.current === "MarkAsRead" || readFacebookFsm.current === "End" || readFacebookFsm.current === "WaitAction") {
            return log("################# no next");
          } else {
            log("################# next");
            return readFacebookFsm.next();
          }
        });
      }
    });
  };
  readFacebookFsm.streamSound = function(obj) {
    var audioUrl, from, m;
    log("StreamSound");
    log("StreamSound href : " + obj.attachment.href);
    from = getUserInfoCache(obj.actor_id);
    m = audioReg.exec(obj.attachment.href);
    audioUrl = m[1] + "/download";
    log("StreamSound audioUrl : " + audioUrl);
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
    log("########### ");
    log("########### dMsgIdx " + dMsgIdx);
    log("########### dMsg.length " + dMsg.length);
    log("########### isLastIdF(dMsgIdx, dMsg.length) " + isLastIdF(dMsgIdx, dMsg.length));
    log("########### dThreadMsgIdx " + dThreadMsgIdx);
    if (isLastIdF(dMsgIdx, dMsg.length)) {
      log("########### isLastIdF");
      if (dMsg.length > 0) {
        log("########### dMsg.length > 0");
        karotz.chain.tts(__("message.end"), mainLang).exec(function() {
          return readFacebookFsm.nexttype();
        });
      } else {
        log("## RETURN ");
        readFacebookFsm.nexttype();
      }
      return;
    }
    log("idx: " + dMsgIdx);
    if (readOrder === "chrono") {
      social.facebook.saveLastMail(dMsg[dMsgIdx].messages[dThreadMsgIdx].created_time);
    } else {
      social.facebook.saveLastMail(dMsg[0].messages[0].created_time);
    }
    if (!Math.floor(Math.random() * 3)) {
      karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    }
    msg = dMsg[dMsgIdx].messages[dThreadMsgIdx];
    msg.message = msg.body;
    msg.actor_id = msg.author_id;
    log("msg " + JSON.stringify(msg));
    if (msg.attachment && msg.attachment.href && msg.attribution) {
      if (msg.attribution === "SoundCloud") {
        log("###### facebook has Soundcloud");
        readFacebookFsm.streamSound(msg);
        return;
      } else if (msg.attachment.media) {
        readFacebookFsm.streamMedia(msg);
        return;
      }
    } else if (msg.message) {
      readFacebookFsm.streamText(msg);
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
  readFacebookFsm.onFacebookDirectSkip2 = function() {
    log("onFacebookDirectSkip2");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readFacebookFsm.onFacebookDirectNext = function() {
    log("onFacebookDirectNext");
    dThreadMsgIdx--;
    if (dThreadMsgIdx < 0) {
      dThreadMsgIdx = 0;
      dMsgIdx = setNextIdF(dMsgIdx);
      if (!isLastIdF(dMsgIdx, dMsg.length)) {
        dThreadMsgIdx = dMsg[dMsgIdx].messages.length - 1;
      }
    }
    return readFacebookFsm.next();
  };
  readFacebookFsm.onFacebookMessageMedia = function() {
    var from, msg, msgLang;
    from = getUserInfoCache(wall[wallIdx].actor_id);
    msg = wall[wallIdx].attachment.name;
    msgLang = getLang(msg);
    log("message lang: " + msgLang);
    if (parentalControl) {
      msg = assCleaner(msg);
    }
    return karotz.chain.tts(__("message.from", {
      name: from.name
    }), mainLang).tts(msg, msgLang).exec(function() {
      return readFacebookFsm.next();
    });
  };
  readFacebookFsm.onFacebookMessageText = function() {
    var from, msgLang;
    log("onFacebookMessageText");
    msgLang = getLang(wall[wallIdx].message);
    log("message lang: " + msgLang);
    from = getUserInfoCache(wall[wallIdx].actor_id);
    if (parentalControl) {
      wall[wallIdx].message = assCleaner(wall[wallIdx].message);
    }
    return karotz.chain.tts(__("message.from", {
      name: from.name
    }), mainLang).tts(wall[wallIdx].message, msgLang).exec(function() {
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
