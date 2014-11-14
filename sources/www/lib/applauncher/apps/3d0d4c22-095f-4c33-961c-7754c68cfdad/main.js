include("util.js");
include("url.js");
include("data.js");

var playerStatus = "play"

var setLedIdle = function()
{
    karotz.led.light("0000FF");
}
 
var setLedPlay = function()
{
    karotz.led.fade("000000",400,function(event){if(event == "TERMINATED")karotz.led.pulse("0000FF", 800, -1);});
}

var setLedPause = function()
{
    karotz.led.fade("000000",200,function(event){if(event == "TERMINATED")karotz.led.pulse("0000FF", 400, -1);});
}

var buttonListener = function(event)
{
    if(event == "SIMPLE")
    {
       togglePause(); 
    }
    else if(event == "DOUBLE")
    {
	karotz.multimedia.stop(exit);
    }
    return true;
}

var togglePause = function()
{
        if(playerStatus == "pause")
        {
    	    karotz.multimedia.resume();
            setLedPlay();
            playerStatus = "play";
        }
        else if (playerStatus == "play")
        {
    	    karotz.multimedia.pause();
            setLedPause();
            playerStatus = "pause";
        }
        else if (playerStatus == "stop")
        {
    	    karotz.multimedia.play(urlRadio);
            setLedPlay();
            playerStatus = "play";
        }
}

var multimediaListener = function(action)
{
    log("multi callback");
    log("multi callback. action : " + action);

    switch (action)
    {
        case "STOP":
            karotz.multimedia.play(urlRadio);
            break;
        default:
            break;
    }

    return true;
}

var onKarotzConnect = function(data){
    karotz.led.light("00ffff");
    setLedPlay();
    karotz.button.addListener(buttonListener);
    karotz.multimedia.addListener(multimediaListener);

    karotz.tts.start(txtTTS + appliName, lang, function(event){
	if(event == "TERMINATED"){
		karotz.multimedia.play(urlRadio);
		return false;
	}
	return true;
    });

    setTimeout(60000, function(){ log("ping"); ping(); return true; });
}

log("params appliName: " + appliName);
log("params urlRadio: " + urlRadio);

var data = {};
karotz.connectAndStart(host, port, onKarotzConnect, data);
