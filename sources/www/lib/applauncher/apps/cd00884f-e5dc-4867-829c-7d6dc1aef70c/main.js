include('util.js');

var tradio = new Array ([
	'-',
	'http://adwzg3.tdf-cdn.com/8474/nrj_177978.mp3', // 'http://mp3.live.tv-radio.com/rire_et_chansons/all/rir_124629.mp3',  // nok
	'http://adwzg3.tdf-cdn.com/8572/nrj_175797.mp3', // 'http://mp3.live.tv-radio.com/rire_100_sketches/all/rir_152805.mp3',
	'http://adwzg3.tdf-cdn.com/8573/nrj_177371.mp3', // 'http://mp3.live.tv-radio.com/rire_100_nouveaux_talents/all/rir_153424.mp3',
	'http://adwzg3.tdf-cdn.com/8648/nrj_166789.mp3', // COLLECTOR / ETERNELS ? ? 'http://mp3.live.tv-radio.com/rire_100_eternel/all/rir_151634.mp3',
	'http://adwzg3.tdf-cdn.com/8575/nrj_176026.mp3', // LIVE ? 'http://mp3.live.tv-radio.com/rire_100_live/all/rir_124257.mp3',
	'http://adwzg3.tdf-cdn.com/8645/nrj_172621.mp3', // CANULARS  /BLAGUES ? 'http://95.81.146.24/1U4hyDQEJyaVV_TiupIF-l4q8UmmBHqAG7-4=/8574/nrj_165638.mp3', // 'http://mp3.live.tv-radio.com/rire_100_blagues/all/rir_123949.mp3'
	], [
	'-', '', 'sketches', 'nouveaux talents', 'collector', 'live', 'canulars'
	]);

var indMax = 6;
var indice = parseInt(params[instanceName].radio);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..indMax

var url = tradio[0][indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.multimedia.stop();
		karotz.led.fade('FF0000', 3000);
		karotz.tts.start('Rire et chansons 100% '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
		bpause = false;	return true;
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
		karotz.multimedia.stop();
		if (event == 'START_RIGHT') indice = Math.floor((Math.random()*(indMax-1)))+1;
			else if (++indice > indMax) indice = 1;
		url = tradio[0][indice];
		karotz.led.fade('FF0000', 3000);
		karotz.tts.start('Rire et chansons 100% '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
		bpause = false;
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.tts.start('Rire et chansons 100% '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);
