include("util.js");

var lpad = function(orig, padString, length) {
    while (orig.length < length)
        orig = padString + orig;
    return orig;
}

rand = Math.floor(Math.random()*524);

var soundPath = "http://www.les2minutesdupeuple.fr/mp3/"+ lpad(""+rand, "0", 4) + ".mp3";

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

var pulseLed = function(event){
    if(event == "TERMINATED")
        karotz.led.pulse("0000FF", 500, 2000, pulseLed);
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.multimedia.play(soundPath, exitFunction);
    pulseLed("TERMINATED");
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
