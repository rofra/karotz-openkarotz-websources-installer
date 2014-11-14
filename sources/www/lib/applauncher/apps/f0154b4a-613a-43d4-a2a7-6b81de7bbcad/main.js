include('util.js');

var tradio = new Array ([
	'-',
	'http://mp3.live.tv-radio.com/fbalsace/all/fbalsace.mp3',
	'http://mp3.live.tv-radio.com/fbarmorique/all/fbarmorique.mp3',
	'http://mp3.live.tv-radio.com/fbauxerre/all/fbauxerre.mp3',
	'http://mp3.live.tv-radio.com/fbazur/all/fbazur.mp3',
	'http://mp3.live.tv-radio.com/fbbassenormandie/all/fbbassenormandie.mp3',
	'http://mp3.live.tv-radio.com/fbbearn/all/fbbearn.mp3',
	'http://mp3.live.tv-radio.com/fbbelfort/all/fbbelfort.mp3',
	'http://mp3.live.tv-radio.com/fbberry/all/fbberry.mp3',
	'http://mp3.live.tv-radio.com/fbbesancon/all/fbbesancon.mp3',
	'http://mp3.live.tv-radio.com/fbbourgogne/all/fbbourgogne.mp3',
	'http://mp3.live.tv-radio.com/fbbreizizel/all/fbbreizizel.mp3',
	'http://mp3.live.tv-radio.com/fbchampagne/all/fbchampagne.mp3',
	'http://mp3.live.tv-radio.com/fbcotentin/all/fbcotentin.mp3',
	'http://mp3.live.tv-radio.com/fbcreuse/all/fbcreuse.mp3',
	'http://mp3.live.tv-radio.com/fbdromeardeche/all/fbdromeardeche.mp3',
	'http://mp3.live.tv-radio.com/fbfrequenzamora/all/fbfrequenzamora.mp3',
	'http://mp3.live.tv-radio.com/fbgardlozere/all/fbgardlozere.mp3',
	'http://mp3.live.tv-radio.com/fbgascogne/all/fbgascogne.mp3',
	'http://mp3.live.tv-radio.com/fbgironde/all/fbgironde.mp3',
	'http://mp3.live.tv-radio.com/fbhautenormandie/all/fbhautenormandie.mp3',
	'http://mp3.live.tv-radio.com/fbherault/all/fbherault.mp3',
	'http://mp3.live.tv-radio.com/fbidf/all/fbidfhautdebit.mp3',
	'http://mp3.live.tv-radio.com/fbisere/all/fbisere.mp3',
	'http://mp3.live.tv-radio.com/fblarochelle/all/fblarochelle.mp3',
	'http://mp3.live.tv-radio.com/fblimousin/all/fblimousin.mp3',
	'http://mp3.live.tv-radio.com/fbloireocean/all/fbloireocean.mp3',
	'http://mp3.live.tv-radio.com/fblorrainenord/all/fblorrainenord.mp3',
	'http://mp3.live.tv-radio.com/fbmaine/all/fbmaine.mp3',
	'http://mp3.live.tv-radio.com/fbmayenne/all/fbmayenne.mp3',
	'http://mp3.live.tv-radio.com/fbnord/all/fbnord.mp3',
	'http://mp3.live.tv-radio.com/fborleans/all/fborleans.mp3',
	'http://mp3.live.tv-radio.com/fbpaysbasque/all/fbpaysbasque.mp3',
	'http://mp3.live.tv-radio.com/fbpaysdauvergne/all/fbpaysdauvergne.mp3',
	'http://mp3.live.tv-radio.com/fbpaysdesavoie/all/fbpaysdesavoie.mp3',
	'http://mp3.live.tv-radio.com/fbperigord/all/fbperigord.mp3',
	'http://mp3.live.tv-radio.com/fbpicardie/all/fbpicardie.mp3',
	'http://mp3.live.tv-radio.com/fbpoitou/all/fbpoitou.mp3',
	'http://mp3.live.tv-radio.com/fbprovence/all/fbprovence.mp3',
	'http://mp3.live.tv-radio.com/fbroussillon/all/fbroussillon.mp3',
	'http://mp3.live.tv-radio.com/fbsudlorraine/all/fbsudlorraine.mp3',
	'http://mp3.live.tv-radio.com/fbtoulouse/all/fbtoulouse.mp3',
	'http://mp3.live.tv-radio.com/fbtouraine/all/fbtouraine.mp3',
	'http://mp3.live.tv-radio.com/fbvaucluse/all/fbvaucluse.mp3'
	], [
	'-', 'alsace', 'armorique', 'auxerre', 'azur', 'basse normandie', 'b arn', 'belfort', 'bairi', 'besansson', 'bourgogne', 'breiz izel',
	'champagne', 'cotentin', 'creuse', 'drome ardaiche', 'fraisquenza mora', 'gard lozaire', 'gascogne', 'gironde', 'haute normandie', 'airo',
	'ile de france', 'isaire', 'la rochelle', 'limousin', 'loire o c an', 'lorraine nord', 'maine', 'mayenne', 'nord', 'orlai an',
	'pays basque', 'pays d\'auvergne', 'pays de savoie', 'pairigord', 'picardie', 'poitou', 'provence', 'roussillon', 'sud lorraine',
	'toulouse', 'touraine', 'vaucluze'
	]);

var indMax = 43;
var indice = parseInt(params[instanceName].radio);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..43

var url = tradio[0][indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.multimedia.stop();
		karotz.led.fade('FF0000', 3000);
		karotz.tts.start('France Bleu '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
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
		karotz.tts.start('France Bleu '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
		bpause = false;
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.tts.start('France Bleu '+tradio[1][indice], 'FR', function(){ karotz.multimedia.play(url); });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);