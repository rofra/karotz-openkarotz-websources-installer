exports = this

google = {}

google.asr = (audio, lang)->
    paramToPost = {
        "file":audio,
    }

    header = {
        "Content-Type": "audio/x-flac; rate=16000"
    }

    result = http.post("http://www.google.com/speech-api/v1/recognize?lang=#{lang}-#{lang}&client=chromium", paramToPost, header, false);
    log("result : " + result)
    try
        result = JSON.parse(result)
    catch e
        log("error " + e)
        return null
    log("result : " + result.hypotheses[0].utterance)
    result.hypotheses[0].utterance

google.getLang = (txt) ->
    dataLangJson = {}
    encodedTxt = encodeURIComponent(txt)
    dataLang = http.get("http://ajax.googleapis.com/ajax/services/language/detect?v=1.0&q=#{encodedTxt}" );
    try
        dataLangJson = JSON.parse(dataLang)
    catch e
        log("error " + e)
        dataLangJson.responseData = null
    if dataLangJson.responseData == null
        log("error : " + dataLangJson.responseDetails);
        return null
    else
        log("currentTweet dataLangJson : " + dataLangJson.responseData.language)
        dataLangJson.responseData.language

exports.google = google
