/* 
Agenda Google.
2011-2012 Sébastien Baelde
Contact : karotz@clic4.org
*/
include("tinyxmldom.js");
joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
moisAnnee = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ];
karotz.connectAndStart = function(host, port, callback, data){	
	try{
		karotz.connect(host, port);
		log("connected");
		karotz.start(callback, data);
	}catch(err){
		log(err);
	}
};

function trierDates(a, b) {
	return a[0]-b[0];
}

var finTTS = function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		exit();
	}
}

function erreurConnexionAgenda(erreur) {
	karotz.tts.start("<prosody rate='medium'><break strength='strong'/>Il y a un problème de connexion avec votre agenda google. <break strength='strong'/>Vérifiez votre adresse privée dans le panneau de configuration.</prosody>", "fr", finTTS);
}

function lireEvenement(jour, mois, annee, heure, minute, maxJours) {

	if (jour < 10) { jour = '0' + String(jour); } else { jour = String(jour); }
	if (mois < 10) { mois = '0' + String(mois); } else { mois = String(mois); }
	if (heure < 10) { heure = '0' + String(heure); } else { heure = String(heure); }
	if (minute < 10) { minute = '0' + String(minute); } else { minute = String(minute); }
	annee = String(annee);
	var id_google = params[instanceName].id_google;

	id_google = id_google.slice(0, id_google.length-5) + "full";

	var evenMax = new Date();
	evenMax.setDate(evenMax.getDate()+7);
	var a_max = evenMax.getFullYear();
	var m_max = evenMax.getMonth()+1;
	var j_max = evenMax.getDate();

	if (j_max < 10) { j_max = '0' + String(j_max); } else { j_max = String(j_max); }
	if (m_max < 10) { m_max = '0' + String(m_max); } else { m_max = String(m_max); }

	req = id_google + "?sortorder=ascending&start-min="+annee+"-"+mois+"-"+jour+"T"+heure+":"+minute+":00";
	req += "&start-max=" + a_max+"-"+m_max+"-"+j_max+"T23:59:59";

	var aujourdhui = new Date();
	var jourMax = new Date();
	jourMax.setDate(jourMax.getDate()+maxJours);

	try {
		var data = http.get(req);

		var dom = new XMLDoc(data, erreurXML);
		var rootDom = dom.docNode;
		var racine = rootDom.getElements("entry");
		var retour = new Array();

		for (var i=0;i<racine.length;i++) {

			var quand = racine[i].getElements("gd:when");
			var depart = quand[0].getAttribute('startTime');
			var fin = quand[0].getAttribute('endTime');
			if (depart.length == 10) {	// Evénement sur une période
				var dateEvenement = new Date( depart+"T00:00:00.000Z" );
				if (dateEvenement < jourMax) {
					var titre = racine[i].getElements("title");
					info = titre[0].getText();
				
					retour.push([i, depart, fin, info]);
				}
			} else {
				var dateEvenement = new Date( depart.slice(0, 23)+"Z" );

				if (dateEvenement > aujourdhui) {

					if (dateEvenement < jourMax) {
						heure_tache = quand[0].getAttribute('startTime');
						heure_tache = heure_tache.slice(11, 16);
						if (heure_tache[0] == 0) {
							heure_tache = heure_tache.slice(1, 5);
						}

						var titre = racine[i].getElements("title");
						info = titre[0].getText();

						// 
						jA = aujourdhui.getDay();
						jD = dateEvenement.getDay();
						if ( joursSemaine[jA] == joursSemaine[jD] ) {
							var jourMot = "Aujourd'hui";
						} else {

							if ((jD - jA == 1) || (jD == 6 && jA == 0) || 
							(jD == 0 && jA == 6)) {
								var jourMot = "Demain";
							} else {
								var jourMot = joursSemaine[dateEvenement.getDay()];
							}			
						}
						retour.push([dateEvenement.getTime(), jourMot, heure_tache, info]);
					} else {
						//break;
					}
				}
			}
		}
		retour.sort(trierDates);
		return retour;
	
	
	} catch (err) {
		erreurConnexionAgenda(err);
	}
	
}
