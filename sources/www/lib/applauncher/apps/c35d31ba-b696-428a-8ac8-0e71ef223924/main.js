include('util.js');

var trecette = [
'-',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-A/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-A-Agneau.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-A/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-A-Alouette.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-A/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-A-Ane.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-A/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-A-Artichauts.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-A/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-A-Asperges-a-la-Pompadour.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-Baba.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-Bartavelle.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-beignets.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-beurre.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-blanc-manger.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-Boeuf.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-Brandade.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-Brioche.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cabillaud.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cacao.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cafe.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cafe-a-la-creme-frappe-de-glace.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cake.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Canepetiete.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cannetons-a-la-rouennaise.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Careme.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Carreme-Marie-Antoine.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Carpe-a-la-Chambord.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cavaillon.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cave.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cerise.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Champignons.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Chartreuse.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Chocolat.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-C/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-C-Cidre.mp3',
'http://www.archive.org/download/Mon-dictionnaire-de-cuisine-B/Alexandre-Dumas-Mon-Dictionnaire-de-cuisine-Lettre-B-salmis-de-becasses-a-la-royale.mp3'
];
	
var indMax = 31;
var indice = parseInt(params[instanceName].recette);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..31

var url = trecette[indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.led.fade('FF0000', 3000);
		karotz.multimedia.play(url, evtMM); bpause = false;
		return true;
	}
	if (event == 'SIMPLE') {
		if (!bpause) {
			bpause = true; karotz.led.pulse('0000FF', 3500, -1);
        	karotz.multimedia.pause();
		}	else {
			karotz.led.fade('FF0000', 3000);
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
		url = trecette[indice];
		karotz.led.fade('FF0000', 3000);
		karotz.multimedia.play(url, evtMM); bpause = false;
	}
	return true;
}

var evtMM = function(event) {
    if (((event == 'CANCELLED') || (event == 'TERMINATED')) && !bpause) {
		if (++indice > indMax) indice = 1;
		url = trecette[indice]; karotz.multimedia.play(url, evtMM);
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.multimedia.play(url, evtMM);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);