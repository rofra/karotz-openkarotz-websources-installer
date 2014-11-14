include('util.js');

// Par Bixy @ karotz.emulcentral.com
// Appz Radio Techno Music

//variables
var str_startup = "Je lance la webradio, Techno Music !";
//var str_bpause1 = "Je met en pause la webradio, Techno Music !";//à implanter plus tard
//var str_bpause2 = "Reprise de la webradio, Techno Music !";//à implanter plus tard
var tts_language = "fr";
var maradio = "http://128k.technomusic.com:8006";
var pause = true;
var karotz_ip = 'localhost';
var data = {}; 

//Codes
var monping = function(event){//Pour le ping initial et ensuite au 15 minutes
    ping();
    setTimeout(600000, function() { monping(); return true; });
}

var buttonListener = function(event){
  if (event == "SIMPLE") {//appuie simple permet pause / autre appuie simple permet de reprendre la lecture de la webradio
    karotz.led.light("000000");
    pause = !pause;
    if (!pause) {
      karotz.led.pulse("75FF00", 500, -1);
      karotz.multimedia.pause();//PAUSE
    }
    else {
      karotz.led.pulse("4B0082", 2000, -1);
      karotz.multimedia.resume();//REPRISE
    }
  }
  if (event == "DOUBLE") {
    karotz.multimedia.stop();
    exit();
  }
  return true;
}

var onKarotzConnect = function(data){
  karotz.led.light("000000");
  karotz.led.pulse("4B0082", 2000, -1);
  karotz.button.addListener(buttonListener);
  monping(); //pour le lancer la première fois, ensuite il s'exécutera toute les 10 mn
  karotz.tts.start(str_startup, tts_language, function(event){
    if ((event = "TERMINATED") || (event == "CANCELLED")) {
      karotz.multimedia.play(maradio);
    }
  })
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);