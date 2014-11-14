include("util.js");
var karotz_ip = "localhost"
//var karotz_ip = "192.168.1.46"
var jai_fini = 0; ;

var mon_nombre_aleatoire = Math.floor(Math.random() * 71);
if (params[instanceName].voice == "8") { params[instanceName].voice = 100*Math.floor(Math.random() * 8); }
var phrasechoisie = mon_nombre_aleatoire + +params[instanceName].voice;

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    if (event == "SIMPLE") {
        jai_fini -= 1;
        karotz.multimedia.play("http://www.bregeon.net/karotz/proverbe/" + phrasechoisie + ".mp3", exitFunction);
        //exit();
    }
    return true;
}
var suiteFunction = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        karotz.multimedia.play("http://www.bregeon.net/karotz/proverbe/" + phrasechoisie + ".mp3", exitFunction);
    }
    return true;
}
var exitFunction = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        log("hello");
        setTimeout(5000, function() { log("jai_fini " + jai_fini); jai_fini += 1; if (jai_fini >= 1) { exit(); }; return true; });
        if (jai_fini >= 1) { exit(); }
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    //karotz.tts.start(phrasechoisie, params[instanceName].voice, exitFunction);
    karotz.multimedia.play("http://www.bregeon.net/karotz/proverbe/jingle.mp3", suiteFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});