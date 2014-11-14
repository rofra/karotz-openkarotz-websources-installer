include('util.js');

var monping = function(event) {
ping();
log("ping");
setTimeout(600000, function() { monping(); return true; });
}

var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop();
		exit();
	}
}


var onKarotzConnect = function(data) {
	karotz.led.pulse('0000ff', 1000, -1);
	karotz.multimedia.play('http://mp3.live.tv-radio.com/fbnord/all/fbnord.mp3/');
	karotz.button.addListener(buttonListener);
	monping ();
	//setTimeout(300000, function(){ monping(); return true; });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);