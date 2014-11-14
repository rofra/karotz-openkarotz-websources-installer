include("dom.js")
include("url.js");
include("data.js");

var podIdx=0;
var pod = http.get(podUrl);
var parser = new DOMParser();
var xmlRss = parser.parseFromString(pod);
var podList = xmlRss.getElementsByTagName('enclosure');
var soundUrl = podList[podIdx].getAttribute('url');
log("URL: "+soundUrl);

karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

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

var nextPod;
var play = function()
{
  log(soundUrl);
  karotz.multimedia.play(soundUrl,function(event){if(event == "TERMINATED")nextPod();});
}

var nextPod = function()
{
    log("nxt pod");
    log(podIdx);
    log(podList.length);

    podIdx = podIdx+1;
    if (podIdx >= podList.length  ){ 
      log("exit()");
      karotz.multimedia.stop();
      exit();
    }
    soundUrl = podList[podIdx].getAttribute('url'); 
    play();
}

var buttonListener = function(event)
{
    if(event == "SIMPLE")
    {
       //togglePause();
       nextPod();      
    }
    else if(event == "DOUBLE")
    {
       exit();
    }
    return true;
}

var onKarotzConnect = function(data){
    karotz.led.light("00ffff");

    karotz.tts.start(txtPodcast + " : " + instanceName, lang, function(event){
	if(event == "TERMINATED"){
		play();
		return false;
	}
	return true;
    });
    
    karotz.button.addListener(buttonListener);
    setTimeout(60000, function(){ log("ping"); ping(); return true; });
}

var data = {};

karotz.connectAndStart(host, port, onKarotzConnect, data);
