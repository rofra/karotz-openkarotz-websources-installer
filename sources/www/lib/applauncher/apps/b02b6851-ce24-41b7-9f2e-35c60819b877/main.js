include('util.js');

var t1 = params[instanceName].keytel1;
var t2 = params[instanceName].keytel2;
var t3 = params[instanceName].keytel3;
var fonc = params[instanceName].keytel;
var hd = params[instanceName].boitier
if (fonc == 'numeros') {
var urltel = 'http://' + hd +'.freebox.fr/pub/remote_control?code=' + params[instanceName].codetel + '&key=' + t1 + '&key=' + t2 + '&key=' + t3 + '&long=' + params[instanceName].appui;
} else {
var urltel = 'http://' + hd +'.freebox.fr/pub/remote_control?code=' + params[instanceName].codetel + '&key=' + fonc + '&long=' + params[instanceName].appui;
}

var onKarotzConnect = function(data) {
	karotz.led.fade('ff0000', 3000);
	
}

var karotz_ip = 'localhost';
var data = http.get(urltel);


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);
