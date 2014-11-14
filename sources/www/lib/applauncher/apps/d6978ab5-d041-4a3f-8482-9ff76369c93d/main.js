include("util.js");
var karotz_ip="localhost"
//var karotz_ip="192.168.1.23"
var onKarotzConect;
var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
     setTimeout(5000, onKarotzConnect);
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.tts.start("", "fr", exitFunction);
	karotz.webcam.photo("http://ec2-46-137-139-20.eu-west-1.compute.amazonaws.com/karotz.php?email="+params[instanceName].email);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
