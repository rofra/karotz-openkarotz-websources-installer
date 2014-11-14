include('util.js');

var d = new Date();
var h = d.getHours(); var m = d.getMinutes();

var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.tts.stop(); exit();
	}
}

var evtTTS = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.tts.stop(); exit();
	}
}

var evtMM = function(event) {
    if (event=='TERMINATED') {
		karotz.button.addListener(buttonListener);
		s = 'il est '+h+' heure'; if (m>0) s += ' et '+m+' minute';
		karotz.tts.start(s, 'FR', evtTTS);
	}
}

var onKarotzConnect = function(data) {
	karotz.led.fade('ff0000', 3000);
	karotz.multimedia.play('http://www.wizz.cc/karotz/_mp3/koukou1.mp3', evtMM);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);