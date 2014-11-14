include('util.js');

var tpods = new Array();

// Chargement de la Liste...
var url = 'http://nabz.wizz.cc/_plugz/europe1_pods_revuedepresse.php';
var str = ''; str = http.get(url); if (!str.length) exit();
var str1 = str.split('|'); if (str1.length<1) exit();
var i; var str2; // log('Length: '+str1.length);
for(i=0; i<str1.length-1; i++) {
	str2 = str1[i].split(';');
	if (str2[1].length>29) { // http://europe1.proxycast.org/
		tpods[i] = new Array();
		tpods[i][0] = str2[0]; tpods[i][1] = str2[1];
	}
}

var indMax = i-1; // 0..i
var indice = 0; // Math.floor((Math.random()*(indMax-1))); // 0..indMax

var d = new Date();
var hh = d.getHours(); var mm = d.getMinutes(); var dd = d.getDay();
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.multimedia.stop();
		karotz.led.fade('FF0000', 3000);
		karotz.tts.start(tpods[indice][0], 'FR', function(){ karotz.multimedia.play(tpods[indice][1], evtMM); });
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
		karotz.tts.start(tpods[indice][0], 'FR', function(){ karotz.multimedia.play(tpods[indice][1], evtMM); });
		bpause = false;
	}
	return true;
}

var evtMM = function(event) {
    if (((event == 'CANCELLED') || (event == 'TERMINATED')) && !bpause) {
		if (++indice > indMax) indice = 0;
		karotz.tts.start(tpods[indice][0], 'FR', function(){ karotz.multimedia.play(tpods[indice][1], evtMM); });
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.tts.start(tpods[indice][0], 'FR', function(){ karotz.multimedia.play(tpods[indice][1], evtMM); });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);