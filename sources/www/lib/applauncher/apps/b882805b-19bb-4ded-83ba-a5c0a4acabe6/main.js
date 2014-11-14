include("util.js");
include("tts2.js");

var karotz_ip="localhost";

var buttonListener = function(event) {
    if (event == "DOUBLE") {
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
	var voix=params[instanceName].voix;
	karotz.button.addListener(buttonListener);
	var data = http.get("http://karotz.sylvainmenu.com/fetedujour/index.php");
	if(voix=="Defaut"){
		karotz.tts.start(data, "fr", exitFunction);}
	else{
		karotz.tts2.start(data, voix, exitFunction);
	}
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
