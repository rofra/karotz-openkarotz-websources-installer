queue = []

availableLang = {};
availableLang["fr"] = true;
availableLang["en"] = true;
availableLang["de"] = true;
availableLang["es"] = true;

karotz.chain = {}

karotz.chain.tts = (text, lang) ->
    queue.push( () ->
        karotz.tts.start("<prosody rate='0.90'>" + text + "</prosody>", lang, (event) ->
            queue.shift()() if event == "TERMINATED" || event == "CANCEL" || event == "ERROR"
        )
    )
    karotz.chain

karotz.chain.play = (url) ->
    queue.push( () ->
        karotz.multimedia.play(url, (event) ->
            queue.shift()() if event == "TERMINATED" || event == "CANCEL" || event == "ERROR"
        )
    )
    karotz.chain

karotz.chain.wait = (time) ->
    queue.push( () ->
        setTimeout(time, () -> 
            queue.shift()()
            false
        )
    )
    karotz.chain

karotz.chain.chain = (func, params) ->
    queue.push( () ->
        func(params, queue.shift())
    )
    karotz.chain

karotz.chain.direct = (func) ->
    queue.push( () ->
        func()
        queue.shift()()
    )
    karotz.chain

karotz.chain.exec = (last) ->
    if last
        queue.push(last)
    else
        queue.push(()->
            log("END")
            )
    queue.shift()()
    karotz.chain
