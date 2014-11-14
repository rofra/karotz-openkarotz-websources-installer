fsm.onFacebookRun = ->
    readFacebookFsm.run(->
        fsm.next()
        #karotz.chain
        #.play(__("audio.stop"))
        #.exec( () ->
        #    exit() )
    )
    
fsm.onFacebookNotificationRun = ->
    if(!useFacebook)
        readFacebookFsm.noConf(->
            fsm.next()
        )
    else
        readFacebookFsm.runNotification(->
            fsm.next()
        )

fsm.onFacebookRunAsr = ->
    if(!useFacebook)
        readFacebookFsm.noConf(->
            fsm.next()
        )
    else
        readFacebookFsm.run(->
            fsm.next()
        )


isAlreadyOnEnd = 0

fsm.onExit = ->
    if  isAlreadyOnEnd
        return
    isAlreadyOnEnd = 1

    karotz.multimedia.play(__("audio.stop") ,
    (event) ->
        if(event != "OK")
        
            exit();
    );

fsm.onFacebookRunScheduler = ->
    readFacebookFsm.run(->
        fsm.next()
    )


fsm.onTwitterRun = ->
    readTwitterFsm.run(->
        fsm.next()
        #karotz.chain
        #.play(__("audio.stop"))
        #.exec( () ->
        #    exit() )
    )

fsm.onTwitterRunAsr = ->
    if(!useTwitter)
        readTwitterFsm.noConf(->
            fsm.next()
        )
    else
        readTwitterFsm.run(->
            fsm.next()
        )

fsm.onTwitterRunScheduler = ->
    readTwitterFsm.run(->
        fsm.next()
        #karotz.chain
        #.play(__("audio.stop"))
        #.exec( () ->
        #    exit() )
    )

fsm.onPostPhoto = ->
    photoFsm.run(__("photo.label"), ->
        fsm.next()
    ) 
 
fsm.onPostSound = ->
    soundFsm.run(->
        fsm.next()
    )  

fsm.onRecordPostMessage = ->
    getMessageFsm.run((phraseGetMessage) ->
        postMessageFsm.run(phraseGetMessage, ->
            fsm.next()
        ) 
    ) 
    
fsm.onRecordPostMessagePhoto = ->
    getMessageFsm.run((phraseGetMessage) ->
        photoFsm.run(phraseGetMessage, ->
            fsm.next()
        )
    ) 
