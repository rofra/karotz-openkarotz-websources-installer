include("util.js");

setTimeout(300000, function(){ log("ping"); ping(); return true; });
var pause = true;
var station = "daimarrage de la radio vivaciter bruxelles";
var buttonListener = function(event)
{
  if (event == "SIMPLE") {//appui simple permet de mettre en pause / reprendre la lecture du flux radio
    pause = !pause;
    if (!pause) {
      karotz.multimedia.pause();//je mets le lecteur multimedia en pause et je vais fumer un gros bédo
    }
    else {
      karotz.multimedia.resume();//je reprends ma lecture et je me verse un ricard
    }
  }
  if (event == "DOUBLE") {
    karotz.multimedia.stop();
    exit();
  }
  return true;
}

var onKarotzConnect = function(data){
var light = new Array("FF0000", "00FF00", "00FFFF", "0000FF", "FF33FF", "FF66FF", "FF00FF", "75FF00", "4FFF68", "FF0000", "00FF00", "0000FF");
var color = 0;
var go_light = function() {
    color += 1; if (color == 12) color = 0;
    karotz.led.fade(light[color], 5000, function(event) {
        if ((event == 'CANCELLED') || (event == 'TERMINATED')) {
        go_light();
        }
    });
}
    karotz.button.addListener(buttonListener);
    karotz.led.light(light[color]);
    go_light();
    var path = "http://vivacitebruxelles.ice.rtbf.be/vivacitebruxelles.mp3" ;
    karotz.tts.start(station, 'fr', function(event){
    if ((event = "TERMINATED") || (event == "CANCELLED")) {
      karotz.multimedia.play(path) ;
}

      var duree = params[instanceName].duree;

      var duree_ms = duree*60*1000;

      setTimeout(duree_ms,exit);


    });
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});