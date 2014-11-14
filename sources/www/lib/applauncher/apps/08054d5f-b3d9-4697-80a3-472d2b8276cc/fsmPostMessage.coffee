postMessageFsm.run = (phrasePostMessage, cb)->
    postMessageFsm.onEnd = () ->
        cb() if cb
    postMessageFsm.postMessage(phrasePostMessage)

postMessageFsm.onPostMessage = (phrasePostMessage) ->
    log("onPostMessage")
    if phrasePostMessage == null || phrasePostMessage == undefined
        log("onPostMessage null message")
        postMessageFsm.stop()
        return
        
    led.work()
    retTwitter = {}
    retFb = {}
    if useFacebook
        log("SEND FB MSG")
        retFb = social.facebook.postMessage(phrasePostMessage);
    if useTwitter
        log("SEND TWITTER MSG")
        retTwitter = social.twitter.sendMsg(phrasePostMessage);
    log("retFb: " + JSON.stringify(retFb) )
    log("retTwitter: " + JSON.stringify(retTwitter) )
    
    if !retTwitter.error
        retTwitter.error = 0
    if !retFb.error
        retFb.error = 0
                    
    if retFb.error && retTwitter.error
        karotz.tts.voices[mainLang].say(__("postMessage.error"), (event)-> postMessageFsm.error() if event == "TERMINATED")
        karotz.chain.play(__("audio.error"))
        .tts( __("postMessage.error.twitter") , mainLang )
        .exec( ->
            postMessageFsm.error() )
    else if retFb.error
        karotz.tts.voices[mainLang].say(__("postMessage.error.facebook"), (event)-> postMessageFsm.error() if event == "TERMINATED")
        karotz.chain.play(__("audio.error"))
        .tts( __("postMessage.error.facebook") , mainLang )
        .exec( ->
            postMessageFsm.error() )
    else if retTwitter.error
        karotz.tts.voices[mainLang].say(__("postMessage.error.twitter"), (event)-> postMessageFsm.error() if event == "TERMINATED")
        karotz.chain.play(__("audio.error"))
        .tts( __("postMessage.error.twitter") , mainLang )
        .exec( ->
            postMessageFsm.error() )
    else
        msgSent = __("postMessage.messageSent")

        karotz.chain.play(__("audio.ok"))
        .tts( msgSent , mainLang )
        .exec( ->
            postMessageFsm.stop() )
