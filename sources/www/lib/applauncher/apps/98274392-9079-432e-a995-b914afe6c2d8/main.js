include("util.js");
var url_de_ma_radio = "http://stream.nute.net:8000/kohina/stream.ogg.m3u";
var karotz_ip = "localhost"; //ici votre adresse IP  ou localhost  pour la version embarquée.
//var karotz_ip = "localhost";

var pause = true;

var monping = function(event){//cette fonction évite que la radio se coupe au bout de 15 minutes
    ping();//normalement karotz.ping() mais ne fonctionne pas avec la VM  Java .
    setTimeout(600000, function() { monping(); });
}

var bouge_oreille_gauche = function (event)
{
   karotz.ears.moveRelative(1, 0);
   setTimeout(300000, function() { bouge_oreille_gauche(); });
}

var bouge_oreille_droite = function (event)
{
   karotz.ears.moveRelative(0, 1);
   setTimeout(600000, function() { bouge_oreille_droite(); });
}

var exitFunction = function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
    exit();
    }
    return true;
}

var je_coupe_le_son = function (event)
{
     
      karotz.tts.start("Je coupe le son...", "fr");
      //le clignotement est jaune et plus rapide pour indiquer une pause
      karotz.led.pulse("75FF00", 500, -1); 
}

var je_remets_le_son = function (event)
{
     karotz.multimedia.resume();//je reprends ma lecture
     karotz.led.pulse("FFCFAF", 2000, -1);
}

var oreille_bougee = function (event)
{
    karotz.tts.start("<voice emotion ='happy'>Tu crois peut-être que bouger une de mes oreilles pourra me faire du bien?<break time='600ms'/> Raté!", "fr");
}

var a_bientot = function (event)
{
      exit();
}

var play_kohina = function (event)
{
   karotz.multimedia.play(url_de_ma_radio);
   karotz.led.light("000000");
   karotz.led.pulse("FFCFAF", 2000, -1); //cligotement rose, pulse de 2 secondes, boucle indéfiniment
}



var buttonListener = function(event)
{
  if (event == "SIMPLE") {//appui simple permet de mettre en pause / reprendre la lecture du flux radio
    karotz.led.light("000000");                  
    pause = !pause;
    if (!pause) {      
      
      karotz.multimedia.pause();//je mets le lecteur multimedia en pause 
      setTimeout(1200, je_coupe_le_son);
         
    }
    else {
      karotz.tts.start("<voice emotion ='happy'>Et je remets le son!", "fr");       
      setTimeout(3500, je_remets_le_son);    
      
    }
  }
  if (event == "DOUBLE") {
    karotz.multimedia.stop();
    karotz.tts.start("<voice emotion ='happy'>A bientot!", "fr");   
    setTimeout(2000, a_bientot);
    
  }
  return true;
}

var onKarotzConnect = function(data){
  karotz.tts.start("<voice emotion ='happy'>Radio Kohina,<break time='600ms'/> c'est parti!", "fr"); 
  karotz.button.addListener(buttonListener); //autorise l'interruption par le bouton
   monping(); //pour le lancer la première fois, ensuite il s'exécutera toute les 10 mn
  setTimeout(4000, play_kohina);
  setTimeout(10000, bouge_oreille_gauche);
  setTimeout(600000, bouge_oreille_droite);
  
  
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});