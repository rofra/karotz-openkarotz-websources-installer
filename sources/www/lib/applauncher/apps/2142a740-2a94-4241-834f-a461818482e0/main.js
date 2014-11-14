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
	var data = http.get("http://veloce.pixelsdev.fr/Kmail/getmail.php?c="+params[instanceName].id+"&uniqid="+params[instanceName].uniqid);
	karotz.tts.start(data, "fr", exitFunction);
	
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
