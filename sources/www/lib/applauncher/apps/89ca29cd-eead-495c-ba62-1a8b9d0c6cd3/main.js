include('util.js');

var song = params[instanceName].song;
var mp3  = trim(params[instanceName].mp3);
var url = '';
if (song != '_none_') {
	if (song == '_mp3_') {
		url = mp3;
	} else {
		if (song != '') song = '_' + song;
		url  = 'http://www.wizz.cc/karotz/_mp3/k'+song+'.mp3';
	}
}

var d = new Date();
var hh = d.getHours(); var mm = d.getMinutes(); var dd = d.getDay();
var s = '';

var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop(); karotz.tts.stop(); pause(500); exit();
	}
}

var evtTTS = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.tts.stop(); pause(500); exit();
	}
}

var evtMM = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.multimedia.stop(); pause(500);
		karotz.tts.start(mytts(s), 'FR', evtTTS);
	}
}

function mytts(s) {
	s = 'Il est ';
	switch(hh) {
		case  0 : s += 'minuit'; break;
		case 12 : s += 'midi'; break;
		default : s += hh+' heure';
	}
	if (mm>0) s += ' et '+mm+' minute';
	s += '.';
	return s;
}

var onKarotzConnect = function(data) {
	karotz.led.fade('ff0000', 3000);
	karotz.button.addListener(buttonListener);
	if (url != '') karotz.multimedia.play(url, evtMM);
	 else karotz.tts.start(mytts(s), 'FR', evtTTS);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);