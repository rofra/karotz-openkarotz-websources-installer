include("util.js");

setTimeout(300000, function(){ log("ping"); ping(); return true; });
var buttonListener = function(event) {
    if (event == "DOUBLE") {
          karotz.multimedia.stop();
    exit();
    }
    return true;
}

var onKarotzConnect = function(data){
	karotz.led.pulse('3300FF', 4000, -1);
    var path = "http://mp3.live.tv-radio.com/nostalgie_chansons_francaises/all/nos_174706.mp3" ;
    karotz.button.addListener(buttonListener);
    karotz.multimedia.play(path, function(event){
          if(event == "TERMINATED"){
                exit();
          }

      var duree = params[instanceName].duree;

      var duree_ms = duree*60*1000;

      setTimeout(duree_ms,exit);


    });
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});