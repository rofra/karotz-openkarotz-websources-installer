include("util.js");

var karotz_ip="localhost"
var phrase = params[instanceName].phrase
var langue = params[instanceName].langue
var audio = params[instanceName].audio

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
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
	if (audio != "aucun"){karotz.multimedia.play(audio, exitFunction);}
	else {karotz.tts.start(phrase,langue, exitFunction);}


}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
