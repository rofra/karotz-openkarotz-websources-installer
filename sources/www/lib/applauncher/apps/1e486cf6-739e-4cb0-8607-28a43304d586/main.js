include('util.js');

var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop(); pause(1000); exit();
	}
}

var evtMM = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.multimedia.stop(); pause(1000); exit();
	}
}

var onKarotzConnect = function(data) {
	karotz.led.fade('FF0000', 3000);
	setTimeout(300000, function(){ log('ping'); ping(); return true; });
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play('http://www.litteratureaudio.org/Olympe_de_Gouges_-_Declaration_des_Droits_de_la_Femme_et_de_la_Citoyenne.mp3', evtMM);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);