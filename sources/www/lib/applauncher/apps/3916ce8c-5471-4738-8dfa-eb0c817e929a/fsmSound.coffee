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
            
    social.soundcloud.shareForce(rtnSocialPost.id, useFacebook, false, msg, (rtn)->
        log("callback: rtn: "+rtn)
        if rtn < 0
            karotz.chain.tts(__("sound.error"), mainLang).exec(-> soundFsm.next())
        else
            msgSent = __("sound.done")

            karotz.chain.tts(msgSent, mainLang).exec(-> soundFsm.next())
    );
