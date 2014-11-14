/* 
Agenda Google.
2011-2012 Sébastien Baelde
Contact : karotz@clic4.org
*/
include("util.js");
include("tinyxmldom.js");
var pause = "<break strength='strong'/>";
var karotz_ip="localhost";

var buttonListener = function(event) {
	if (event == "DOUBLE") {
		karotz.tts.stop();
		exit();
	}
	return true;
}


var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);

	var nbr_jours = params[instanceName].nbr_jours;
	var vitesse_parole = params[instanceName].vitesse_parole;
	var annonce = params[instanceName].annonce;

	var jour = new Date();

	var evenements = lireEvenement(jour.getDate(), jour.getMonth()+1, jour.getFullYear(), jour.getHours(), jour.getMinutes(), parseInt(nbr_jours));

	if (evenements.length > 0) {
		var txtEvenement = "<prosody rate='" + vitesse_parole + "'>";
		txtEvenement += annonce + pause;
	} else {
		var txtEvenement = "";
	}	

	for (var i=0;i<evenements.length;i++) {

		if (evenements[i][0] < 1000) {	// si < 1000 alors il s'agit d'une période
			var d = evenements[i][1].split('-');
			var f = evenements[i][2].split('-');
			txtEvenement += ". Du " + d[2] + " " + moisAnnee[d[1]-1] + " " + d[0] + pause + " au " + f[2] + " " + moisAnnee[f[1]-1] + " " + f[0];
			txtEvenement += pause + " " + evenements[i][3];
			txtEvenement += pause+pause;
		} else {
			txtEvenement += evenements[i][1] + " à " + evenements[i][2];
			txtEvenement += pause + " " + evenements[i][3];
			txtEvenement += pause+pause;
		}
	}

	if (evenements.length > 0) {	
		txtEvenement += "</prosody>";
		karotz.tts.start(txtEvenement, "fr", finTTS);
	} else {
		exit();
	}

}

function erreurXML(e) {
	log ("Erreur de XML");
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
