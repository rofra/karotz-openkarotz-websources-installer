timeline = [];
timelineIdx = -1;
dMsg = []
dMsgIdx = -1
mention = []
mentionIdx = -1
parentGlobalFsm = []
gMsg = ""

readTwitterFsm.run = (cb)->
    readTwitterFsm.onEnd = cb    
    readTwitterFsm.readTwitter()
    
readTwitterFsm.onTwitterNoConfError = (cb) ->
    log("onTwitterNoConfError")
    led.readTwitter();
    readTwitterFsm.onEnd = cb    
    
    gMsg = __("message.error.noConf", {name: __("twitter") })
    
    karotz.chain
    .play(__("audio.error"))
    .tts(gMsg , mainLang )
    .exec( () ->
        readTwitterFsm.stop()
    )
    
getUserVoice = (from, lang) ->
    try
        gender = "M"
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
    
initId = (len) ->
    if(readOrder == "chrono")
        len - 1
    else
        0
        
setNextId = (id) ->
    if(readOrder == "chrono")
        id - 1
    else
        id + 1
        
isLastId = (id, len) ->
    if(readOrder == "chrono" && id < 0)
        1
    else if(readOrder == "antechrono" && (id > len - 1 || id < 0))
        1
    else
        0
    
readTwitterFsm.onTwitterMessageInit = (parentFsm) ->
    log("onTwitterMessageInit")
    if launchType.name != 'SCHEDULER'
        led.work();
    parentGlobalFsm = parentFsm
    timeline = [];
    timelineIdx = -1;
    dMsg = []
    dMsgIdx = -1
    mention = []
    mentionIdx = -1
    gMsg =__("twitter") + " : " + __("message.youhave")
    if useTwitterDMsg 
        dMsg = social.twitter.getDirectMessages(20, social.twitter.getLastMessage());
        if dMsg.error
            karotz.chain
            .play(__("audio.error"))
            .tts(__("message.error.twitter") , mainLang )
            .exec( () ->
                readTwitterFsm.stop()
            )
            return
        if dMsg.length > 0
            if dMsg.length > 1
                gMsg += __("message.new.twitter.dmsg.pl", {num: dMsg.length }) + ", "
            else
                gMsg += __("message.new.twitter.dmsg.s", {num: dMsg.length }) + ", "
        dMsgIdx = initId(dMsg.length)

    if useTwitterMention 
        mention = social.twitter.getMentions(20, social.twitter.getLastMention());
        if mention.error
            karotz.chain
            .play(__("audio.error"))
            .tts(__("message.error.twitter") , mainLang )
            .exec( () ->
                readTwitterFsm.stop()
            )
            return
        if mention.length > 0
            if mention.length > 1
                gMsg += __("message.new.twitter.mention.pl", {num: mention.length }) + ", "
            else
                gMsg += __("message.new.twitter.mention.s", {num: mention.length }) + ", "
                
        mentionIdx = initId(mention.length)

    if useTwitterTimeLine 
        timeline = social.twitter.getHomeTimeline(20, social.twitter.getLastTimeline());
        if timeline.error
            karotz.chain
            .play(__("audio.error"))
            .tts(__("message.error.twitter") , mainLang )
            .exec( () ->
                readTwitterFsm.stop()
            )
            return
        if timeline.length > 0
            if timeline.length > 1
                gMsg += __("message.new.twitter.timeline.pl", {num: timeline.length }) + ", "
            else
                gMsg += __("message.new.twitter.timeline.s", {num: timeline.length }) + ", "

        timelineIdx = initId(timeline.length)

    gMsg += __("message.clicktolisten")

    sum = dMsg.length + mention.length + timeline.length 
    
    log("gMsg "+gMsg)
    ttsCb = ->
    if sum == 0
        ttsCb =  ->
            isConnected = true
            led.readTwitter()
            karotz.chain
            .tts(__("message.noNew.twitter") , mainLang )
            .exec( () ->
                if readTwitterFsm.current == "TwitterMessageInit"
                    readTwitterFsm.stop()
            )           
    else
        ttsCb =  ->
            isConnected = true
            led.waitUser()
            karotz.chain.play(__("audio.start"))
            .tts(gMsg , mainLang )
            .exec( () ->
               setTimeout(10000, () -> 
                if readTwitterFsm.current == "TwitterMessageInit"
                   readTwitterFsm.stop()
               )
            )
    
    
    #karotz.ears.moveRelative(100, 100)
    
    if sum == 0 && launchType.name == 'SCHEDULER'
        readFacebookFsm.stop()
    else
        if isConnected == false
            log("isConnected == false -> connecting")
            data= {}
            karotz.start2(ttsCb, data);
        else
            log("isConnected == true -> go")
            ttsCb() 
        
readTwitterFsm.onTwitterDirect = () -> 
    log("onTwitterDirect: " + dMsgIdx)
    led.readTwitter()
    karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    
    if(isLastId(dMsgIdx, dMsg.length))
        readTwitterFsm.nexttype()
        return
        
    message =  dMsg[dMsgIdx]
    log("message: " + JSON.stringify(message))
    msgLang = getLang(message.text)
    
    voice = getUserVoice(message.sender, msgLang)
    
    if message.text
        text = social.twitter.replaceLink(message.text, msgLang)
        text = social.twitter.replaceMentionName(message, text)
        text = social.twitter.cleanText(text)
        if parentalControl
            text = assCleaner(text)
        karotz.chain.tts(__("message.from", {name: message.sender.name}) , mainLang )
        .tts(text, voice.name)
        .exec( () -> 
            social.twitter.saveLastMessage(message.id_str)
            readTwitterFsm.next() )

readTwitterFsm.onTwitterDirectNext = () ->
    log("onTwitterDirectNext")
    karotz.tts.stop()
    karotz.multimedia.stop();
    dMsgIdx = setNextId(dMsgIdx)
    if(isLastId(dMsgIdx, dMsg.length))
        karotz.chain.tts(__("message.end") , mainLang ).exec( () -> readTwitterFsm.nexttype()) 
    else
        readTwitterFsm.next()


readTwitterFsm.onTwitterMention = () ->
    log("onTwitterMention")
    karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    
    if(isLastId(mentionIdx, mention.length))
        readTwitterFsm.nexttype()
        return
    
    message =  mention[mentionIdx]
    log("message: " + JSON.stringify(message))
    msgLang = getLang(message.text)
    
    voice = getUserVoice(message.user, msgLang)
    
    if message.text
        text = social.twitter.replaceLink(message.text, msgLang)
        text = social.twitter.replaceMentionName(message, text)
        text = social.twitter.cleanText(text)
        if parentalControl
            text = assCleaner(text)
        karotz.chain.tts(__("mention.from", {name: message.user.name}) , mainLang )
        .tts(text, voice.name)
        .exec( () -> 
            social.twitter.saveLastMention(message.id_str)
            readTwitterFsm.next() )

readTwitterFsm.onTwitterMentionNext = () ->
    log("onTwitterMentionNext")
    karotz.tts.stop()
    karotz.multimedia.stop();
    mentionIdx = setNextId(mentionIdx)
    if(isLastId(mentionIdx, mention.length))
        karotz.chain.tts(__("mention.end") , mainLang ).exec( () -> readTwitterFsm.nexttype() )
    else
        readTwitterFsm.next()

#readTwitterFsm.onleaveTwitterMessageInit = ->
#    log("onleaveFacebookInit")
#    karotz.ears.reset()

readTwitterFsm.onTwitterMessage = () ->
    log("onTwitterMessage: " + timelineIdx)
    karotz.ears.moveRelative(Math.floor(Math.random()*17), Math.floor(Math.random()*17))
    
    if(isLastId(timelineIdx, timeline.length))
        readTwitterFsm.nexttype()
        return
        
    message =  timeline[timelineIdx]
    log("message: " + JSON.stringify(message))
    msgLang = getLang(message.text)
    
    voice = getUserVoice(message.user, msgLang)
    
    if message.text
        text = social.twitter.replaceLink(message.text, msgLang)
        text = social.twitter.replaceMentionName(message, text)
        text = social.twitter.cleanText(text)
        if parentalControl
            text = assCleaner(text)
        karotz.chain.tts(__("timeline.from", {name: message.user.name}) , mainLang )
        .tts(text, voice.name)
        .exec( () -> 
            social.twitter.saveLastTimeline(message.id_str)
            readTwitterFsm.next() )

#readTwitterFsm.onleaveTwitterMessage = () ->
    #karotz.tts.stop()

readTwitterFsm.onTwitterMessageStop = ->
    log("TwitterMessageStop")
    karotz.tts.stop()
    karotz.multimedia.stop();

readTwitterFsm.onTwitterMessageNext = ->
    log("onTwitterMessageNext")
    karotz.tts.stop()
    karotz.multimedia.stop();
    timelineIdx = setNextId(timelineIdx)
    if(isLastId(timelineIdx, timeline.length))
        karotz.chain.tts(__("timeline.end") , mainLang ).exec( () -> readTwitterFsm.nexttype() )
    else
        readTwitterFsm.next()
