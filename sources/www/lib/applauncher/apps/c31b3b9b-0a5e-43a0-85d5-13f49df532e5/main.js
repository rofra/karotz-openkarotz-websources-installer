include("util.js");
include("tinyxmldom.js");

var karotz_ip="localhost";

var buttonListener = function(event) {
	if (event == "DOUBLE") {
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
	var data = http.get("http://www.livredujour.fr/rss/rss_livre_lapin.php");
	var objDom = new XMLDoc(data);
	var domTree = objDom.docNode;

	var strDate = domTree.selectNode("/channel/item[0]/dateselection").getText();
	var day = strDate.substring(0,2);
	if (day == 1) { day = "premier"; }
	var month = new Array("janvier","février","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","décembre");
	month = month[strDate.substring(3,5)-1];
	
	var title = domTree.selectNode("/channel/item[0]/titre").getText();
	var auteur = domTree.selectNode("/channel/item[0]/auteur").getText();
	var editeur = domTree.selectNode("/channel/item[0]/editeur").getText();
	var desc = domTree.selectNode("/channel/item[0]/description").getText();
	var secteur = domTree.selectNode("/channel/item[0]/rubrique").getText();

	var lire = "Bonjour, bienvenue dans la sélection du livre du jour : : : Aujourdhui "+day+" "+month+", nous vous proposons de découvrir : "+ title + " de " + auteur + " : : : : Description du livre par l'éditeur : " + editeur + " : : : : : : : " + desc + " : : : : : : : : Vous retrouverez cet ouvrage dans votre librairie, le plus souvent dans le secteur "+secteur+" : : : : : : Vous venez de découvrir "+title + " de " + auteur+" : : : : : : Excellente journée et à demain pour une nouvelle découverte.";

	karotz.tts.start(lire, "fr", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});