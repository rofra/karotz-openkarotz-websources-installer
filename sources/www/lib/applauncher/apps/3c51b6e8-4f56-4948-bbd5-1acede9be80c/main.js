include('util.js');

var bpause = false;

var buttonListener = function(event) {
	if (event == "SIMPLE") {
		if (!bpause) {
			karotz.led.pulse('0000FF', 3500, -1);
        	karotz.multimedia.pause(); bpause = true;
		}	else {
			karotz.led.fade('FF0000', 3000);
        	karotz.multimedia.resume(); bpause = false;
		}
	}
    if (event == "DOUBLE") {
		karotz.multimedia.stop(); pause(500); exit();
	}
	return true;
}

var evtMM = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
		// karotz.multimedia.stop(); pause(500); exit();
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	// karotz.led.light('000000'); karotz.led.pulse('FF0000', 2500, -1);
	karotz.multimedia.play('http://broadcast.infomaniak.net:80/start-adofm-high.mp3');
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);