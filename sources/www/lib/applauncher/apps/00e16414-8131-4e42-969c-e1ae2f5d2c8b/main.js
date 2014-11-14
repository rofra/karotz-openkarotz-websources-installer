include("util.js");
var karotz_ip = "localhost"

var mon_nombre_aleatoire = Math.floor(Math.random() * params[instanceName].age);
if (params[instanceName].voice == "8") { params[instanceName].voice = 100*Math.floor(Math.random() * 8); }
var phrasechoisie = mon_nombre_aleatoire + +params[instanceName].voice;

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    //karotz.tts.start(phrasechoisie, params[instanceName].voice, exitFunction);
    karotz.multimedia.play("http://www.bregeon.net/karotz/on_ne_dit_pas/" + phrasechoisie + ".ogg", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});