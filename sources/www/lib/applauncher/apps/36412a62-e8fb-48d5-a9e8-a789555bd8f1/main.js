// http://wizz.cc
//
include('util.js');

var tmp3 = [
'-',		// Ne pas enlever !
'http://www.la-libellule.fr/karotz/noel/1.mp3',
'http://www.la-libellule.fr/karotz/noel/2.mp3',
'http://www.la-libellule.fr/karotz/noel/3.mp3',
'http://www.la-libellule.fr/karotz/noel/4.mp3',
'http://www.la-libellule.fr/karotz/noel/5.mp3',
'http://www.la-libellule.fr/karotz/noel/6.mp3',
'http://www.la-libellule.fr/karotz/noel/7.mp3',
'http://www.la-libellule.fr/karotz/noel/8.mp3',
'http://www.la-libellule.fr/karotz/noel/9.mp3',
'http://www.la-libellule.fr/karotz/noel/10.mp3',
'http://www.la-libellule.fr/karotz/noel/11.mp3',
'http://www.la-libellule.fr/karotz/noel/12.mp3',
'http://www.la-libellule.fr/karotz/noel/13.mp3',
'http://www.la-libellule.fr/karotz/noel/14.mp3',
'http://www.la-libellule.fr/karotz/noel/15.mp3',
'http://www.la-libellule.fr/karotz/noel/16.mp3',
'http://www.la-libellule.fr/karotz/noel/17.mp3',
'http://www.la-libellule.fr/karotz/noel/18.mp3',
'http://www.la-libellule.fr/karotz/noel/19.mp3',
'http://www.la-libellule.fr/karotz/noel/20.mp3',
'http://www.la-libellule.fr/karotz/noel/21.mp3',
'http://www.la-libellule.fr/karotz/noel/22.mp3',
'http://www.la-libellule.fr/karotz/noel/23.mp3',
'http://www.la-libellule.fr/karotz/noel/24.mp3',
'http://www.la-libellule.fr/karotz/noel/25.mp3',
'http://www.la-libellule.fr/karotz/noel/26.mp3',
'http://www.la-libellule.fr/karotz/noel/27.mp3',
'http://www.la-libellule.fr/karotz/noel/28.mp3',
'http://www.la-libellule.fr/karotz/noel/29.mp3',
'http://www.la-libellule.fr/karotz/noel/30.mp3',
'http://www.la-libellule.fr/karotz/noel/31.mp3',
'http://www.la-libellule.fr/karotz/noel/32.mp3',
'http://www.la-libellule.fr/karotz/noel/33.mp3',
'http://www.la-libellule.fr/karotz/noel/34.mp3',
'http://www.la-libellule.fr/karotz/noel/35.mp3',
'http://www.la-libellule.fr/karotz/noel/36.mp3',
'http://www.la-libellule.fr/karotz/noel/37.mp3',
'http://www.la-libellule.fr/karotz/noel/38.mp3',
'http://www.la-libellule.fr/karotz/noel/39.mp3',
'http://www.la-libellule.fr/karotz/noel/40.mp3'		// pas de , après le dernier de la liste
];
	
var indMax = 40;		// Nb de contes
var indice = parseInt(params[instanceName].mp3);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..n

var fquit = parseInt(params[instanceName].fquit);

var url = tmp3[indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.led.fade('FF0000', 3000);
		karotz.multimedia.play(url, evtMM); bpause = false;
		return true;
	}
	if (event == 'SIMPLE') {
		if (!bpause) {
			bpause = true; karotz.led.pulse('00FF00', 3500, -1);
        	karotz.multimedia.pause();
		}	else {
			karotz.led.fade('0000FF', 3000);
        	karotz.multimedia.resume(); bpause = false;
		}
	}
    if (event == 'DOUBLE') {
		karotz.multimedia.stop(); pause(500); exit();
	}
	return true;
}

var earsListener = function(event, step, length) {
	if (event.indexOf('START') >= 0) {
		if (event == 'START_RIGHT') indice = Math.floor((Math.random()*(indMax-1)))+1;
			else if (++indice > indMax) indice = 1;
		url = tmp3[indice];
		karotz.led.fade('FF00FF', 3000);
		karotz.multimedia.play(url, evtMM); bpause = false;
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
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.light('00FF00');
	karotz.led.pulse('FF0000', 4000, -1);
	karotz.multimedia.play(url, evtMM);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);