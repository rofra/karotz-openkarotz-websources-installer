include("util.js");

var url_de_ma_radio = "http://www.toolweb.biz/KAROTZ_SERVER/meditation.mp3";
var karotz_ip = "localhost"; //ici votre adresse IP  ou localhost  pour la version embarquée.
//var karotz_ip = "192.168.1.199";




var exitFunction = function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
    exit();
    }
    return true;
}

var fin_bouge_oreilles = function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
    karotz.ears.move(6, 5,play_son);
    
    }
    return true;
}

var oreilles_en_place = function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
    karotz.ears.move(0, 0 ,fin_bouge_oreilles);   
    }
    return true;
}


var play_son = function (event)
{

if ((event == "CANCELLED") || (event == "TERMINATED")) {
      karotz.led.light("000000");
      karotz.led.fade("FFA500", 4200000); 
      karotz.multimedia.play(url_de_ma_radio,exitFunction);
    
    }
    return true;
}
  




var buttonListener = function(event)
{
  
  if (event == "DOUBLE") {
    karotz.multimedia.stop();
    exit();
        
  }
  return true;
}

var onKarotzConnect = function(data){
 
  karotz.button.addListener(buttonListener); //autorise l'interruption par le bouton
  karotz.ears.reset;
  karotz.led.light("4FFF68");
  karotz.led.fade("000000", 1000, oreilles_en_place);
  
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});