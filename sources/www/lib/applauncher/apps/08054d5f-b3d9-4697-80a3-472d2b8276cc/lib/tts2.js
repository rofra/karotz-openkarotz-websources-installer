(function() {
  var Voice, acapela_regexp, acapela_tts, default_tts, kagedo_regexp, kagedo_tts, old_tts;
  var __hasProp = Object.prototype.hasOwnProperty;
  old_tts = karotz.tts.start;
  default_tts = function(text, lang, name, callback) {
    return old_tts(text, name, callback);
  };
  kagedo_regexp = new RegExp('url="(.*?)"');
  kagedo_tts = function(text, lang, name, callback) {
    var data, m, result, textCustom, tmpXml;
    textCustom = text + '. bla h';
    try {
      tmpXml = "<KagedoSynthesis><Identification><codeAuth>10O328e5934A7</codeAuth></Identification><Result><ResultCode/><ErrorDetail/></Result><MainData><DialogList><Dialog character=\"" + name + "\">" + textCustom + "</Dialog></DialogList></MainData></KagedoSynthesis>";
      log(tmpXml);
      data = {
        KagedoSynthesis: tmpXml
      };
      result = http.post("http://webservice.kagedo.fr/synthesis/ws/makesound", data);
      log("voice: " + name);
      log(result);
      m = kagedo_regexp.exec(result);
      return karotz.multimedia.play(m[1], callback);
    } catch (error) {
      log(error);
      return old_tts(text, lang, callback);
    }
  };
  acapela_regexp = new RegExp('retour_php=(.*?)\\&');
  acapela_tts = function(text, lang, name, callback) {
    var data, m, result, textCustom;
    textCustom = '. ' + text + '. .';
    try {
      data = {
        client_request_type: 'CREATE_REQUEST',
        client_voice: name,
        actionscript_version: '3',
        client_text: textCustom,
        client_version: "1-00",
        client_login: "asTTS",
        client_password: "demo_web"
      };
      log("acapela post");
      result = http.post("http://vaas.acapela-group.com/Services/DemoWeb/textToMP3.php", data);
      log("voice: " + name);
      log(result);
      m = acapela_regexp.exec(result);
      return karotz.multimedia.play(m[1], callback);
    } catch (error) {
      log(error);
      return old_tts(text, lang, callback);
    }
  };
  Voice = (function() {
    function Voice(lang, name, sex, func) {
      this.lang = lang;
      this.name = name;
      this.sex = sex;
      this.func = func;
    }
    Voice.prototype.say = function(text, callback) {
      log("txt Voice: " + this.name);
      log("txt : " + text);
      return this.func(text, this.lang, this.name, callback);
    };
    Voice.prototype.toString = function() {
      return this.name;
    };
    return Voice;
  })();
  karotz.tts.voices = {
    "fr": new Voice("fr", "fr", "F", default_tts),
    "fr": new Voice("fr", "fr", "M", default_tts),
    "en": new Voice("en", "en", "F", default_tts),
    "en": new Voice("en", "en", "M", default_tts),
    'es': new Voice("es", 'es', "F", default_tts),
    'es': new Voice("es", 'es', "M", default_tts),
    'de': new Voice("de", 'de', "F", default_tts),
    'de': new Voice("de", 'de', "M", default_tts)
  };
  karotz.tts.filterByLang = function(lang) {
    var name, voice, _ref, _results;
    _ref = karotz.tts.voices;
    _results = [];
    for (name in _ref) {
      if (!__hasProp.call(_ref, name)) continue;
      voice = _ref[name];
      if (voice.lang === lang) {
        _results.push(voice);
      }
    }
    return _results;
  };
  karotz.tts.filter = function(filter) {
    var filterFunction, name, voice, _ref, _results;
    filterFunction = function(filter, voice) {
      var key, value;
      for (key in filter) {
        if (!__hasProp.call(filter, key)) continue;
        value = filter[key];
        if (voice[key] !== value) {
          return false;
        }
      }
      return true;
    };
    _ref = karotz.tts.voices;
    _results = [];
    for (name in _ref) {
      if (!__hasProp.call(_ref, name)) continue;
      voice = _ref[name];
      if (filterFunction(filter, voice)) {
        _results.push(voice);
      }
    }
    return _results;
  };
  karotz.tts.start = function(text, name, callback) {
    var voice, _ref;
    voice = (_ref = karotz.tts.voices[name]) != null ? _ref : karotz.tts.voices["fr"];
    return voice.say(text, callback);
  };
}).call(this);
