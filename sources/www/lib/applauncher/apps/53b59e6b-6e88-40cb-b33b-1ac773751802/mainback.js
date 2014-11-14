include('util.js');
// Par Bixy @ Karotz.emulcentral.com
// Appz Radio X
var str_Startup="Je lance la webradio, Radio X !";
var str_bpause1="Je met en pause la webradio, Radio X !";
var str_bpause2="Reprise de la webradio, Radio X !";
var tts_language="fr";

var bpause = false;

var buttonListener = function(event) {
	if (event == 'SIMPLE') {
		if (!bpause) {
			bpause = true; karotz.led.pulse('0000FF', 3500, -1);
        	karotz.multimedia.pause();
			karotz.tts.start(str_bpause1,tts_language);
		}	else {
			karotz.tts.start(str_bpause2,tts_language);
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
	karotz.tts.start(str_Startup,tts_language);
	setTimeout(300000, function(){ log('ping'); ping(); return true; });
 	karotz.led.fade('FF0000', 3000);
	karotz.multimedia.play('http://67.212.85.90/choi.mp3');
}

var karotz_ip = '192.168.1.107';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);