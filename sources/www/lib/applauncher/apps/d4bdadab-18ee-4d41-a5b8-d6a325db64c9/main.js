include('util.js');

var tmp3 = [
'-',		// Ne pas enlever !
'http://www.la-libellule.fr/karotz/belges/1.mp3',
'http://www.la-libellule.fr/karotz/belges/2.mp3',
'http://www.la-libellule.fr/karotz/belges/3.mp3',
'http://www.la-libellule.fr/karotz/belges/4.mp3',
'http://www.la-libellule.fr/karotz/belges/5.mp3',
'http://www.la-libellule.fr/karotz/belges/6.mp3',
'http://www.la-libellule.fr/karotz/belges/7.mp3',
'http://www.la-libellule.fr/karotz/belges/8.mp3',
'http://www.la-libellule.fr/karotz/belges/9.mp3',
'http://www.la-libellule.fr/karotz/belges/10.mp3',
'http://www.la-libellule.fr/karotz/belges/11.mp3',
'http://www.la-libellule.fr/karotz/belges/12.mp3',
'http://www.la-libellule.fr/karotz/belges/13.mp3',
'http://www.la-libellule.fr/karotz/belges/14.mp3',
'http://www.la-libellule.fr/karotz/belges/15.mp3',
'http://www.la-libellule.fr/karotz/belges/16.mp3',
'http://www.la-libellule.fr/karotz/belges/17.mp3',
'http://www.la-libellule.fr/karotz/belges/18.mp3',
'http://www.la-libellule.fr/karotz/belges/19.mp3'		// pas de , après le dernier de la liste
];
	
var indMax = 19;		// Nb histoires
var indice = parseInt(params[instanceName].mp3);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..n

var fquit = parseInt(params[instanceName].fquit);

var url = tmp3[indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.led.fade('FF0000', 2000);
		karotz.multimedia.play(url, evtMM); bpause = false;
		return true;
	}
	if (event == 'SIMPLE') {
		if (!bpause) {
			bpause = true; karotz.led.pulse('00FF00', 1000, -1);
        	karotz.multimedia.pause();
		}	else {
			karotz.led.fade('0000FF', 2000);
        	karotz.multimedia.resume(); bpause = false;
		}
	}
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

	karotz.led.fade('FF00FF', 2000);
	karotz.multimedia.play(url, evtMM);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);