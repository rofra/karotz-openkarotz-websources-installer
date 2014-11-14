include('util.js');

var tradio = new Array ([
	'-',
	'http://mp3.live.tv-radio.com/nostalgie/all/nos_113812.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_best_of_sixties/all/nos_174945.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_best_of_seventies/all/nos_175440.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_best_of_eighties/all/nos_172115.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_chansons_francaises/all/nos_174706.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_soul_legend/all/nos_173540.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_slow_legend/all/nos_173315.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_rock/all/nos_145822.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_disco/all/nos_172319.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_top_100/all/nos_180225.mp3',
	'http://mp3.live.tv-radio.com/nostalgie_abba/all/nos_170812.mp3',
	'http://mp3.live.tv-radio.com/2050/nostalgie_queen/nos_190147.mp3',
	'http://mp3.live.tv-radio.com/2524/nostalgie_poetes/nos_114501.mp3',
	'http://mp3.live.tv-radio.com/2522/nostalgie_funk/nos_114231.mp3',
	'http://mp3.live.tv-radio.com/2505/nostalgie_american_legend/nos_162228.mp3',
	'http://mp3.live.tv-radio.com/2526/nostalgie_british_legend/nos_114647.mp3',
	'http://mp3.live.tv-radio.com/2644/nostalgie_soleil/nos_112423.mp3',
	'http://mp3.live.tv-radio.com/2810/nostalgie_guitare_legends/nos_092523.mp3',
	'http://mp3.live.tv-radio.com/2927/nostalgie_musique_classique/nos_165841.mp3'
	], [
	'-', '', 'best of sixties', 'best of seventies', 'best of eighties', 'chansons françaises', 'soul', 'slow', 'rock',
	'disco', 'top 100', 'aba', 'queen', 'poètes', 'funk', 'american legend', 'british legend', 'soleil', 'guitar legends',
	'musique classique'
	]);

var indMax = 19;
var indice = parseInt(params[instanceName].radio);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..indMax

var url = tradio[0][indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.multimedia.stop();
		karotz.led.fade('FF0000', 3000);
		karotz.tts.start('Nostalgie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
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
		karotz.tts.start('Nostalgie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
		bpause = false;
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.tts.start('Nostalgie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);