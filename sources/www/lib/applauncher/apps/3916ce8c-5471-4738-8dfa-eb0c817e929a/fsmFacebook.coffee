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

CheckLinkTxt = new Array();
CheckLinkTxt["fr"] = __("message.checkLink.fr");
CheckLinkTxt["en"] = __("message.checkLink.en");
CheckLinkTxt["de"] = __("message.checkLink.de");
CheckLinkTxt["es"] = __("message.checkLink.es");


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

readFacebookFsm.onMarkAsRead = () ->
    log("onMarkAsRead : save last id")
    
    log("######### dMsg.length " + dMsg.length)
    log("######### notif.length " + notif.length)
    log("######### stream.length " + stream.length)
    #log("######### dMsg[0].messages.length " + dMsg[0].messages.length)
    #log("######### dMsg[0].messages[dMsg[0].messages.length - 1].created_time " + dMsg[0].messages[dMsg[0].messages.length - 1].created_time)
    if dMsg.length > 0
        social.facebook.saveLastMail(dMsg[0].messages[0].created_time);
    if notif.length > 0
        social.facebook.saveLastNotification(notif[0].created_time)
    if stream.length > 0
        social.facebook.saveLastStream(stream[0].created_time);
    
    readFacebookFsm.next()
    
getUserVoice = (from, lang) ->
    voice = karotz.tts.voices[lang]
    #try
    #    log("from: "+ JSON.stringify(from))
    #    
    #    gender = if from.gender == "female" then "F" else "M"
    #
    #    voices = karotz.tts.filter({"lang": lang, "sex": gender})
    #    tmpId = parseInt(from.id)
    #    log("tmpId: " + tmpId)
    #    log("voices length: " + voices.length)
    #    log("" + tmpId % voices.length)
    #    voice = voices[tmpId % voices.length]
    #
    #catch error
    #    log(error)
    #    voice = karotz.tts.voices[lang]
    #
    #voice ?= karotz.tts.voices["en"]
    
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
    log("onFacebookNotification notifIdx : " + notifIdx + ". notif.length : " + notif.length)

    if isLastIdF(notifIdx, notif.length)
        log("## onFacebookNotification isLastIdF");
        if (notif.length > 0)
            log("## onFacebookNotification notif.length > 0");
            karotz.chain.tts(__("notif.end") , mainLang ).exec( () -> readFacebookFsm.nexttype() )
        else 
            log("## onFacebookNotification notif.length < 0");
            readFacebookFsm.nexttype()
        return
        
    current_created_time = notif[notifIdx].created_time
    log("created_time: " + current_created_time)
    #social.facebook.saveLastNotification(notif[notifIdx].created_time)
    if(readOrder == "chrono")
        social.facebook.saveLastNotification(notif[notifIdx].created_time)
    else
        social.facebook.saveLastNotification(notif[0].created_time)
    
    msg = ""

    if notifIdx == initIdF(notif.length)
        if notif.length > 1
            msg += __("notification.pl")
        else
            msg += __("notification.s")
    
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
        log("###### current  FacebookNotification post tts")
        if (readFacebookFsm.current == "FacebookNotification" && notifIdx >= 0 && !isLastIdF(notifIdx, notif.length) && current_created_time == notif[notifIdx].created_time )
            log("current : FacebookNotification " + current_created_time + " :: " + notif[notifIdx].created_time)
            readFacebookFsm.next()
        else 
            log("###### current  FacebookNotification post tts. not next")
    )
    
readFacebookFsm.onFacebookNotificationStop = ->
    log("onFacebookNotificationStop")
    karotz.tts.stop()
    karotz.multimedia.stop();
    readFacebookFsm.next()
    
readFacebookFsm.onFacebookNotificationSkip = ->
    log("onFacebookNotificationSkip")
    karotz.tts.stop()
    karotz.multimedia.stop();
    readFacebookFsm.next()
    
readFacebookFsm.onFacebookNotificationNext = ->
    log("onFacebookNotificationNext")
    notifIdx = setNextIdF(notifIdx)
    readFacebookFsm.next()
    
    
    

readFacebookFsm.onFacebookInit = ->
    log("onFacebookInit")
    led.work()
    
    delete wall
    delete notif
    delete stream
    delete friends
    
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

    if launchType.name == 'SCHEDULER'
        gMsg = __("facebook") + " : " + __("message.youhave")
    else
        gMsg = __("message.youhave")
        
    message_count = 0
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
            
            for mess in dMsg
                log("mess : " + mess.messages.length)
                message_count += mess.messages.length
            log("message_count : " + message_count) 
                
            if message_count > 1
                gMsg += __("message.new.facebook.dmsg.pl", {num: message_count }) + ", "
            else
                gMsg += __("message.new.facebook.dmsg.s", {num: message_count }) + ",) "
            dMsgIdx = initIdF(dMsg.length)
            dThreadMsgIdx = dMsg[dMsgIdx].messages.length - 1
        
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
                gMsg += __("message.new.facebook.notif.s") + ", "
            notifIdx = initIdF(notif.length)
    #*******************

    #if useFacebookWall
    #    log("getWall") 
    #    wall = social.facebook.getWall(social.facebook.getLastWall())
    #    if wall.error_code
    #        karotz.chain
    #        .play(__("audio.error"))
    #        .tts(__("message.error.facebook") , mainLang )
    #        .exec( () ->
    #            readFacebookFsm.stop()
    #        )
    #        return
    #    if wall.length > 0
    #        if wall.length > 1
    #            gMsg += __("message.new.facebook.wall.pl", {num: wall.length }) + ", "
    #        else
    #            gMsg += __("message.new.facebook.wall.s", {num: wall.length }) + ", "
    #    wallIdx = initIdF(wall.length)

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

    sum = message_count + notif.length + stream.length 
    log("sum message: " + sum);
    
    if sum == 1
        gMsg += __("message.clicktolisten.s")
    else if sum > 1
        gMsg += __("message.clicktolisten.pl")
        
    ttsCb = ->
    
    if sum == 0
        ttsCb =  ->
            isConnected = true
            led.readFacebook()
            karotz.chain
            .tts(__("message.noNew.facebook") , mainLang )
            .exec( () ->
                if readFacebookFsm.current == "FacebookInit"
                    readFacebookFsm.stop()
            )
            
    else
        ttsCb =  ->
            isConnected = true
            led.waitUser()
            if launchType.name == 'SCHEDULER'
                log("onTwitterMessageInit SCHEDULER");
                karotz.chain.play(__("audio.start"))
                .tts(gMsg , mainLang )
                .exec( () ->
                   setTimeout(10000, () -> 
                    if readFacebookFsm.current == "FacebookInit"
                       readFacebookFsm.stop()
                   )
                )
            else
                log("onTwitterMessageInit not SCHEDULER");
                karotz.chain.tts(gMsg , mainLang )
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
            karotz.chain.tts(__("wall.end") , mainLang ).exec( () -> readFacebookFsm.nexttype() )
        else 
            readFacebookFsm.nexttype()
        return
    
    #log("idx: " + wallIdx + ' ' +   log("stream "+JSON.stringify(wall[wallIdx])))
    log("created_time: " + wall[wallIdx].created_time)
    lastReadWall = wall[wallIdx].created_time;
    social.facebook.saveLastWall(lastReadWall);

    if !Math.floor(Math.random()*3)
        karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    
    #lastReadWall = wall[wallIdx].id
    if  wall[wallIdx].attachment && wall[wallIdx].attachment.href && wall[wallIdx].attribution
        if wall[wallIdx].attribution == "SoundCloud"
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
            karotz.chain.tts(__("stream.end") , mainLang ).exec( () -> readFacebookFsm.nexttype() )
        else 
            readFacebookFsm.nexttype()
        return
    
    log("idx: " + streamIdx)
    log("created_time: " + stream[streamIdx].created_time)
    lastReadStream = stream[streamIdx].created_time;
    #social.facebook.saveLastStream(lastReadStream);
    if(readOrder == "chrono")
        social.facebook.saveLastStream(lastReadStream);
    else
        social.facebook.saveLastStream(stream[0].created_time);

    if !Math.floor(Math.random()*3)
        karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    
    if  stream[streamIdx].attachment && stream[streamIdx].attribution
        log("########### attribution : " + stream[streamIdx].attribution);
        log("########### href : " + stream[streamIdx].attachment.href);
    
    if  stream[streamIdx].attachment && stream[streamIdx].attachment.href      
        if stream[streamIdx].attribution && stream[streamIdx].attribution == "SoundCloud"
            readFacebookFsm.streamSound(stream[streamIdx])
            return
        #else if stream[streamIdx].attachment.caption == "www.youtube.com" || stream[streamIdx].attachment.caption == "www.wat.tv" || stream[streamIdx].attachment.caption == "www.dailymotion.com"
        #    #readFacebookFsm.next() #readFacebookFsm.video()
        #    readFacebookFsm.streamText(stream[streamIdx], readFacebookFsm.current)
        #    return
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
    
readFacebookFsm.onFacebookStreamSkip2 = ->
    log("onFacebookStreamSkip2")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookStreamNext = ->
    log("onFacebookStreamNext")
    streamIdx = setNextIdF(streamIdx)
    readFacebookFsm.next()

readFacebookFsm.streamMedia = (obj) ->
    log("StreamMedia")
    from = getUserInfoCache(obj.actor_id)
    
    
    msg = obj.message + ". "
    
    log("message txxt: " + msg)
    
    msg = readFacebookFsm.replaceLink(msg, msgLang);
    msg = msg.replace(cleanToTts.emoticon1, "");
    msg = msg.replace(cleanToTts.emoticon2, "");
    msg = msg.replace(cleanToTts.emoticon3, "");
    msg = msg.replace(cleanToTts.emoticon4, "");
    if parentalControl
            msg = assCleaner(msg)
    log("message txxt: " + msg)
    
    msgLang = getLang(msg)
    log("message lang: " + msgLang)
    
    msg += CheckLinkTxt[msgLang]
    msg += "" + obj.attachment.name
    
    # voice = getUserVoice(from, msgLang)
    txt_from = ""
    if readFacebookFsm.current == "FacebookDirect"
        txt_from = __("message.from", {name: from.name})
    else if readFacebookFsm.current == "FacebookStream"
        txt_from = __("post.from", {name: from.name})
        
    karotz.chain.tts( txt_from , mainLang )
    .tts(msg, msgLang)
    .exec( () -> readFacebookFsm.next() )


readFacebookFsm.replaceLink =  (text, lang) ->
    if(lang != undefined)
        text = text.replace(cleanToTts.httpLink, cleanToTts.httpLinkTxt[lang]);
        text = text.replace(cleanToTts.httpsLink, cleanToTts.httpLinkTxt[lang]);

    return text;

readFacebookFsm.streamText = (obj) ->
    log("##### StreamText")
    msgLang = getLang(obj.message)
    log("message lang: " + msgLang)
    log("message obj.actor_id: " + obj.actor_id)
    from = getUserInfoCache(obj.actor_id)
    log("message from: " + from)
    log("message txxt: " + obj.message)
    #voice = getUserVoice(from, msgLang)

    obj.message = readFacebookFsm.replaceLink(obj.message, msgLang);
    obj.message = obj.message.replace(cleanToTts.emoticon1, "");
    obj.message = obj.message.replace(cleanToTts.emoticon2, "");
    obj.message = obj.message.replace(cleanToTts.emoticon3, "");
    obj.message = obj.message.replace(cleanToTts.emoticon4, "");
    log("message txxt: " + obj.message)
    if parentalControl
            obj.message = assCleaner(obj.message)
    log("message txxt: " + obj.message)
    log("message TTS")
    txt_from = ""
    if readFacebookFsm.current == "FacebookDirect"
        txt_from = __("message.from", {name: from.name})
    else if readFacebookFsm.current == "FacebookStream"
        txt_from = __("post.from", {name: from.name})
    karotz.chain.tts( txt_from, mainLang )
    .exec( () ->  
        log("################# readFacebookFsm.current " + readFacebookFsm.current)
        if readFacebookFsm.current == "MarkAsRead" || readFacebookFsm.current == "End" || readFacebookFsm.current == "WaitAction"
            log("################# TTS NOT START")
        else
            log("################# TTS START")
            karotz.chain.tts(obj.message, msgLang)
            .exec( () ->  
                if readFacebookFsm.current == "MarkAsRead" || readFacebookFsm.current == "End" || readFacebookFsm.current == "WaitAction"
                    log("################# no next")
                else
                    log("################# next")
                    readFacebookFsm.next()
            )
    )

readFacebookFsm.streamSound = (obj)->
    log("StreamSound")
    log("StreamSound href : " + obj.attachment.href)
    from = getUserInfoCache(obj.actor_id)
    
    m = audioReg.exec(obj.attachment.href);
    audioUrl = m[1]+"/download"
    log("StreamSound audioUrl : " + audioUrl)
    karotz.chain.tts(__("message.audio", {name: from.name}) , mainLang )
    .play(audioUrl)
    .exec( () -> readFacebookFsm.next() )




readFacebookFsm.onFacebookDirect = ->
    log("onFacebookMessage: " + dMsgIdx)
    led.readFacebook()
    
    log("########### ")
    log("########### dMsgIdx " + dMsgIdx)
    log("########### dMsg.length " + dMsg.length)
    log("########### isLastIdF(dMsgIdx, dMsg.length) " + isLastIdF(dMsgIdx, dMsg.length))
    log("########### dThreadMsgIdx " + dThreadMsgIdx)
    if isLastIdF(dMsgIdx, dMsg.length)
        log("########### isLastIdF")
        if (dMsg.length > 0)
            log("########### dMsg.length > 0")
            karotz.chain.tts(__("message.end") , mainLang ).exec( () -> readFacebookFsm.nexttype() )
            
        else
            log("## RETURN ")
            readFacebookFsm.nexttype()
        return
    
    log("idx: " + dMsgIdx)
    #log("created_time: " + dMsg[dMsgIdx].created_time)
    #lastReadMail = dMsg[dMsgIdx].created_time;
    #social.facebook.saveLastMail(dMsg[dMsgIdx].messages[dThreadMsgIdx].created_time);
    if(readOrder == "chrono")
        social.facebook.saveLastMail(dMsg[dMsgIdx].messages[dThreadMsgIdx].created_time);
    else
        social.facebook.saveLastMail(dMsg[0].messages[0].created_time);

    if !Math.floor(Math.random()*3)
        karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    msg = dMsg[dMsgIdx].messages[dThreadMsgIdx]
    msg.message = msg.body
    msg.actor_id = msg.author_id
    log("msg "+JSON.stringify(msg))
    if  msg.attachment && msg.attachment.href && msg.attribution 
        if msg.attribution == "SoundCloud"
            log("###### facebook has Soundcloud");
            readFacebookFsm.streamSound(msg)
            return
        #else if msg.attachment.caption == "www.youtube.com" || msg.attachment.caption == "www.wat.tv" || msg.attachment.caption == "www.dailymotion.com"
        #    readFacebookFsm.next() #readFacebookFsm.video()
        #    return
        else if msg.attachment.media
            readFacebookFsm.streamMedia(msg)
            return

    else if msg.message
        readFacebookFsm.streamText(msg)
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
    
readFacebookFsm.onFacebookDirectSkip2 = ->
    log("onFacebookDirectSkip2")
    karotz.tts.stop()
    karotz.multimedia.stop();
    
readFacebookFsm.onFacebookDirectNext = ->
    log("onFacebookDirectNext")
    dThreadMsgIdx--
    if dThreadMsgIdx < 0
        dThreadMsgIdx = 0;
        dMsgIdx = setNextIdF(dMsgIdx)
        if !isLastIdF(dMsgIdx, dMsg.length)
            dThreadMsgIdx = dMsg[dMsgIdx].messages.length - 1
    
    readFacebookFsm.next()
    

readFacebookFsm.onFacebookMessageMedia = ->
    from = getUserInfoCache(wall[wallIdx].actor_id)
    
    msg = wall[wallIdx].attachment.name
    
    msgLang = getLang(msg)
    log("message lang: " + msgLang)
    
    if parentalControl
            msg = assCleaner(msg)
    
    #voice = getUserVoice(from, msgLang)
    karotz.chain.tts( __("message.from", {name: from.name}) , mainLang )
    .tts(msg, msgLang)
    .exec( () -> readFacebookFsm.next() )

readFacebookFsm.onFacebookMessageText = ->
    log("onFacebookMessageText")
    msgLang = getLang(wall[wallIdx].message)
    log("message lang: " + msgLang)
    
    from = getUserInfoCache(wall[wallIdx].actor_id)
    #voice = getUserVoice(from, msgLang)
    
    if parentalControl
            wall[wallIdx].message = assCleaner(wall[wallIdx].message)

    karotz.chain.tts( __("message.from", {name: from.name}) , mainLang )
    .tts(wall[wallIdx].message, msgLang)
    .exec( () -> readFacebookFsm.next() )

readFacebookFsm.onFacebookMessageSound = ->
    log("onFacebookMessageSound")
    from = getUserInfoCache(wall[wallIdx].actor_id)
    
    m = audioReg.exec(wall[wallIdx].attachment.href);
    audioUrl = m[1]+"/download"
    karotz.chain.tts(__("message.audio", {name: from.name}) , mainLang )
    .play(audioUrl)
    .exec( () -> readFacebookFsm.next() )
 
