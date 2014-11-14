include('util.js');

var tconte = [
'-',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_00.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_01.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_02.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_03.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_04.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_05.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_06.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_07.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_08.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_09.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_10.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_11.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_12.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_13.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_14.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_15.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_16.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_17.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_18.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_19.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_20.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_21.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_22.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_23.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_24.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_25.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_26.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_27.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_28.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_29.mp3',
'http://www.archive.org/download/LettresDeMonMoulinversion2/Daudet_-_Lettres_de_mon_moulin_30.mp3'
];
	
var indMax = 31;
var indice = parseInt(params[instanceName].conte);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..31

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
		if (++indice > indMax) indice = 1;
		url = tconte[indice]; karotz.multimedia.play(url, evtMM);
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