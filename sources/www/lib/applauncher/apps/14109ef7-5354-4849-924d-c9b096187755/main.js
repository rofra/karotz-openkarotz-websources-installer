include("util.js");
var karotz_ip = "localhost"

setTimeout(300000, function(){ log("ping"); karotz.ping(); return true; });

var onKarotzConnect = function(data) {
	karotz.multimedia.play("http://fg.impek.com/;flash.mp3");
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});