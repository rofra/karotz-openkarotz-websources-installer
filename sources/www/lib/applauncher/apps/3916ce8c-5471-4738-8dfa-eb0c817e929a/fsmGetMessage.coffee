sound = null
phraseGetMessage = null

getMessageFsm.run = (cb)->
    log("################# getMEssage");
    log("################# getMessageFsm.current : " + getMessageFsm.current);
    getMessageFsm.onAccept = () ->
        led.work();
        getMessageFsm.stop()
        cb(phraseGetMessage) if cb   
    getMessageFsm.onCancel = () ->
        getMessageFsm.stop()        
        cb(null) if cb
    led.waitUser()
    karotz.chain.tts(__("getMessage.record"), mainLang)
    .exec( ->
        if (getMessageFsm.can("getMessage"))
            getMessageFsm.getMessage()
    )

getMessageFsm.onRecordMessage = ->
    log("onRecordSound")
    sound = null

    karotz.multimedia.record((event)->
        log("record callback: " + JSON.stringify(event))
        return if event.type != "TERMINATED" && event.type != "CANCEL"
        sound = event.data
        karotz.chain.play(__("audio.ok"))
        .exec( ->
            getMessageFsm.next() )
    )        
    
getMessageFsm.onConvertMessage = ->
    log("googleAsr");
    led.work();
    phraseGetMessage = google.asr(sound, mainLang);
    log("googleASR recognize " + phraseGetMessage  )
    
    if phraseGetMessage == undefined || phraseGetMessage == null
        led.waitUser()
        karotz.chain.play(__("audio.error"))
        .tts(__("getMessage.errorReco"), mainLang)
        .exec( () ->
            getMessageFsm.retry()
        )
    else
        log("CHAIN")
        led.waitUser();
        if phraseGetMessage.length > 140
            phraseGetMessage = phraseGetMessage.substr(0, 139)
        karotz.chain.tts(__("getMessage.understand") + ": " + phraseGetMessage + ". " + __("getMessage.understandEnd") , mainLang )
        .exec( () ->
            log("CHAIN CB")
            setTimeout(10000, () -> 
                if getMessageFsm.current == "ConvertMessage"
                    getMessageFsm.stop()
            )
        )

getMessageFsm.onStopRecordMessage = ->
    log("onStopRecordMessage")
    karotz.multimedia.stop()

