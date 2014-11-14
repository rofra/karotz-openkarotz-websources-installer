include("util.js");

var karotz_ip="localhost"
var mac=params[instanceName].mac;
var ip=params[instanceName].ip;



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
	
    var data = http.post("http://wakeonwan.webou.net/wakeup.php?ip="+ip+"&mac="+mac+"++",{})
	karotz.tts.start("J'ai allumé ton ordinateur !", "fr",exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
