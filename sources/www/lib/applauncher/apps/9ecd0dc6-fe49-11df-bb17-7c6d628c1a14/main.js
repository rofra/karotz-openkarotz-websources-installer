include("led.js");
include("data.js");

var lang = "";

var numSounds = new Array();
numSounds["fr"] = 304;
numSounds["it"] = 306;
numSounds["ja-JP"] = 297;
numSounds["br"] = 298;
numSounds["de"] = 292;
numSounds["es"] = 306;
numSounds["uk"] = 300;
numSounds["us"] = 297;
  


karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var random = function(){
    var num = 1;
    num = Math.ceil(Math.random()* numSounds[lang] );
    log("rand = " + num);
    return num + 1;
}

var buttonListener = function(event)
{
    if (event == "DOUBLE")
    {
        // quit, whatever we're doing
        karotz.multimedia.stop();
        exit();
    }
    return true;
}

var onKarotzConnect = function(data){
    log("connected to Karotz");
    karotz.button.addListener(buttonListener);

    var path = urlBase + lang +"/" + (random()) + ".mp3";
    log(path);

    rndLed();
    setTimeout(3000, rndLedCb);

    karotz.multimedia.play(path ,function(event){if(event != "OK")exit();});
}

lang = params["config"].lang
log("Moods lang : " + lang);

karotz.connectAndStart(host, port, onKarotzConnect, {});

