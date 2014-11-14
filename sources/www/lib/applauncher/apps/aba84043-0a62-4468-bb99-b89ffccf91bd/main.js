include('util.js');

var tconte = [
'-',
'http://www.litteratureaudio.net/Charles_Perrault_-_Cendrillon_ou_la_petite_pantoufle_de_vair.mp3',
'http://www.litteratureaudio.org/Charles_Perrault_-_La_Barbe_Bleue.mp3',
'http://www.litteratureaudio.net/Charles_Perrault_-_La_Belle_au_Bois_Dormant.mp3',
'http://www.litteratureaudio.net/Charles_Perrault_-_Le_maitre_chat_ou_le_chat_botte.mp3',
'http://www.litteratureaudio.net/Charles_Perrault_-_Le_petit_chaperon_rouge.mp3',
'http://www.litteratureaudio.net/Charles_Perrault_-_Le_petit_poucet.mp3',
'http://www.litteratureaudio.net/Charles_Perrault_-_Les_fees.mp3',
'http://www.litteratureaudio.net/Charles_Perrault_-_Riquet_a_la_houppe.mp3'
];
	
var indMax = 8;
var indice = parseInt(params[instanceName].conte);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..8

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