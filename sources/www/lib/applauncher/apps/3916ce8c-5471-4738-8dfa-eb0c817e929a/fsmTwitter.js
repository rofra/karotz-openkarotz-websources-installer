(function() {
  var dMsg, dMsgIdx, gMsg, getLang, getUserVoice, initId, isLastId, mention, mentionIdx, parentGlobalFsm, setNextId, timeline, timelineIdx;
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
    timeline = [];
    timelineIdx = -1;
    dMsg = [];
    dMsgIdx = -1;
    mention = [];
    mentionIdx = -1;
    gMsg = __("twitter") + " : " + __("message.youhave");
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
          gMsg += __("message.new.twitter.mention.s", {
            num: mention.length
          }) + ", ";
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
    gMsg += __("message.clicktolisten");
    sum = dMsg.length + mention.length + timeline.length;
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
        return karotz.chain.play(__("audio.start")).tts(gMsg, mainLang).exec(function() {
          return setTimeout(10000, function() {
            if (readTwitterFsm.current === "TwitterMessageInit") {
              return readTwitterFsm.stop();
            }
          });
        });
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
      text = social.twitter.cleanText(text);
      if (parentalControl) {
        text = assCleaner(text);
      }
      return karotz.chain.tts(__("message.from", {
        name: message.sender.name
      }), mainLang).tts(text, voice.name).exec(function() {
        social.twitter.saveLastMessage(message.id_str);
        return readTwitterFsm.next();
      });
    }
  };
  readTwitterFsm.onTwitterDirectNext = function() {
    log("onTwitterDirectNext");
    karotz.tts.stop();
    karotz.multimedia.stop();
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
      text = social.twitter.cleanText(text);
      if (parentalControl) {
        text = assCleaner(text);
      }
      return karotz.chain.tts(__("mention.from", {
        name: message.user.name
      }), mainLang).tts(text, voice.name).exec(function() {
        social.twitter.saveLastMention(message.id_str);
        return readTwitterFsm.next();
      });
    }
  };
  readTwitterFsm.onTwitterMentionNext = function() {
    log("onTwitterMentionNext");
    karotz.tts.stop();
    karotz.multimedia.stop();
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
      text = social.twitter.cleanText(text);
      if (parentalControl) {
        text = assCleaner(text);
      }
      return karotz.chain.tts(__("timeline.from", {
        name: message.user.name
      }), mainLang).tts(text, voice.name).exec(function() {
        social.twitter.saveLastTimeline(message.id_str);
        return readTwitterFsm.next();
      });
    }
  };
  readTwitterFsm.onTwitterMessageStop = function() {
    log("TwitterMessageStop");
    karotz.tts.stop();
    return karotz.multimedia.stop();
  };
  readTwitterFsm.onTwitterMessageNext = function() {
    log("onTwitterMessageNext");
    karotz.tts.stop();
    karotz.multimedia.stop();
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
