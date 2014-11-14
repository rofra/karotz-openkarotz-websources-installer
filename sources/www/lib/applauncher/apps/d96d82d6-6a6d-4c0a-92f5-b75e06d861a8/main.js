include('util.js');

var tmp3 = [
'-',		// Ne pas enlever !
'http://www.la-libellule.fr/karotz/podcasts/1.mp3',
'http://www.la-libellule.fr/karotz/podcasts/2.mp3',
'http://www.la-libellule.fr/karotz/podcasts/3.mp3',
'http://www.la-libellule.fr/karotz/podcasts/4.mp3',
'http://www.la-libellule.fr/karotz/podcasts/5.mp3',
'http://www.la-libellule.fr/karotz/podcasts/6.mp3',
'http://www.la-libellule.fr/karotz/podcasts/7.mp3',
'http://www.la-libellule.fr/karotz/podcasts/8.mp3',
'http://www.la-libellule.fr/karotz/podcasts/9.mp3',
'http://www.la-libellule.fr/karotz/podcasts/10.mp3',
'http://www.la-libellule.fr/karotz/podcasts/11.mp3'		// pas de , après le dernier de la liste
];
	
var indMax = 11;		// Nb de podcasts
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