// http://wizz.cc
//
include('util.js');

var tmp3 = [
'-',		// Ne pas enlever !
'http://internet-des-objets.info/karotz/rappels_2/1.mp3',
'http://internet-des-objets.info/karotz/rappels_2/2.mp3',
'http://internet-des-objets.info/karotz/rappels_2/3.mp3',
'http://internet-des-objets.info/karotz/rappels_2/4.mp3',
'http://internet-des-objets.info/karotz/rappels_2/5.mp3',
'http://internet-des-objets.info/karotz/rappels_2/6.mp3',
'http://internet-des-objets.info/karotz/rappels_2/7.mp3',
'http://internet-des-objets.info/karotz/rappels_2/8.mp3',
'http://internet-des-objets.info/karotz/rappels_2/9.mp3'
	// pas de , après le dernier de la liste
];

var rappel = trim(params[instanceName].rappel);
if ((indice==0) && (rappel.length==0)) exit();

var indice = parseInt(params[instanceName].mp3);

var url = tmp3[indice];

var buttonListener = function(event) {
    if (event == 'DOUBLE') {
		karotz.tts.stop(); karotz.multimedia.stop(); pause(500); exit();
	}
	return true;
}

var evtTTS = function(event) {
    if ((event == 'CANCELLED') || (event == 'TERMINATED')) {
		karotz.tts.stop(); pause(2000); exit();
	}
	return true;
}

var evtMM = function(event) {
    if ((event == 'CANCELLED') || (event == 'TERMINATED')) {
		karotz.multimedia.stop(); pause(2000); exit();
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.led.fade('FF0000',1500);

	if (rappel.length==0) karotz.multimedia.play(url, evtMM);
		else karotz.tts.start(rappel, 'FR', evtTTS);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);