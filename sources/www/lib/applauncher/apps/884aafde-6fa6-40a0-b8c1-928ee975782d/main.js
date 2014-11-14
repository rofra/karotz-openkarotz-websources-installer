include('util.js');

var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop(); exit();
	}
}

var evtExit = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.multimedia.stop(); exit();
	}
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.led.fade('ff0000', 3000);
	karotz.multimedia.play('http://www.wizz.cc/karotz/_mp3/mireille_mathieu_-_la_marseillaise.mp3', evtExit);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);