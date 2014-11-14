include("util.js");

var karotz_ip="localhost";
//var karotz_ip="192.168.0.113";

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.multimedia.play(url_mp3, exitFunction);
}

// On liste les items
var data = file.read("liste_urls.csv");
var fileContent = data.text;

var reg=new RegExp("[\n]+", "g");
var tableau = fileContent.split(reg);
var nb_items = tableau.length-1;

// Choix d'un item au hasard
var id_random = Math.round(Math.random() * nb_items); 
log("random : " + id_random);

var url_mp3 = myextract(tableau[id_random], "^([^;]*);");
log("url : " + url_mp3);

// Lecture du fichier son
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

