include("util.js");

var karotz_ip="localhost"
var jour = params[instanceName].jour
var mois = params[instanceName].mois
var annee = params[instanceName].annee
var nom = params[instanceName].nom
var genre = params[instanceName].genre

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
	var jour1 = http.get("http://karotz.free.fr/jour.php");
	log("received : " + jour1);
	var mois1 = http.get("http://karotz.free.fr/mois.php");
	log("received : " + mois1);
	var annee1 = http.get("http://karotz.free.fr/annee.php");
	log("received : " + annee1);
	var jm1 = http.get("http://karotz.free.fr/jourmois.php");
	log("received : " + jm1);
var j=parseInt(jour);
var j1=parseInt(jour1);
var jm=parseInt(jm1);
var m=parseInt(mois);
var m1=parseInt(mois1);
var a=parseInt(annee);
var a1=parseInt(annee1);
var j3 = j
	if (j1 > j){j = j1 - j +jm}
	else if (j1 <= j){j = j - j1 }
	m = m - m1
	a1 = a1 + 2000
	a = a1 - a
	if (m < m1 && j1 > j3) {a++;m = m + 12;}
	log("m = " + m);
	log("a = " + a);
	log("j = " + j);
	if (m == 0 && j == 0) {karotz.tts.start("Aujourdui ces l'anniversaire de " + nom + "     " + genre +" a " + a + " ans", "fr",exitFunction);}
	if (m == 0 && j1 < j3) {karotz.tts.start("Dans " + j +" jour  ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 7 && m == 0) {karotz.tts.start("Dans une semaine ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 14 && m == 0) {karotz.tts.start("Dans 2 semaine ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 21 && m == 0) {karotz.tts.start("Dans 3 semaine ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 28 && m == 0) {karotz.tts.start("Dans 4 semaine ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 7 && m == 12) {karotz.tts.start("Dans 1 semaine et 1 an ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 14 && m == 12) {karotz.tts.start("Dans 2 semaine et 1 an ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 21 && m == 12) {karotz.tts.start("Dans 3 semaine et 1 an ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (j == 28 && m == 12) {karotz.tts.start("Dans 4 semaine et 1 an ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else if (m == 12 && j1 > j) {karotz.tts.start("Dans 1 ans et " + j + " jour ce sera l'anniversaire de " + nom + "     " + genre +" aura " + a + " ans", "fr",exitFunction);}
	else {karotz.tts.start("Dans " + m + " mois et "+ j + " jour ce sera l'anniversaire de " + nom + "   " + genre +" aura " + a + " ans", "fr",exitFunction);}
}


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
