old_tts = karotz.tts.start

default_tts = (text, lang, name, callback) ->
	old_tts(text, name, callback)

kagedo_regexp = new RegExp('url="(.*?)"')

kagedo_tts = (text, lang, name, callback) ->
    textCustom =  text+'. bla h'
    try
        tmpXml = "<KagedoSynthesis><Identification><codeAuth>10O328e5934A7</codeAuth></Identification><Result><ResultCode/><ErrorDetail/></Result><MainData><DialogList><Dialog character=\"#{ name }\">#{ textCustom }</Dialog></DialogList></MainData></KagedoSynthesis>"
        log(tmpXml)
        data = {KagedoSynthesis: tmpXml}
        result = http.post("http://webservice.kagedo.fr/synthesis/ws/makesound", data)
        log("voice: " + name)
        log(result)
        m = kagedo_regexp.exec(result);
        karotz.multimedia.play(m[1], callback)
    catch error
        log(error)
        old_tts(text, lang, callback);

acapela_regexp = new RegExp('retour_php=(.*?)\\&')

acapela_tts = (text, lang, name, callback) ->
    textCustom = '. ' + text + '. .'
    try
        data = {
            client_request_type : 'CREATE_REQUEST',
            client_voice : name,
            actionscript_version : '3',
            client_text: textCustom,
            client_version: "1-00",
            client_login: "asTTS",
            client_password: "demo_web"
        }
        log("acapela post")
        result = http.post("http://vaas.acapela-group.com/Services/DemoWeb/textToMP3.php", data)
        log("voice: " + name)
        log(result)
        m = acapela_regexp.exec(result);
        karotz.multimedia.play(m[1], callback)
    catch error
        log(error)
        old_tts(text, lang, callback);

class Voice
    constructor: (@lang, @name, @sex, @func) ->
    
    say: (text, callback) ->
        log("txt Voice: "+@name)
        log("txt : "+text)
        @func(text, @lang, @name, callback)
    
    toString: () ->
        @name

karotz.tts.voices = {
    #FR
    "fr"            : new Voice("fr","fr"           , "F", default_tts),
    "fr"            : new Voice("fr","fr"           , "M", default_tts), 
    #KAGEDO
    #"narbe"         : new Voice("fr","narbe"        , "M", kagedo_tts),
    #"mamie"         : new Voice("fr","mamie"        , "F", kagedo_tts),
    #"jose"          : new Voice("fr","jose"         , "M", kagedo_tts),
    #"manuella"      : new Voice("fr","manuella"     , "F", kagedo_tts),
#    "samy"          : new Voice("fr","samy"         , "M", kagedo_tts),
    #"bicool"        : new Voice("fr","bicool"       , "M", kagedo_tts),
    #"guy_vieux"     : new Voice("fr","guy_vieux"    , "M", kagedo_tts),
    #"papanoel"      : new Voice("fr","papanoel"     , "M", kagedo_tts),
#    "ramboo"        : new Voice("fr","ramboo"       , "M", kagedo_tts),
    #"sidoo"         : new Voice("fr","sidoo"        , "M", kagedo_tts),
    #"Philippe"      : new Voice("fr","Philippe"     , "M", kagedo_tts),
#    "chuchotement"  : new Voice("fr","chuchotement" , "M", kagedo_tts),
    #"matteo"        : new Voice("fr","matteo"       , "M", kagedo_tts),
    #"nono"          : new Voice("fr","nono"         , "M", kagedo_tts),
    #"helium"        : new Voice("fr","helium"       , "M", kagedo_tts),
    #"JulieEnfant"   : new Voice("fr","JulieEnfant"  , "F", kagedo_tts),
    #"grave"         : new Voice("fr","grave"        , "M", kagedo_tts),
#    "darkvadoor"    : new Voice("fr","darkvadoor"   , "M", kagedo_tts),
    #"electra"       : new Voice("fr","electra"      , "F", kagedo_tts),
    #ACAPELA
    #'antoine22k'    : new Voice("fr","antoine22k"   , "M", acapela_tts),
    #'alice22k'      : new Voice("fr","alice22k"     , "F", acapela_tts),
    #'julie22k'      : new Voice("fr","julie22k"     , "F", acapela_tts),
    #'claire22k'     : new Voice("fr","claire22k"    , "F", acapela_tts),
    #'margaux22k'    : new Voice("fr","margaux22k"   , "F", acapela_tts),
    #'bruno22k'      : new Voice("fr","bruno22k"     , "M", acapela_tts),

    #EN
    "en"            : new Voice("en","en"           , "F", default_tts),
    "en"            : new Voice("en","en"           , "M", default_tts),
    #'heather22k'    : new Voice("en",'heather22k'   , "F", acapela_tts),
    #'kenny22k'      : new Voice("en",'kenny22k'     , "M", acapela_tts),
    #'laura22k'      : new Voice("en",'laura22k'     , "F", acapela_tts),
    #'nelly22k'      : new Voice("en",'nelly22k'     , "F", acapela_tts),
    #'ryan22k'       : new Voice("en",'ryan22k'      , "M", acapela_tts),
    #'tracy22k'      : new Voice("en",'tracy22k'     , "F", acapela_tts),

    #UK
    #'graham22k'     : new Voice("uk",'graham22k'    , "M", acapela_tts),
    #'lucy22k'       : new Voice("uk",'lucy22k'      , "F", acapela_tts),
    #'peter22k'      : new Voice("uk",'peter22k'     , "M", acapela_tts),
    #'rachel22k'     : new Voice("uk",'rachel22k'    , "F", acapela_tts),

    #ES
    'es'            : new Voice("es",'es'           , "F", default_tts),
    'es'            : new Voice("es",'es'           , "M", default_tts),
    #'antonio22k'    : new Voice("es",'antonio22k'   , "M", acapela_tts),
    #'ines22k'       : new Voice("es",'ines22k'      , "F", acapela_tts),
    #'maria22k'      : new Voice("es",'maria22k'     , "F", acapela_tts),
    
    #DE
    'de'            : new Voice("de",'de'           , "F", default_tts),
    'de'            : new Voice("de",'de'           , "M", default_tts),

    #NL
    #'femke22k'      : new Voice("nl",'femke22k'     , "F", acapela_tts),
    #'max22k'        : new Voice("nl",'max22k'       , "M", acapela_tts),
}

karotz.tts.filterByLang = (lang) ->
    for own name,voice of karotz.tts.voices when voice.lang == lang
        voice

karotz.tts.filter = (filter) ->
    filterFunction = (filter, voice) ->
        for own key, value of filter
            if voice[key] != value
                return false
        return true
    for own name,voice of karotz.tts.voices when filterFunction(filter, voice)
        voice

karotz.tts.start = (text, name, callback) ->
    voice = karotz.tts.voices[name] ? karotz.tts.voices["fr"]
    voice.say(text, callback)

        
    
