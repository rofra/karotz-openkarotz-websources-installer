include('util.js');

var hotmail = trim(params[instanceName].hotmail);
var pwd     = trim(params[instanceName].password);
var type    = trim(params[instanceName].type);
var maxi    = trim(params[instanceName].maxi);

var url = 'https://karotz.wizz.cc/_appz/hotmail/index.php?lang=fr&hotmail='+hotmail+'&pwd='+encodeURIComponent(pwd)+'&type='+type+'&maxi='+maxi;
var mp3 = 'http://www.wizz.cc/karotz/_mp3/hotmail.mp3';

var msg = ""; msg = http.get(url);

var d = new Date();
var hh = d.getHours(); var mm = d.getMinutes(); var dd = d.getDay();

var buttonListener = function(event) {
	if (event == 'SIMPLE') {
		setTimeout(300000, function(){ ping(); return true; });
		karotz.multimedia.stop(); karotz.tts.stop();
		pause(500); karotz.tts.start(msg, 'FR', evtTTS);
	}
    if (event == 'DOUBLE') {
		karotz.multimedia.stop(); karotz.tts.stop();
		pause(500); exit();
	}
	return true;
}

var earsListener = function(event, step, length) {
	if (event.indexOf('STOP') >= 0) {
		setTimeout(300000, function(){ ping(); return true; });
		karotz.multimedia.stop(); karotz.tts.stop();
		pause(500); karotz.tts.start(msg, 'FR', evtTTS);
	}
	return true;
}

var evtTTS = function(event) {
    if (event == 'TERMINATED') {
		setTimeout(5000, function(){ karotz.multimedia.stop(); exit(); });
	}
	return true;
}

var evtMM = function(event) {
    if ((event == 'CANCELLED') || (event == 'TERMINATED')) {
		karotz.multimedia.stop(); pause(500);
		karotz.tts.start(msg, 'FR', evtTTS);
	}
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);
	setTimeout(300000, function(){ ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	if (mp3 != '') karotz.multimedia.play(mp3, evtMM);
		else karotz.tts.start(msg, 'FR', evtTTS);
}

var karotz_ip = 'localhost';
var data = {};

if (msg) {
	karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);
} else exit();