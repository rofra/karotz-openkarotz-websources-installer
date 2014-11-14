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
	// http://radiovitamine.ice.infomaniak.ch:80/radiovitamine-128.mp3
	karotz.multimedia.play('http://radiovitamine.ice.infomaniak.ch/playlists/radiovitamine-128.mp3.m3u');
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);