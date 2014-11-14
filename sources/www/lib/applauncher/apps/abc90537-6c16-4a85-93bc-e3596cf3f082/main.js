include('util.js');

var tradio = new Array ([
	'-',
	'http://mp3.live.tv-radio.com/nrj/all/nrj_113225.mp3',
	'http://mp3.live.tv-radio.com/nrj_hits/all/nrj_150726.mp3',
	'http://mp3.live.tv-radio.com/nrj_nouveaute/all/nrj_161209.mp3',
	'http://mp3.live.tv-radio.com/nrj_french/all/nrj_155913.mp3',
	'http://mp3.live.tv-radio.com/nrj_rock/all/nrj_161510.mp3',
	'http://mp3.live.tv-radio.com/nrj_rnb/all/nrj_151038.mp3',
	'http://mp3.live.tv-radio.com/nrj_dance/all/nrj_151505.mp3',
	'http://mp3.live.tv-radio.com/nrj_clubbin/all/nrj_153250.mp3',
	'http://mp3.live.tv-radio.com/nrj_lounge/all/nrj_151750.mp3',
	'http://mp3.live.tv-radio.com/nrj_pop/all/nrj_151240.mp3',
	'http://mp3.live.tv-radio.com/nrj_by_disney/all/nrj_152411.mp3',
	'http://mp3.live.tv-radio.com/nrj_itunes/all/nrj_153938.mp3',
	'http://mp3.live.tv-radio.com/2630/nrj_jennifer_lopez/nrj_130658.mp3',
	'http://mp3.live.tv-radio.com/nrj_girl/all/nrj_153716.mp3',
	'http://mp3.live.tv-radio.com/nrj_lady_gaga/all/nrj_152704.mp3',
	'http://mp3.live.tv-radio.com/nrj_running/all/nrj_162813.mp3',
	'http://mp3.live.tv-radio.com/nrj_mastermix/all/nrj_163522.mp3',
	'http://mp3.live.tv-radio.com/nrj_rihanna/all/nrj_163955.mp3',
	'http://mp3.live.tv-radio.com/nrj_ibiza/all/nrj_164849.mp3',
	'http://mp3.live.tv-radio.com/nrj_michael_jackson/all/nrj_154634.mp3',
	'http://mp3.live.tv-radio.com/nrj_black_eyed_peas/all/nrj_161845.mp3',
	'http://mp3.live.tv-radio.com/nrj_in_bed/all/nrj_135650.mp3',
	'http://mp3.live.tv-radio.com/nrj_new-york/all/nrj_140527.mp3',
	'http://mp3.live.tv-radio.com/nrj_at_work/all/nrj_143400.mp3',
	'http://mp3.live.tv-radio.com/nrj_shakira/all/nrj_144619.mp3',
	'http://mp3.live.tv-radio.com/nrj_rap_us/all/nrj_144854.mp3',
	'http://mp3.live.tv-radio.com/nrj_rap_fr/all/nrj_145338.mp3',
	'http://mp3.live.tv-radio.com/2051/nrj_party/nrj_190407.mp3',
	'http://mp3.live.tv-radio.com/nrj_shop/all/nrj_121822.mp3',
	'http://mp3.live.tv-radio.com/nrj_next/all/nrj_122336.mp3',
	'http://mp3.live.tv-radio.com/2336/nrj_britney_spears/nrj_142413.mp3',
	'http://mp3.live.tv-radio.com/2500/nrj_saint_tropez/nrj_114322.mp3',
	'http://mp3.live.tv-radio.com/2493/nrj_miami/nrj_112825.mp3',
	'http://mp3.live.tv-radio.com/2495/nrj_trance/nrj_113417.mp3',
	'http://mp3.live.tv-radio.com/2499/nrj_reggae/nrj_114036.mp3',
	'http://mp3.live.tv-radio.com/2501/nrj_latino/nrj_110354.mp3',
	'http://mp3.live.tv-radio.com/nrj_soleil/all/nrj_155103.mp3',
	'http://mp3.live.tv-radio.com/2497/nrj_big_5/nrj_113725.mp3',
	'http://mp3.live.tv-radio.com/nrj_friendly/all/nrj_164207.mp3',
	'http://mp3.live.tv-radio.com/2613/nrj_metal/nrj_122842.mp3',
	'http://mp3.live.tv-radio.com/2634/nrj_college/nrj_133225.mp3',
	'http://mp3.live.tv-radio.com/2619/nrj_zouk/nrj_125115.mp3',
	'http://mp3.live.tv-radio.com/2617/nrj_electro/nrj_124856.mp3',
	'http://mp3.live.tv-radio.com/2625/nrj_hot/nrj_130247.mp3',
	'http://mp3.live.tv-radio.com/2615/nrj_love/nrj_124711.mp3',
	'http://mp3.live.tv-radio.com/2788/nrj_spa/nrj_174339.mp3',
	'http://mp3.live.tv-radio.com/2622/nrj_fashion/nrj_125933.mp3',
	'http://mp3.live.tv-radio.com/2628/nrj_fitness/nrj_130511.mp3',
	'http://mp3.live.tv-radio.com/2623/nrj_c_cauet/nrj_130118.mp3',
	'http://mp3.live.tv-radio.com/2775/nrj_urban/nrj_095438.mp3',
	'http://mp3.live.tv-radio.com/2773/nrj_coffee_house/nrj_095218.mp3'
	], [
	'-', '', 'hits', 'nouveautais', 'french', 'rock', 'air haine bi', 'danse', 'club ine', 'lounge', 'pop', 'disney chanel',
	'i tunes', 'jennifer lopez', 'girls', 'lady gaga', 'running', 'extravadance', 'rihanna', 'ibiza', 'jackson', 'black eyed peas',
	'in bed', 'new-york', 'at work', 'shakira', 'rap usa', 'rap france', 'party hits', 'in store', 'next', 'britney spears',
	'saint-tropez', 'miami', 'trance', 'reggae', 'latino', 'summer', 'big five', 'gay', 'metal', 'collaige', 'zouk', 'electro', 'hot',
	'love', 'spa', 'fashion', 'fitness', 'cauet', 'urban', 'coffee house'
	]);

var indMax = 51;
var indice = parseInt(params[instanceName].radio);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..indMax

var url = tradio[0][indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.multimedia.stop();
		karotz.led.fade('FF0000', 3000);
		karotz.tts.start('Energie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
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
		karotz.tts.start('Energie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
		bpause = false;
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.tts.start('Energie '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);