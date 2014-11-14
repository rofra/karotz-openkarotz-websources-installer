wallIdx=-1
wall=[]
notif=[]
notifIdx=-1
dMsg = []
dMsgIdx = -1
dThreadMsgIdx = 0
stream = []
streamIdx = -1
friends=[]
lastReadMail = ""
gMsg =""
audioReg = new RegExp('([^#]+)')


cachedNames = {}
getUserInfoCache = (userId) ->
    if !cachedNames[userId]
        cachedNames[userId] = social.facebook.getUserInfo(userId)
    cachedNames[userId];
    
initIdF = (len) ->
    if(readOrder == "chrono")
        len - 1
    else
        0
        
setNextIdF = (id) ->
    if(readOrder == "chrono")
        id - 1
    else
        id + 1
        
isLastIdF = (id, len) ->
    if(readOrder == "chrono" && id < 0)
        1
    else if(readOrder == "antechrono" && (id > len - 1 || id < 0))
        1
    else
        0

getUserVoice = (from, lang) ->
    try
        log("from: "+ JSON.stringify(from))
        
        gender = if from.gender == "female" then "F" else "M"

        voices = karotz.tts.filter({"lang": lang, "sex": gender})
        tmpId = parseInt(from.id)
        log("tmpId: " + tmpId)
        log("voices length: " + voices.length)
        log("" + tmpId % voices.length)
        voice = voices[tmpId % voices.length]

    catch error
        log(error)
        voice = karotz.tts.voices[msgLang]
    
    voice ?= karotz.tts.voices["en"]
    
getLang = (txt) ->
    if(langType == "auto")
        tmpLang = google.getLang(txt)
        if(tmpLang == null)
            tmpLang = mainLang
    else
        tmpLang = langType
    tmpLang
    
readFacebookFsm.run = (cb)->
    readFacebookFsm.onEnd = cb    
    readFacebookFsm.readFacebook()
    
readFacebookFsm.runNotification = (cb)->
    readFacebookFsm.onEnd = cb
    readFacebookFsm.readNotification()
    
readFacebookFsm.onFacebookNoConfError = (cb) ->
    log("onFacebookNoConfError")
    led.readFacebook()
    readFacebookFsm.onEnd = cb    
    
    gMsg = __("message.error.noConf", {name: __("facebook") })
    
    karotz.chain
    .play(__("audio.error"))
    .tts(gMsg , mainLang )
    .exec( () ->
        readFacebookFsm.stop()
    )

readFacebookFsm.onFacebookNotification = ->
    log("onFacebookNotification")
    log("onFacebookNotification notif.length : " + notif.length)

    if isLastIdF(notifIdx, notif.length)
        if (notif.length > 0)
            karotz.chain.tts(__("notif.end") , mainLang ).exec( () -> readFacebookFsm.stop() )
        else 
            readFacebookFsm.stop()
        return
        

    log("idx: " + notifIdx)
    log("created_time: " + notif[notifIdx].created_time)
    social.facebook.saveLastNotification(notif[notifIdx].created_time)
    
    msg = ""
    
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon1, "");
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon2, "");
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon3, "");
    notif[notifIdx].title_text = notif[notifIdx].title_text.replace(cleanToTts.emoticon4, "");
    
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon1, "");
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon2, "");
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon3, "");
    notif[notifIdx].body_text = notif[notifIdx].body_text.replace(cleanToTts.emoticon4, "");
    
    if parentalControl
            notif[notifIdx].title_text = assCleaner(notif[notifIdx].title_text)
            notif[notifIdx].body_text = assCleaner(notif[notifIdx].body_text)
            
    msg += notif[notifIdx].title_text + " : " + notif[notifIdx].body_text + ". "
    log(msg)
    
    karotz.chain.tts( msg , mainLang )
    .exec( () -> 
        if (readFacebookFsm.current == "FacebookNotification") 
            readFacebookFsm.next()
    )
    
readFacebookFsm.onFacebookNotificationStop = ->
    log("onFacebookNotificationStop")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookNotificationSkip = ->
    log("onFacebookNotificationSkip")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookNotificationNext = ->
    log("onFacebookNotificationNext")
    notifIdx--
    readFacebookFsm.next()

readFacebookFsm.onFacebookInit = ->
    log("onFacebookInit")
    led.work()
    wallIdx=-1
    wall=[]
    notif=[]
    notifIdx=-1
    dMsg = []
    dMsgIdx = -1
    dThreadMsgIdx = 0
    stream = []
    streamIdx = -1
    friends=[]
    #karotz.ears.moveRelative(100, 100)

    gMsg =__("facebook") + " : " + __("message.youhave")
    if useFacebookDMsg 
        dMsg = social.facebook.getMail(social.facebook.getLastMail())
        if dMsg.error_code
            karotz.chain
            .play(__("audio.error"))
            .tts(__("message.error.facebook") , mainLang )
            .exec( () ->
                readFacebookFsm.stop()
            )
            return
        if dMsg.length > 0
            if dMsg.length > 1
                gMsg += __("message.new.facebook.dmsg.pl", {num: dMsg.length }) + ", "
            else
                gMsg += __("message.new.facebook.dmsg.s", {num: dMsg.length }) + ",) "
        dMsgIdx = initIdF(dMsg.length)
        
    #*************************
    if useFacebookNotification
        log("getuseFacebookNotification") 
        notif = social.facebook.getNotification(social.facebook.getLastNotification())
        if notif.error_code
            karotz.chain
            .play(__("audio.error"))
            .tts(__("message.error.facebook") , mainLang )
            .exec( () ->
                readFacebookFsm.stop()
            )
            return
        if notif.length > 0
            if notif.length > 1
                gMsg += __("message.new.facebook.notif.pl", {num: notif.length }) + ", "
            else
                gMsg += __("message.new.facebook.notif.s", {num: notif.length }) + ", "
        notifIdx = initIdF(notif.length)
    #*******************

    if useFacebookWall
        log("getWall") 
        wall = social.facebook.getWall(social.facebook.getLastWall())
        if wall.error_code
            karotz.chain
            .play(__("audio.error"))
            .tts(__("message.error.facebook") , mainLang )
            .exec( () ->
                readFacebookFsm.stop()
            )
            return
        if wall.length > 0
            if wall.length > 1
                gMsg += __("message.new.facebook.wall.pl", {num: wall.length }) + ", "
            else
                gMsg += __("message.new.facebook.wall.s", {num: wall.length }) + ", "
        wallIdx = initIdF(wall.length)

    if useFacebookStream
        log("getStream")
        stream = social.facebook.getStream(social.facebook.getLastStream())
        if stream.error_code
            karotz.chain
            .play(__("audio.error"))
            .tts(__("message.error.facebook") , mainLang )
            .exec( () ->
                readFacebookFsm.stop()
            )
            return
        if stream.length > 0    
            if stream.length > 1
                gMsg += __("message.new.facebook.stream.pl", {num: stream.length }) + ", "
            else
                gMsg += __("message.new.facebook.stream.s", {num: stream.length }) + ", "
        streamIdx = initIdF(stream.length)

    log("thread "+JSON.stringify(dMsg))

    gMsg += __("message.clicktolisten")
    ttsCb = ->
    sum = dMsg.length + notif.length + wall.length + stream.length 
    if sum == 0
        ttsCb =  ->
            led.readFacebook()
            karotz.chain
            .tts(__("message.noNew.facebook") , mainLang )
            .exec( () ->
                if readFacebookFsm.current == "FacebookInit"
                    readFacebookFsm.stop()
            )
            
    else
        ttsCb =  ->
            led.waitUser()
            karotz.chain
            .play(__("audio.start"))
            .tts(gMsg , mainLang )
            .exec( () ->
                setTimeout(10000, () -> 
                  if readFacebookFsm.current == "FacebookInit"
                   readFacebookFsm.stop()
                )
            )
            
    if sum == 0 && launchType.name == 'SCHEDULER'
        readFacebookFsm.stop()
    else
        
        if isConnected == false
            #isConnected = true
            data= {}
            karotz.start2(ttsCb, data);
        else
            ttsCb() 


#readFacebookFsm.onleaveFacebookInit = ->
#    log("onleaveFacebookInit")
#    karotz.ears.reset()
    

readFacebookFsm.onFacebookWall = ->
    log("onFacebookWall: " + wallIdx)
    if isLastIdF(wallIdx, wall.length)
        if (wall.length > 0) 
            karotz.chain.tts(__("wall.end") , mainLang ).exec( () -> readFacebookFsm.stop() )
        else 
            readFacebookFsm.stop()
        return
    
    #log("idx: " + wallIdx + ' ' +   log("stream "+JSON.stringify(wall[wallIdx])))
    log("created_time: " + wall[wallIdx].created_time)
    lastReadWall = wall[wallIdx].created_time;
    social.facebook.saveLastWall(lastReadWall);

    if !Math.floor(Math.random()*3)
        karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    
    #lastReadWall = wall[wallIdx].id
    if  wall[wallIdx].attachment && wall[wallIdx].attachment.caption        
        if wall[wallIdx].attachment.caption == "soundcloud.com"
            readFacebookFsm.streamSound(wall[wallIdx])
            return
        else if wall[wallIdx].attachment.caption == "www.youtube.com" || wall[wallIdx].attachment.caption == "www.wat.tv" || wall[wallIdx].attachment.caption == "www.dailymotion.com"
            readFacebookFsm.next() #readFacebookFsm.video()
            return
        else if wall[wallIdx].attachment.media
            readFacebookFsm.streamMedia(wall[wallIdx])
            return

    else if wall[wallIdx].message
        readFacebookFsm.streamText(wall[wallIdx], readFacebookFsm.current)
        return
    
    readFacebookFsm.next()

readFacebookFsm.onFacebookWallStop = ->
    log("onFacebookWallStop")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookWallSkip = ->
    log("onFacebookWallSkip")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookWallNext = ->
    log("onFacebookWallNext")
    wallIdx = setNextIdF(wallIdx)
    readFacebookFsm.next()


readFacebookFsm.onFacebookStream = ->
    log("onFacebookStream: " + streamIdx)
    if isLastIdF(streamIdx, stream.length)
        if (stream.length > 0)
            karotz.chain.tts(__("stream.end") , mainLang ).exec( () -> readFacebookFsm.stop() )
        else 
            readFacebookFsm.stop()
        return
    
    log("idx: " + streamIdx)
    log("created_time: " + stream[streamIdx].created_time)
    lastReadStream = stream[streamIdx].created_time;
    social.facebook.saveLastStream(lastReadStream);

    if !Math.floor(Math.random()*3)
        karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    
    if  stream[streamIdx].attachment && stream[streamIdx].attachment.caption        
        if stream[streamIdx].attachment.caption == "soundcloud.com"
            readFacebookFsm.streamSound(stream[streamIdx])
            return
        else if stream[streamIdx].attachment.caption == "www.youtube.com" || stream[streamIdx].attachment.caption == "www.wat.tv" || stream[streamIdx].attachment.caption == "www.dailymotion.com"
            #readFacebookFsm.next() #readFacebookFsm.video()
            readFacebookFsm.streamText(stream[streamIdx], readFacebookFsm.current)
            return
        else if stream[streamIdx].attachment.media
            readFacebookFsm.streamMedia(stream[streamIdx])
            return

    else if stream[streamIdx].message
        readFacebookFsm.streamText(stream[streamIdx])
        return
    
    readFacebookFsm.next()

readFacebookFsm.onFacebookStreamStop = ->
    log("onFacebookStreamStop")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookStreamSkip = ->
    log("onFacebookStreamSkip")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookStreamNext = ->
    log("onFacebookStreamNext")
    streamIdx = setNextIdF(streamIdx)
    readFacebookFsm.next()

readFacebookFsm.streamMedia = (obj) ->
    log("StreamMedia")
    from = getUserInfoCache(obj.actor_id)
    
    msg = obj.attachment.name
    
    msgLang = getLang(msg)
    log("message lang: " + msgLang)
    
    voice = getUserVoice(from, msgLang)
    karotz.chain.tts( __("message.from", {name: from.name}) , mainLang )
    .tts(msg, voice.name)
    .exec( () -> readFacebookFsm.next() )


readFacebookFsm.replaceLink =  (text, lang) ->
    if(lang != undefined)
        text = text.replace(cleanToTts.httpLink, cleanToTts.httpLinkTxt[lang]);

    return text;

readFacebookFsm.streamText = (obj) ->
    log("StreamText")
    msgLang = getLang(obj.message)
    log("message lang: " + msgLang)
    
    from = getUserInfoCache(obj.actor_id)
    voice = getUserVoice(from, msgLang)

    obj.message = readFacebookFsm.replaceLink(obj.message, msgLang);
    obj.message = obj.message.replace(cleanToTts.emoticon1, "");
    obj.message = obj.message.replace(cleanToTts.emoticon2, "");
    obj.message = obj.message.replace(cleanToTts.emoticon3, "");
    obj.message = obj.message.replace(cleanToTts.emoticon4, "");
    
    if parentalControl
            obj.message = assCleaner(obj.message)

    karotz.chain.tts( __("message.from", {name: from.name}) , mainLang )
    .tts(obj.message, voice.name)
    .exec( () ->  
        readFacebookFsm.next()
    )

readFacebookFsm.streamSound = (obj)->
    log("StreamSound")
    from = getUserInfoCache(obj.actor_id)
    
    m = audioReg.exec(obj.attachment.href);
    audioUrl = m[1]+"/download"
    karotz.chain.tts(__("message.audio", {name: from.name}) , mainLang )
    .play(audioUrl)
    .exec( () -> readFacebookFsm.next() )

readFacebookFsm.onFacebookDirect = ->
    log("onFacebookMessage: " + dMsgIdx)
    led.readFacebook()
    if isLastIdF(dMsgIdx, dMsg.length)
        if (dMsg.length > 0)
            karotz.chain.tts(__("message.end") , mainLang ).exec( () -> readFacebookFsm.stop() )
        else 
            log("RETURN ")
            readFacebookFsm.stop()
        return
    
    log("idx: " + dMsgIdx)
    #log("created_time: " + dMsg[dMsgIdx].created_time)
    #lastReadMail = dMsg[dMsgIdx].created_time;
    social.facebook.saveLastMail(dMsg[dMsgIdx].messages[dThreadMsgIdx].created_time);

    if !Math.floor(Math.random()*3)
        karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    msg = dMsg[dMsgIdx].messages[dThreadMsgIdx]
    msg.message = msg.body
    msg.actor_id = msg.author_id
    log("msg "+JSON.stringify(msg))
    if  msg.attachment && msg.attachment.caption        
        if msg.attachment.caption == "soundcloud.com"
            readFacebookFsm.streamSound(msg)
            return
        else if msg.attachment.caption == "www.youtube.com" || msg.attachment.caption == "www.wat.tv" || msg.attachment.caption == "www.dailymotion.com"
            readFacebookFsm.next() #readFacebookFsm.video()
            return
        else if msg.attachment.media
            readFacebookFsm.streamMedia(msg)
            return

    else if msg.message
        readFacebookFsm.streamText(msg, readFacebookFsm.current)
        return
    
    readFacebookFsm.next()
    
readFacebookFsm.onFacebookDirectStop = ->
    log("onFacebookDirectStop")
    karotz.tts.stop()
    karotz.multimedia.stop();

readFacebookFsm.onFacebookDirectSkip = ->
    log("onFacebookDirectSkip")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookDirectNext = ->
    log("onFacebookDirectNext")
    dThreadMsgIdx++
    if dThreadMsgIdx >= dMsg[dMsgIdx].messages.length 
        dThreadMsgIdx = 0;
        dMsgIdx = setNextIdF(dMsgIdx)
    
    readFacebookFsm.next()
    

readFacebookFsm.onFacebookMessageMedia = ->
    from = getUserInfoCache(wall[wallIdx].actor_id)
    
    msg = wall[wallIdx].attachment.name
    
    msgLang = getLang(msg)
    log("message lang: " + msgLang)
    
    if parentalControl
            msg = assCleaner(msg)
    
    voice = getUserVoice(from, msgLang)
    karotz.chain.tts( __("message.from", {name: from.name}) , mainLang )
    .tts(msg, voice.name)
    .exec( () -> readFacebookFsm.next() )

readFacebookFsm.onFacebookMessageText = ->
    log("onFacebookMessageText")
    msgLang = getLang(wall[wallIdx].message)
    log("message lang: " + msgLang)
    
    from = getUserInfoCache(wall[wallIdx].actor_id)
    voice = getUserVoice(from, msgLang)
    
    if parentalControl
            wall[wallIdx].message = assCleaner(wall[wallIdx].message)

    karotz.chain.tts( __("message.from", {name: from.name}) , mainLang )
    .tts(wall[wallIdx].message, voice.name)
    .exec( () -> readFacebookFsm.next() )

readFacebookFsm.onFacebookMessageSound = ->
    log("onFacebookMessageSound")
    from = getUserInfoCache(wall[wallIdx].actor_id)
    
    m = audioReg.exec(wall[wallIdx].attachment.href);
    audioUrl = m[1]+"/download"
    karotz.chain.tts(__("message.audio", {name: from.name}) , mainLang )
    .play(audioUrl)
    .exec( () -> readFacebookFsm.next() )
 
