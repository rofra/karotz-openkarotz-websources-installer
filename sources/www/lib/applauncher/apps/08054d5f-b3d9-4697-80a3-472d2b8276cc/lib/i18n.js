(function() {
  var exports;
  exports = this;
  exports.__ = function(keyword, params) {
    var formatted, key, value, _ref;
    formatted = (_ref = i18n[keyword]) != null ? _ref : keyword;
    for (key in params) {
      value = params[key];
      formatted = formatted.replace("{" + key + "}", value);
    }
    return formatted;
  };
}).call(this);
