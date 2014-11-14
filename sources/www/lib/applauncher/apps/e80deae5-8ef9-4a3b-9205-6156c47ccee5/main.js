include("util.js");

var karotz_ip="localhost";
//var karotz_ip="192.168.1.58";
var phrase = params[instanceName].phrase;
var serveur = params[instanceName].serveur;
//var phrase = "[erreur]"; //phrase à dire quand le serveur ne répond plus
//var serveur = "http://88.190.21.67/www/ping..php"; //adresse du serveur

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    verification = http.get(serveur);
	if (phrase == "[erreur]"){phrase=verification;}
	if (verification == "ok\n" || verification == "ok") {exit();}
	else {
		karotz.led.light("FFFF00");
		karotz.led.pulse("FF0000", 100, -1);
		karotz.tts.start(phrase,"fr");
					} //Si pas de réponse on clignote en rouge et jaune et dit la phrase
	
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
