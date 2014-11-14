(function() {
  var dMsg, dMsgIdx, gMsg, getLang, getUserVoice, initId, isLastId, mention, mentionIdx, parentGlobalFsm, saveLast, setNextId, timeline, timelineIdx;
  timeline = [];
  timelineIdx = -1;
  dMsg = [];
  dMsgIdx = -1;
  mention = [];
  mentionIdx = -1;
  parentGlobalFsm = [];
  gMsg = "";
  readTwitterFsm.run = function(cb) {
    readTwitterFsm.onEnd = cb;
    return readTwitterFsm.readTwitter();
  };
  readTwitterFsm.onTwitterNoConfError = function(cb) {
    log("onTwitterNoConfError");
    led.readTwitter();
    readTwitterFsm.onEnd = cb;
    gMsg = __("message.error.noConf", {
      name: __("twitter")
    });
    return karotz.chain.play(__("audio.error")).tts(gMsg, mainLang).exec(function() {
      return readTwitterFsm.stop();
    });
  };
  readTwitterFsm.onMarkAsRead = function() {
    log("onMarkAsRead : save last id");
    if (dMsg.length > 0) {
      social.twitter.saveLastMessage(dMsg[0].id_str);
    }
    if (mention.length > 0) {
      social.twitter.saveLastMention(mention[0].id_str);
    }
    if (timeline.length > 0) {
      social.twitter.saveLastTimeline(timeline[0].id_str);
    }
    return readTwitterFsm.next();
  };
  getUserVoice = function(from, lang) {
    var gender, tmpId, voice, voices;
    try {
      gender = "M";
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
  initId = function(len) {
    if (readOrder === "chrono") {
      return len - 1;
    } else {
      return 0;
    }
  };
  setNextId = function(id) {
    if (readOrder === "chrono") {
      return id - 1;
    } else {
      return id + 1;
    }
  };
  saveLast = function(func, tab, id) {
    if (readOrder === "chrono") {
      return func(id);
    } else {
      return func(tab[0].id_str);
    }
  };
  isLastId = function(id, len) {
    if (readOrder === "chrono" && id < 0) {
      return 1;
    } else if (readOrder === "antechrono" && (id > len - 1 || id < 0)) {
      return 1;
    } else {
      return 0;
    }
  };
  readTwitterFsm.onTwitterMessageInit = function(parentFsm) {
    var data, sum, ttsCb;
    log("onTwitterMessageInit");
    if (launchType.name !== 'SCHEDULER') {
      led.work();
    }
    parentGlobalFsm = parentFsm;
    delete timeline;
    delete dMsg;
    delete mention;
    timeline = [];
    timelineIdx = -1;
    dMsg = [];
    dMsgIdx = -1;
    mention = [];
    mentionIdx = -1;
    if (launchType.name === 'SCHEDULER') {
      gMsg = __("twitter") + " : " + __("message.youhave");
    } else {
      gMsg = __("message.youhave");
    }
    if (useTwitterDMsg) {
      dMsg = social.twitter.getDirectMessages(20, social.twitter.getLastMessage());
      if (dMsg.error) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.twitter"), mainLang).exec(function() {
          return readTwitterFsm.stop();
        });
        return;
      }
      if (dMsg.length > 0) {
        if (dMsg.length > 1) {
          gMsg += __("message.new.twitter.dmsg.pl", {
            num: dMsg.length
          }) + ", ";
        } else {
          gMsg += __("message.new.twitter.dmsg.s", {
            num: dMsg.length
          }) + ", ";
        }
      }
      dMsgIdx = initId(dMsg.length);
    }
    if (useTwitterMention) {
      mention = social.twitter.getMentions(20, social.twitter.getLastMention());
      if (mention.error) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.twitter"), mainLang).exec(function() {
          return readTwitterFsm.stop();
        });
        return;
      }
      if (mention.length > 0) {
        if (mention.length > 1) {
          gMsg += __("message.new.twitter.mention.pl", {
            num: mention.length
          }) + ", ";
        } else {
          gMsg += __("message.new.twitter.mention.s") + ", ";
        }
      }
      mentionIdx = initId(mention.length);
    }
    if (useTwitterTimeLine) {
      timeline = social.twitter.getHomeTimeline(20, social.twitter.getLastTimeline());
      if (timeline.error) {
        karotz.chain.play(__("audio.error")).tts(__("message.error.twitter"), mainLang).exec(function() {
          return readTwitterFsm.stop();
        });
        return;
      }
      if (timeline.length > 0) {
        if (timeline.length > 1) {
          gMsg += __("message.new.twitter.timeline.pl", {
            num: timeline.length
          }) + ", ";
        } else {
          gMsg += __("message.new.twitter.timeline.s", {
            num: timeline.length
          }) + ", ";
        }
      }
      timelineIdx = initId(timeline.length);
    }
    sum = dMsg.length + mention.length + timeline.length;
    if (sum === 1) {
      gMsg += __("message.clicktolisten.s");
    } else if (sum > 1) {
      gMsg += __("message.clicktolisten.pl");
    }
    log("gMsg " + gMsg);
    ttsCb = function() {};
    if (sum === 0) {
      ttsCb = function() {
        var isConnected;
        isConnected = true;
        led.readTwitter();
        return karotz.chain.tts(__("message.noNew.twitter"), mainLang).exec(function() {
          if (readTwitterFsm.current === "TwitterMessageInit") {
            return readTwitterFsm.stop();
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
              if (readTwitterFsm.current === "TwitterMessageInit") {
                return readTwitterFsm.stop();
              }
            });
          });
        } else {
          log("onTwitterMessageInit not SCHEDULER");
          return karotz.chain.tts(gMsg, mainLang).exec(function() {
            return setTimeout(10000, function() {
              if (readTwitterFsm.current === "TwitterMessageInit") {
                return readTwitterFsm.stop();
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
        log("isConnected == false -> connecting");
        data = {};
        return karotz.start2(ttsCb, data);
      } else {
        log("isConnected == true -> go");
        return ttsCb();
      }
    }
  };
  readTwitterFsm.onTwitterDirect = function() {
    var message, msgLang, text, voice;
    log("onTwitterDirect: " + dMsgIdx);
    led.readTwitter();
    karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    if (isLastId(dMsgIdx, dMsg.length)) {
      readTwitterFsm.nexttype();
      return;
    }
    message = dMsg[dMsgIdx];
    log("message: " + JSON.stringify(message));
    msgLang = getLang(message.text);
    voice = getUserVoice(message.sender, msgLang);
    if (message.text) {
      text = social.twitter.replaceLink(message.text, msgLang);
      text = social.twitter.replaceMentionName(message, text);
      text = social.twitter.cleanText(text, msgLang);
      if (parentalControl) {
        text = assCleaner(text);
      }
      return karotz.chain.tts(__("message.from", {
        name: message.sender.name
      }), mainLang).tts(text, msgLang).exec(function() {
        if (readTwitterFsm.current === "TwitterDirect" && message.id_str === dMsg[dMsgIdx].id_str) {
          saveLast(social.twitter.saveLastMessage, dMsg, message.id_str);
          return readTwitterFsm.next();
        }
      });
    }
  };
  readTwitterFsm.onTwitterDirectNext = function() {
    log("onTwitterDirectNext");
    dMsgIdx = setNextId(dMsgIdx);
    if (isLastId(dMsgIdx, dMsg.length)) {
      return karotz.chain.tts(__("message.end"), mainLang).exec(function() {
        return readTwitterFsm.nexttype();
      });
    } else {
      return readTwitterFsm.next();
    }
  };
  readTwitterFsm.onTwitterMention = function() {
    var message, msgLang, text, voice;
    log("onTwitterMention");
    karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    if (isLastId(mentionIdx, mention.length)) {
      readTwitterFsm.nexttype();
      return;
    }
    message = mention[mentionIdx];
    log("message: " + JSON.stringify(message));
    msgLang = getLang(message.text);
    voice = getUserVoice(message.user, msgLang);
    if (message.text) {
      text = social.twitter.replaceLink(message.text, msgLang);
      text = social.twitter.replaceMentionName(message, text);
      text = social.twitter.cleanText(text, msgLang);
      if (parentalControl) {
        text = assCleaner(text);
      }
      return karotz.chain.tts(__("mention.from", {
        name: message.user.name
      }), mainLang).tts(text, msgLang).exec(function() {
        if (readTwitterFsm.current === "TwitterMention" && message.id_str === mention[mentionIdx].id_str) {
          saveLast(social.twitter.saveLastMention, mention, message.id_str);
          return readTwitterFsm.next();
        }
      });
    }
  };
  readTwitterFsm.onTwitterMentionNext = function() {
    log("onTwitterMentionNext");
    mentionIdx = setNextId(mentionIdx);
    if (isLastId(mentionIdx, mention.length)) {
      return karotz.chain.tts(__("mention.end"), mainLang).exec(function() {
        return readTwitterFsm.nexttype();
      });
    } else {
      return readTwitterFsm.next();
    }
  };
  readTwitterFsm.onTwitterMessage = function() {
    var message, msgLang, text, voice;
    log("onTwitterMessage: " + timelineIdx);
    karotz.ears.moveRelative(Math.floor(Math.random() * 17), Math.floor(Math.random() * 17));
    if (isLastId(timelineIdx, timeline.length)) {
      readTwitterFsm.nexttype();
      return;
    }
    message = timeline[timelineIdx];
    log("message: " + JSON.stringify(message));
    msgLang = getLang(message.text);
    voice = getUserVoice(message.user, msgLang);
    if (message.text) {
      text = social.twitter.replaceLink(message.text, msgLang);
      text = social.twitter.replaceMentionName(message, text);
      text = social.twitter.cleanText(text, msgLang);
      if (parentalControl) {
        text = assCleaner(text);
      }
      return karotz.chain.tts(__("timeline.from", {
        name: message.user.name
      }), mainLang).tts(text, msgLang).exec(function() {
        if (readTwitterFsm.current === "TwitterMessage" && message.id_str === timeline[timelineIdx].id_str) {
          saveLast(social.twitter.saveLastTimeline, timeline, message.id_str);
          return readTwitterFsm.next();
        }
      });
    }
  };
  readTwitterFsm.onTwitterDirectStop = function() {
    log("onTwitterDirectStop");
    karotz.tts.stop();
    karotz.multimedia.stop();
    return readTwitterFsm.next();
  };
  readTwitterFsm.onTwitterMentionStop = function() {
    log("onTwitterMentionStop");
    karotz.tts.stop();
    karotz.multimedia.stop();
    return readTwitterFsm.next();
  };
  readTwitterFsm.onTwitterMessageStop = function() {
    log("TwitterMessageStop");
    karotz.tts.stop();
    karotz.multimedia.stop();
    return readTwitterFsm.next();
  };
  readTwitterFsm.onTwitterMessageNext = function() {
    log("onTwitterMessageNext");
    timelineIdx = setNextId(timelineIdx);
    if (isLastId(timelineIdx, timeline.length)) {
      return karotz.chain.tts(__("timeline.end"), mainLang).exec(function() {
        return readTwitterFsm.nexttype();
      });
    } else {
      return readTwitterFsm.next();
    }
  };
}).call(this);
