sound = null

soundFsm.run = (cb)->
    soundFsm.onEnd = () ->
        cb() if cb
        
    if !social.soundcloud.post
        log("noSoundcloud post undefined -> notoken")
        soundFsm.noToken()
    else
        karotz.chain.tts(__("sound.record"), mainLang)
        .exec( ->
            if (soundFsm.can("sound"))
                soundFsm.sound()
        )
    
soundFsm.onNoToken = ->
    karotz.multimedia.stop()
    karotz.ears.reset()
    led.readTwitter()
    karotz.chain.play(__("audio.error"))
    .tts( __("message.error.soundcloud") , mainLang )
    .exec( () ->
        log("onNoToken")
        soundFsm.next()
    )
    
soundFsm.onRecordSound = ->
    log("onRecordSound")
    sound = null
    led.waitUser()
    karotz.multimedia.record((event)->
        log("record callback: " + JSON.stringify(event))
        return if event.type != "TERMINATED" && event.type != "CANCEL"
        sound = event.data
        soundFsm.next()
    )
    
soundFsm.onStopRecordSound = ->
    log("onStopRecordSound")
    karotz.multimedia.stop()
    
soundFsm.onPostSound = ->
    log("onPostSound")
    led.work()
    msg =  __("sound.title")
    log("msg "+msg)
    rtnSocialPost = social.soundcloud.postSound(sound, msg)
    
    if useTwitter
        log("SEND TWITTER MSG")
        phrasePostMessage = "";
        phrasePostMessage = __("sound.title") + rtnSocialPost.url
        
        retTwitter = social.twitter.sendMsg(phrasePostMessage)
        log("retTwitter: " + JSON.stringify(retTwitter) )
        
        if retTwitter.error
            log(" NOT OK");
            #karotz.chain.tts(__("sound.error"), mainLang).exec(-> soundFsm.next())
            karotz.chain.play(__("audio.error"))
            .tts( __("sound.error") , mainLang )
            .exec( ->
                soundFsm.next() )
        else
            log("OK");
            
            msgSent = __("sound.done")
            #msgSent += __("on") + __("twitter")
            #karotz.chain.tts(msgSent, mainLang).exec(-> soundFsm.next())
            karotz.chain.play(__("audio.ok"))
            .tts( msgSent , mainLang )
            .exec( ->
                soundFsm.next() )

