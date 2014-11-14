include('util.js');

var tradio = new Array ([
	'-',
	'http://mp3.live.tv-radio.com/cherie_fm/all/che_124310.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_zen/all/che_122753.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_golds/all/che_123506.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_love_song/all/che_140854.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_frenchy/all/che_123008.mp3',
	'http://mp3.live.tv-radio.com/2048/cherie_fm_crooners/che_190007.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_cinema/all/che_144540.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_100_sade/all/che_121553.mp3',
	'http://mp3.live.tv-radio.com/2047/cherie_fm_dolce_vita/che_185747.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_duos/all/che_145639.mp3',
	'http://mp3.live.tv-radio.com/cherie_fm_pop_soul/all/che_141749.mp3',
	'http://mp3.live.tv-radio.com/2342/cherie_fm_james_blunt/che_153212.mp3',
	'http://mp3.live.tv-radio.com/2470/cherie_fm_spa/che_182321.mp3',
	'http://mp3.live.tv-radio.com/2488/cherie_fm_afterwork/che_162832.mp3',
	'http://mp3.live.tv-radio.com/2485/cherie_fm_pop/che_162631.mp3',
	'http://mp3.live.tv-radio.com/2596/cherie_ete/che_094941.mp3',
	'http://mp3.live.tv-radio.com/2605/cherie_90/che_111353.mp3',
	'http://mp3.live.tv-radio.com/2599/cherie_latino/che_104348.mp3',
	'http://mp3.live.tv-radio.com/2603/cherie_80/che_105645.mp3',
	'http://mp3.live.tv-radio.com/2609/cherie_fashion/che_115954.mp3',
	'http://mp3.live.tv-radio.com/2607/cherie_jazzy/che_114021.mp3',
	'http://mp3.live.tv-radio.com/2601/cherie_fitness/che_105007.mp3',
	'http://mp3.live.tv-radio.com/2784/cherie_fm_coffee_house/che_095925.mp3',
	'http://mp3.live.tv-radio.com/2611/cherie_in_store/che_120728.mp3'
	], [
	'-', 'f m', 'zen', 'golds', 'love songs', 'frenchy', 'séducteurs', 'cinéma', 'sade', 'dolce vita', 'duos',
	'at work', 'james blunt', 'spa', 'after work', 'pop', 'été', 'années 90', 'latino', 'années 80', 'fashion',
	'jazzy', 'fitness', 'coffee house', 'in store'
	]);

var indMax = 24;
var indice = parseInt(params[instanceName].radio);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..indMax

var url = tradio[0][indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.multimedia.stop();
		karotz.led.fade('FF0000', 3000);
		karotz.tts.start('Chérie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
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
		karotz.tts.start('Chérie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
		bpause = false;
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.tts.start('Chérie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);