phrasePostPhoto = null
photoRunning = true

photoFsm.run = (phrasePostMessage, cb)->
    photoFsm.onEnd = () ->
        photoRunning = false
        photoFsm.next()
        cb() if cb
        
    if phrasePostMessage == null || phrasePostMessage == undefined
        log("photoFsm.run phrasePostMessage error")
        karotz.chain.play(__("audio.error"))
        .exec( ->
            photoRunning = false
            photoFsm.error() )
        return
        
    karotz.chain.tts(__("photo.begin"), mainLang)
    .exec( ->
        photoRunning = true
        if (photoFsm.can("photo"))
            photoFsm.photo(phrasePostMessage)
        else
            log("######## can NOT PHOTO");
    )
    
photoFsm.onPhoto = (phrasePostPhoto) ->
    log("onPhoto")
    log("onPhoto : " + phrasePostPhoto)
        
    led.waitUser()

    karotz.webcam.photo("file",
        (event) ->
            log("PHOTO CB: " + event.type);
            led.work()
            return if event.type != 'TERMINATED'

            if photoRunning == false
                photoFsm.stop()
                return
            
            #retTwitter = {}
            retFb = {}
            if useFacebook 
                log("SEND FB PHOTO")
                retFb = social.facebook.postPhoto(event.data, phrasePostPhoto)
            #if useTwitter
            #    log("SEND TWITTER PHOTO")
            #    retTwitter = social.twitter.sendMediaMsg(phrasePostPhoto, event.data)
            log("retFb: " + JSON.stringify(retFb) )
            #log("retTwitter: " + JSON.stringify(retTwitter) )
            #if !retTwitter.error
            #    retTwitter.error = 0
            if !retFb.error
                retFb.error = 0
            #if retFb.error && retTwitter.error
            #    karotz.tts.voices[mainLang].say(__("photo.error"), (event)-> photoFsm.error() if event == "TERMINATED")
            #else if retFb.error
            if retFb.error
                karotz.tts.voices[mainLang].say(__("photo.error"), (event)-> photoFsm.error() if event == "TERMINATED")
                karotz.chain.play(__("audio.error"))
                .tts( __("photo.error") , mainLang )
                .exec( ->
                    photoFsm.error() )
            #else if retTwitter.error
            #    karotz.tts.voices[mainLang].say(__("photo.error.twitter"), (event)-> photoFsm.error() if event == "TERMINATED")
            else
                if __("photo.label") == phrasePostPhoto
                    if useFacebook
                        msgSent = __("photoF.done")
                    else if useTwitter
                        msgSent = __("photoT.done")
                else
                    if useFacebook
                        msgSent = __("photomessageF.done")
                    else if useTwitter
                        msgSent = __("photomessageT.done")
                #if useFacebook
                #    msgSent += __(" sur facebook")
                #if useFacebook && useTwitter
                #    msgSent += __(" et twitter")
                #else if useTwitter
                #    msgSent += __(" sur twitter")
                #karotz.tts.voices[mainLang].say(msgSent, (event)->  if event == "TERMINATED")
                karotz.chain.play(__("audio.ok"))
                .tts( msgSent , mainLang )
                .exec( ->
                    photoFsm.stop() )
    )
