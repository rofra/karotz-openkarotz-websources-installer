include("util.js");

var soundPath = "http://d8fbtc1n79uhh.cloudfront.net/conte/conte-noel-la-nuit-avant-noel.mp3";

var karotz_ip="localhost"

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
    karotz.multimedia.play(soundPath, exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
