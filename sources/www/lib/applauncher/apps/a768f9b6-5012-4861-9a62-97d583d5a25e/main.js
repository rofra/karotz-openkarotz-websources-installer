include('util.js');

var host = params[instanceName].hostname;
var macpc = params[instanceName].mac;
var requete = 'http://serv.samuelvermeulen.net/wol.php?macpc=' + macpc + '&host=' + host;
var onKarotzConnect = function(data) {
	karotz.led.fade('ff0000', 3000);
	
}

var karotz_ip = 'localhost';
var data = http.get(requete);


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);