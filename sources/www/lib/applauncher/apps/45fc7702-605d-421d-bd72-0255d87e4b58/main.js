include('util.js');

var tconte = [
'-',
'http://www.archive.org/download/L-escargot-et-le-rosier/L-escargot-et-le-rosier_64kb.m3u',
'http://www.archive.org/download/La-bergere-et-le-ramoneur/La-bergere-et-le-ramoneur_64kb.m3u',
'http://www.archive.org/download/LaPetiteFilleAuxAllumettes/LaPetiteFilleAuxAllumettes_64kb.m3u',
'http://www.archive.org/download/LaPquerette/LaPquerette_vbr.m3u',
'http://www.archive.org/download/Le-Papillon/Le-Papillon_64kb.m3u',
'http://www.archive.org/download/Le-Vilain-Petit-Canard/Le-Vilain-Petit-Canard_64kb.m3u',
'http://www.archive.org/download/LeBonhommeDeNeige/LeBonhommeDeNeige_64kb.m3u',
'http://www.archive.org/download/LeJardinDuParadis/LeJardinDuParadis_vbr.m3u',
'http://www.archive.org/download/LeSapin/LeSapin_vbr.m3u',
'http://www.archive.org/download/LesCygnesSauvages/LesCygnesSauvages_vbr.m3u',
'http://www.archive.org/download/LesAventuresDuChardon/LesAventuresDunChardon.mp3',
'http://www.archive.org/download/LeBriquet/LeBriquet.mp3',
'http://www.archive.org/download/lAnge_732/lange.mp3',
'http://www.archive.org/download/BonneHumeur/BonneHumeur.mp3',
'http://www.archive.org/download/LaPetiteSirene/Andersen_-_La_Petite_Sirene.mp3',
'http://www.archive.org/download/UneSemaineAvecOleFermeLoeil/Ole_ferme_Loeil_Andersen.mp3',
'http://www.archive.org/download/Andersen-LintrepideSoldatDePlomb/Andersen-LintrpideSoldatDePlomb.mp3',
'http://www.archive.org/download/LeBisaieul/le-bisaieul.mp3',
'http://www.archive.org/download/AndersenPrincesse/livre-audio-Andersen-la-princesse-au-petits-pois-audiocite.mp3',
'http://www.archive.org/download/LeBonheurDuJour/LeBonheurDuJour.mp3'
];
	
var indMax = 20;
var indice = parseInt(params[instanceName].conte);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..10
var fquit = parseInt(params[instanceName].fquit);

var url = tconte[indice];
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
		url = tconte[indice];
		karotz.led.fade('FF0000', 3000);
		karotz.multimedia.play(url, evtMM); bpause = false;
	}
	return true;
}

var evtMM = function(event) {
    if (((event == 'CANCELLED') || (event == 'TERMINATED')) && !bpause) {
		if (!fquit) {
			if (++indice > indMax) indice = 1;
			url = tconte[indice]; karotz.multimedia.play(url, evtMM);
		} else { karotz.multimedia.stop(); pause(3000); exit(); }
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