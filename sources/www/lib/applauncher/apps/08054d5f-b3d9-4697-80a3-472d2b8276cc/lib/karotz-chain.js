(function() {
  var availableLang, queue;
  queue = [];
  availableLang = {};
  availableLang["fr"] = true;
  availableLang["en"] = true;
  availableLang["de"] = true;
  availableLang["es"] = true;
  karotz.chain = {};
  karotz.chain.tts = function(text, lang) {
    queue.push(function() {
      return karotz.tts.start("<prosody rate='0.90'>" + text + "</prosody>", lang, function(event) {
        if (event === "TERMINATED" || event === "CANCEL" || event === "ERROR") {
          return queue.shift()();
        }
      });
    });
    return karotz.chain;
  };
  karotz.chain.play = function(url) {
    queue.push(function() {
      return karotz.multimedia.play(url, function(event) {
        if (event === "TERMINATED" || event === "CANCEL" || event === "ERROR") {
          return queue.shift()();
        }
      });
    });
    return karotz.chain;
  };
  karotz.chain.wait = function(time) {
    queue.push(function() {
      return setTimeout(time, function() {
        queue.shift()();
        return false;
      });
    });
    return karotz.chain;
  };
  karotz.chain.chain = function(func, params) {
    queue.push(function() {
      return func(params, queue.shift());
    });
    return karotz.chain;
  };
  karotz.chain.direct = function(func) {
    queue.push(function() {
      func();
      return queue.shift()();
    });
    return karotz.chain;
  };
  karotz.chain.exec = function(last) {
    if (last) {
      queue.push(last);
    } else {
      queue.push(function() {
        return log("END");
      });
    }
    queue.shift()();
    return karotz.chain;
  };
}).call(this);
