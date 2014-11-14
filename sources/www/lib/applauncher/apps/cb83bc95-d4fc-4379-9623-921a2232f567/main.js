include("util.js");

var karotz_ip="localhost";

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.tts.start(tts_chaine, "fr", exitFunction);
}

// Fonction qui permet de supprimer tous les retours charriot
var concatener = function(data) {
	reg=new RegExp("\n", "gi");
	data = data.replace(reg, " ");
    return data;
}

// Fonction qui supprime les balises HTML / XML
var suppr_balises = function(data) {
    reg=new RegExp("<.[^<>]*>", "gi" );
    data=data.replace(reg, " " );
    return data;
}

// Fonction qui remplace une chaîne par une autre (expression reguliere)
var myreplace = function(data, origine, dest) {
	reg = new RegExp(origine, "gi");
	data = data.replace(reg, dest);
	return data;
}

// Fonction qui extrait un contenu à partir d'une expression reguliere
var myextract = function(data, regexp) {
	reg = new RegExp(regexp, "gi");
	data.match(reg);
	return RegExp.$1;
}

var stationId = params[instanceName].stationid;

var data = http.get("http://www.velib.paris.fr/service/stationdetails/" + stationId);

log("received : " + data);

data = concatener(data);

var available = myextract(data, "<available>(.*)</available>");
var free = myextract(data, "<free>(.*)</free>");

var tts_chaine = " VELIB. A la station " + instanceName + ", il y a " + available + " vélos disponibles et " + free + "places libres.";

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

