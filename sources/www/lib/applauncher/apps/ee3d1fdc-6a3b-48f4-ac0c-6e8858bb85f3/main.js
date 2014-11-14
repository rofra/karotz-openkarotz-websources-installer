include("util.js");

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
	
	var data = http.get("http://geekattitu.de/karotz/karotz.php");
	karotz.tts.start(data, "fr", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
