include("util.js");

var app_name = "Chuck Norris Facts";
var app_version = "1.0.15";
var karotz_ip = 'localhost';
//var karotz_ip="192.168.3.25"

var WHITE = "4FFF68";
var BLACK = "000000";
var BLUE = "0000FF";
var RED = "FF0000";
var tabFacts = new Array();
var iEnCours = -1;
var NbFacts = 0;

var buttonListener = function(event) {
    if (event == "SIMPLE") {
		//L'utilisateur veut lire le fact suivant		
		lireSuivant();
    }
	else
		{
			//L'utilisateur veut quitter l'application
			exit();
		}
	return true;
}

var onKarotzConnect = function(data) {
	genStats();
	setTimeout(300000, function(){ log("ping"); ping(); return true; });
	karotz.ears.move(13, 8);
    karotz.button.addListener(buttonListener);
	lectureFacts();
}

var formatage = function(texte)
{
	var reg = new RegExp("<br />","gi")
	texte = texte.replace(reg, String.fromCharCode(10));
	reg = new RegExp("norris","gi")
	texte = texte.replace(reg, "Norisse");
	texte = html_entity_decode(texte);
	return texte;
}

var lireSuivant = function()
{
	karotz.led.light(BLACK);
	karotz.led.pulse(BLUE, 200, -1);
	iEnCours++;
	karotz.tts.start(tabFacts[iEnCours], "fr", function(event){
											if((event == "CANCELLED") || (event == "TERMINATED")) {
												if (iEnCours == NbFacts)
												{
													exit();
												}
												else
													{
														karotz.led.light(BLACK);
														karotz.led.pulse(WHITE, 2000, -1);
														setTimeout(2000, function(){ lireSuivant(); });
													}
											}
										});
										
	return true;
}

var trouverFacts = function(texte)
{
	var texteBrut = "";
	var trouve = 1;
	var posDebut = 0;
	var i = -1;
	
	while(trouve != 0)
	{
		debut = "<div class=\"fact\"";
		posDebut = texte.indexOf(debut, posDebut);
		
		log(posDebut);
		
		if (posDebut == -1)
		{
			trouve = 0;
		}
		else
			{
				i++;
				debut = ">";
				posDebut = texte.indexOf(debut, posDebut)+1;
				fin = "</div>";
				posFin = texte.indexOf(fin, posDebut);
				tabFacts[i] = texte.substring(posDebut, posFin);
			}
	}
	
	return true;
}

var lectureFacts = function() {
	var URL = "";
	var typeLecture = params[instanceName].typeLecture;
	//var typeLecture = "5";
	NbFacts = params[instanceName].nb_facts;
	//NbFacts = 2;
	
	NbFacts--;
	
	var tts = "";
	
	switch(typeLecture)
	{
		case "1" :
			URL = "http://www.chucknorrisfacts.fr/index.php?p=parcourir&tri=top";
			tts = "Chuck Norrisse Facts, sélection top points";
			break;
		case "2" :
			URL = "http://www.chucknorrisfacts.fr/index.php?p=parcourir&tri=flop";
			tts = "Chuck Norrisse Facts, sélection flop points";
			break;
		case "3" :
			URL = "http://www.chucknorrisfacts.fr/index.php?p=parcourir&tri=mtop";
			tts = "Chuck Norrisse Facts, sélection top moyenne";
			//Bug du site, le 1er fact est vide, alors on passe directement au 2ème
			iEnCours++
			break;
		case "4" :
			URL = "http://www.chucknorrisfacts.fr/index.php?p=parcourir&tri=mflop";
			tts = "Chuck Norrisse Facts, sélection flop moyenne";
			break;
		case "5" :
			URL = "http://www.chucknorrisfacts.fr/index.php?p=parcourir&tri=aleatoire";
			tts = "Chuck Norrisse Facts, sélection aléatoire";
			break;
		case "6" :
			URL = "http://www.chucknorrisfacts.fr/index.php?p=parcourir";
			tts = "Chuck Norrisse Facts, sélection derniers ajouts";
			break;			
		default :
			URL = "http://www.chucknorrisfacts.fr/index.php?p=parcourir&tri=top";
			tts = "Chuck Norrisse Facts, sélection top points";
			break;
	}
	
	var monTexte = formatage(http.get2(URL).content);
	trouverFacts(monTexte);
	
	lireSuivant();
	/*
	karotz.tts.start(tts, "fr", function(event){
											if((event == "CANCELLED") || (event == "TERMINATED")) {
												lireSuivant();
											}
										});*/
	return true;
}

var data = {};
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);
