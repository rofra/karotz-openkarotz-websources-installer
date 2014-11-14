exports = this

exports.__ = (keyword, params) ->
    formatted = i18n[keyword] ? keyword
    for key,value of params
        formatted = formatted.replace("{" + key + "}", value);
    formatted

