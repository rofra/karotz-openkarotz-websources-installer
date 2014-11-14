include('util.js');

var t = 0; //init en min
var tf = params[instanceName].duree; //durée totale de fonction en min


var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop();
		exit();
	}
}

function arret() {
ping();
t = t + 1;
if ((t >= tf) && (tf !='i')) {
	karotz.multimedia.stop();
		exit();
	}
	}
var onKarotzConnect = function(data) {
	karotz.led.pulse('ff9933', 3000, -1);
	karotz.multimedia.play('http://media.radiomercure.net:8000/live');
	karotz.button.addListener(buttonListener);
	setTimeout(60000, function(){ arret(); return true; });
	}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);