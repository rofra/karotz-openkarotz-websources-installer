include("util.js");  
var karotz_ip = 'localhost'; //Change this IP address 
var pauseAudio = 'no'; // 

var buttonListener = function(event) { 
    if (event == "DOUBLE") { 
        karotz.multimedia.stop(); 
        exit(); 
    } 
    if ((event == "SIMPLE")&& (pauseAudio == 'no')) { 
        pauseAudio = 'yes'; 
		karotz.led.pulse("0000FF",500,-1) ;
        karotz.multimedia.pause(); 
    } 
    else if ((event == "SIMPLE")&& (pauseAudio == 'yes')) { 
        pauseAudio = 'no'; 
		karotz.led.fade('F8AB23', 5000);
        karotz.multimedia.resume(); 
    } 
    return true; 
} 
var exitFunction = function(event) { 
    if ((event == "TERMINATED") && (pauseAudio == 'no')) { 
    exit(); 
    } 
    return true; 
} 
var onKarotzConnect = function(data) { 
    karotz.button.addListener(buttonListener); 
	karotz.led.fade('F8AB23', 5000);
	karotz.tts.start("Bienvenue sur radio Ménergy                    ",'fr',Lecture);
} 
var Lecture = function() {
	var path = "http://mp3.live.tv-radio.com/menergy/all/menergy.mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path,function(event){	 
      var duree = params[instanceName].duree;
	  if (duree==0) {}
	  else
	  {
      	var duree_ms = duree*60*1000;
	  	setTimeout(duree_ms,exit);
	  }
    });
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});