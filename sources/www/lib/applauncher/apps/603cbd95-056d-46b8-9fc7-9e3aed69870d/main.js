include("util.js");

var karotz_ip="localhost";
date = new Date();
var heure;
var minutes;
var idpuce;

var rfid = function(data) {
	idpuce = data.id;
}

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
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
	karotz.rfid.addListener(rfid);
	heure = date.getHours();
	minutes = date.getMinutes();
    karotz.tts.start("Il est "+heure+" heure et "+minutes+" minutes", "fr", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
