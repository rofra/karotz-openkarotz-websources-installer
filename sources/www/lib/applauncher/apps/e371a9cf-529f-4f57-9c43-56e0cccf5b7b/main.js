include('util.js');

var max = trim(params[instanceName].max);

var url = 'http://karotz.wizz.cc/_appz/fdj/index.php?max='+max;
var mp3 = 'http://www.wizz.cc/karotz/_mp3/fdj.mp3';

var msg = ''; msg = http.get(url);

var d = new Date();
var hh = d.getHours(); var mm = d.getMinutes(); var dd = d.getDay();

var buttonListener = function(event) {
	if (event == 'SIMPLE') {
		karotz.tts.stop(); karotz.tts.start(msg, 'FR', evtTTS);
	}
    if (event == 'DOUBLE') {
		karotz.multimedia.stop(); karotz.tts.stop();
		pause(500); exit();
	}
	return true;
}

var evtTTS = function(event) {
    if ((event=='_CANCELLED') || (event=='TERMINATED')) {
		pause(500); exit();
	}
	return true;
}

var evtMM = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.multimedia.stop(); pause(500);
		karotz.tts.start(msg, 'FR', evtTTS);
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	setTimeout(300000, function(){ ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	if (mp3 != '') karotz.multimedia.play(mp3, evtMM);
		else karotz.tts.start(msg, 'FR', evtTTS);
}

var karotz_ip = 'localhost';
var data = {};

if (msg.length>0) {
	karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);
} else exit();