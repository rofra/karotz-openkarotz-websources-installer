include('util.js');

var bpause = false;

var buttonListener = function(event) {
	if (event == 'SIMPLE') {
		if (!bpause) {
			bpause = true; karotz.led.pulse('0000FF', 3500, -1);
        	karotz.multimedia.pause();
		}	else {
			karotz.led.fade('FF0000', 3000);
        	karotz.multimedia.resume(); bpause = false;
		}
	}
    if (event == 'DOUBLE') {
		karotz.multimedia.stop(); pause(500); exit();
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	// http://217.160.236.114/big.mp3
	karotz.multimedia.play('http://www.radiomeuh.com/site/ecouter/onea_meuh.pls');
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);