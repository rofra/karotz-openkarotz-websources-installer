include('util.js');


var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
	karotz.led.pulse('ffff00', 100, 3000);
	setTimeout(20000, function(){ exit(); return true; });
	
	var date_du_jour, heure;
	date_du_jour = new Date();
	heure = date_du_jour.getHours();
	
karotz.multimedia.play('http://nerdoq.alwaysdata.net/karotz/signature.mp3', function(data) {

if (data== "TERMINATED") {
				karotz.multimedia.play('http://nerdoq.alwaysdata.net/karotz/' + heure + '.mp3', exitFunction);
						}

});


	
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);