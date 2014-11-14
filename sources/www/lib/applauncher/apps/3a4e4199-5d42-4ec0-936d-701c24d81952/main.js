// http://wizz.cc
//
include('util.js');

var tmp3 = [
'-',		// Ne pas enlever !
'http://internet-des-objets.info/karotz/carte/1.mp3',
'http://internet-des-objets.info/karotz/carte/2.mp3',
'http://internet-des-objets.info/karotz/carte/3.mp3',
'http://internet-des-objets.info/karotz/carte/4.mp3',
'http://internet-des-objets.info/karotz/carte/5.mp3',
'http://internet-des-objets.info/karotz/carte/6.mp3',
'http://internet-des-objets.info/karotz/carte/7.mp3',
'http://internet-des-objets.info/karotz/carte/8.mp3',
'http://internet-des-objets.info/karotz/carte/9.mp3',
'http://internet-des-objets.info/karotz/carte/10.mp3',
'http://internet-des-objets.info/karotz/carte/11.mp3',
'http://internet-des-objets.info/karotz/carte/12.mp3'		// pas de , après le dernier de la liste
];
	
var indMax = 12;		// Nb de mp3
var indice = parseInt(params[instanceName].mp3);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..n

var fquit = parseInt(params[instanceName].fquit);

var url = tmp3[indice];
var bpause = false;

var buttonListener = function(event) {
    if (event == 'DOUBLE') {
		karotz.multimedia.stop(); pause(500); exit();
	}
	return true;
}

var evtMM = function(event) {
    if (((event == 'CANCELLED') || (event == 'TERMINATED')) && !bpause) {
		if (!fquit) {
			if (++indice > indMax) indice = 1;
			url = tmp3[indice]; karotz.multimedia.play(url, evtMM);
		} else { karotz.multimedia.stop(); pause(3000); exit(); }
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF00FF', 1500);
	karotz.multimedia.play(url, evtMM);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);