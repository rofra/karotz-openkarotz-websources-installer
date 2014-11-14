include("util.js");
var karotz_ip = "localhost"//ici votre adresse IP  ou localhost  si appli en ligne
var zic = new Array();
zic[0] = "http://storage-new1.newjamendo.com/tracks/944721_96.mp3";
zic[1] = "http://storage-new1.newjamendo.com/tracks/725574_96.mp3";
zic[2] = "http://storage-new1.newjamendo.com/tracks/917546_96.mp3";
zic[3] = "http://storage-new1.newjamendo.com/tracks/715053_96.mp3";
zic[4] = "http://storage-new1.newjamendo.com/tracks/887208_96.mp3";
zic[5] = "http://storage-new1.newjamendo.com/tracks/939895_96.mp3";
zic[6] = "http://storage-new1.newjamendo.com/tracks/310389_96.mp3";
zic[7] = "http://storage-new2.newjamendo.com/tracks/724278_96.mp3";
zic[8] = "http://storage-new2.newjamendo.com/tracks/951447_96.mp3";
zic[9] = "http://storage-new2.newjamendo.com/tracks/578682_96.mp3";


var mon_nombre_aleatoire = Math.floor(Math.random() * 10); //donne un nombre entre 0 et 18

var zicchoisie = zic[mon_nombre_aleatoire];

var buttonListener = function(event){
  if (event == "DOUBLE") {
    karotz.multimedia.stop();
    exit();
  }
  return true;
}

var exitFunction = function(event){
if ((event == "CANCELLED") || (event == "TERMINATED")) {
  exit();
  }
  return true;
}

var onKarotzConnect = function(data){
  karotz.button.addListener(buttonListener);
  karotz.multimedia.play(zicchoisie)
  }

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

 
