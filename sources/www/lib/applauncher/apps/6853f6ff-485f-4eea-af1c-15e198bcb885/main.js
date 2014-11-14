include('util.js');

var requete = params[instanceName].url;

var onKarotzConnect = function(data) {
	karotz.led.fade('ff0000', 3000);
	
}

var karotz_ip = 'localhost';
var data = http.get(requete);


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);