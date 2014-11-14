include('util.js');

var d = new Date();
var hh = d.getHours(); var mm = d.getMinutes(); var dd = d.getDay();

var radio = parseInt(params[instanceName].radio);
var lang  = trim(params[instanceName].lang);

var json, indMax, indice, title;
var bpause = false;

function getJSON() {
// Chargement de la Liste json...
var url = 'http://api.deezer.com/2.0/radio/'+radio+'/tracks';
var jsonraw = http.get(url); if (!jsonraw.length) exit();

	json = JSON.parse(jsonraw); // log('json:'+json+' - '+json.data.length);
	indMax = json.data.length-1; if (indMax < 1) exit();
}

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.multimedia.stop();
		karotz.led.fade('FF0000', 3000);
		title = (lang.length<1)?'.':json.data[indice].artist.name+'. . '+json.data[indice].title+'.';
		karotz.tts.start(title, lang, function(){ karotz.multimedia.play(json.data[indice].preview, evtMM); });
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
			else if (++indice > indMax) indice = 0;
		karotz.led.fade('FF0000', 3000);
		title = (lang.length<1)?'.':json.data[indice].artist.name+'. . '+json.data[indice].title+'.';
		karotz.tts.start(title, lang, function(){ karotz.multimedia.play(json.data[indice].preview, evtMM); });
		bpause = false;
	}
	return true;
}

var evtMM = function(event) {
    if (((event == 'CANCELLED') || (event == 'TERMINATED')) && !bpause) {
		if (++indice > indMax) indice = 0;
		title = (lang.length<1)?'.':json.data[indice].artist.name+'. . '+json.data[indice].title+'.';
		karotz.tts.start(title, lang, function(){ karotz.multimedia.play(json.data[indice].preview, evtMM); });
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	title = (lang.length<1)?'.':json.data[indice].artist.name+'. . '+json.data[indice].title+'.';
	karotz.tts.start(title, lang, function(){ karotz.multimedia.play(json.data[indice].preview, evtMM); });
}

var karotz_ip = 'localhost';
var data = {};

getJSON(); indice = Math.floor((Math.random()*(indMax))); // 0..indMax

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);