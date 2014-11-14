include("util.js");

var app_name = "Mon Prénom";
var app_version = "1.0.20";
var karotz_ip = 'localhost';
//var karotz_ip="192.168.3.25"

var randomnumber = 0;
var WHITE = "4FFF68";
var BLACK = "000000";
var BLUE = "0000FF";
var RED = "FF0000";
var genre = "";
var posDebut = 0;
var posFin = 0;
var debut = "";
var fin = "";
var question = "";

var lettre = "";
var prenom = "";

var grammar = "";

var monretour = function(asrResult)
{
	log("monretour");
	log(asrResult.text);
	
	if (asrResult.text == "<nomatch>")
	{
    	karotz.tts.start("Je n'ai pas compris, veuillez réessayer", "fr-FR", function(event){
										if((event == "CANCELLED") || (event == "TERMINATED")) {
												obtenirPrenom();
											}
										});
	}
	
	prenom = asrResult.text;
	karotz.ears.move(8, 13);
	
	karotz.tts.start("Signification du prénom " + prenom + ". Recherche des informations en cours, veuillez patienter.", "fr", function(event){
											if((event == "CANCELLED") || (event == "TERMINATED")) {
												signification(prenom);
											}
										});
	
}

var obtenirPrenom = function()
{
	log("obtenirPrenom");
	karotz.asr.string(grammar,"fr-FR", monretour);
}

var formatage = function(texte)
{
	texte = html_entity_decode(texte);
	
	var reg = new RegExp("<strong>","gi")
	texte = texte.replace(reg, "");
	
	reg = new RegExp("</strong>","gi")
	texte = texte.replace(reg, "");
	
	return texte;
}

var verifPrenom = function(texte)
{
	log("verifPrenom");
	var texteScan = AccentToNoAccent(texte);
	texteScan = texteScan.toLowerCase();
	
	debut = "signification du prenom  " + prenom;
	debut = AccentToNoAccent(debut);
	debut = debut.toLowerCase();
	
	karotz.ears.move(8, 13);
	
	posDebut = texteScan.indexOf(debut, 0);
	
	if (posDebut == -1)
	{
		log("prenom non présent sur le site");
		karotz.led.light(BLACK);
		karotz.led.pulse(BLUE, 500, -1);
	
		karotz.tts.start("Je suis désolé, ce prénom n'existe pas dans la base de données", "fr", function(event){
											if((event == "CANCELLED") || (event == "TERMINATED")) {
												exit();
											}
										});	
	}
	else
		{
			log("prenom présent sur le site");
		}
}

var p1 = function(texte)
{
	var texteBrut = "";
	debut = "<div id=\"intro2\">";
	posDebut = texte.indexOf(debut, 0);
	debut = "<p>";
	posDebut = texte.indexOf(debut, posDebut)+3;
	fin = "</p>";
	posFin = texte.indexOf(fin, posDebut);
	
	question = texte.substring(posDebut, posFin) + String.fromCharCode(10);
	
	posDebut = posFin + 21;
		
	posFin = texte.indexOf(fin, posDebut);
	texteBrut = question + texte.substring(posDebut, posFin) + String.fromCharCode(10) + String.fromCharCode(10);
	
	return texteBrut;
}

var p2 = function(texte)
{
	//log("p2");
	var texteBrut = "";
	debut = "<p>";
	fin = "</p>";
	
	posDebut = texte.indexOf(debut, posFin);
	
	posFin = texte.indexOf(fin, posDebut);
	
	posDebut = texte.indexOf(debut, posFin)+3;
	fin = "<br />";
	posFin = texte.indexOf(fin, posDebut);
	
	question = texte.substring(posDebut, posFin) + String.fromCharCode(10);
	
	fin = "</p>";
	posDebut = posFin+10;
	posFin = texte.indexOf(fin, posDebut);
	
	texteBrut = question + texte.substring(posDebut, posFin) + String.fromCharCode(10) + String.fromCharCode(10);
	
	return texteBrut;
}

var p3 = function(texte)
{
	var texteBrut = "";
	debut = "<p>";
	fin = "</p>";
	
	for (i=1; i<=3; i++){ 
		posDebut = texte.indexOf(debut, posFin);
		posFin = texte.indexOf(fin, posDebut);
	}
	
	posDebut = texte.indexOf(debut, posFin)+3;
	fin = "<br />";
	posFin = texte.indexOf(fin, posDebut);
	
	question = texte.substring(posDebut, posFin) + String.fromCharCode(10);
	
	fin = "</p>";
	
	for (i=1; i<=3; i++){ 
		posDebut = texte.indexOf(debut, posFin);
		posFin = texte.indexOf(fin, posDebut);
	}
	
	posDebut = texte.indexOf(debut, posFin)+3;
	posFin = texte.indexOf(fin, posDebut);

	texteBrut = question + texte.substring(posDebut, posFin) + String.fromCharCode(10) + String.fromCharCode(10);
	
	return texteBrut;
}

var signification = function(prenom){
	log("signification prenom");
	
	karotz.led.light(BLACK);
	karotz.led.pulse(RED, 500, -1);
	
	prenom = AccentToNoAccent(prenom);
	prenom = prenom.toUpperCase();
	
	var URL = "http://www.signification-prenom.com/prenom/prenom-" + prenom + ".html";

	//log(URL);
	
	var monTexte = formatage(http.get2(URL).content);
	
	verifPrenom(monTexte);
	
	karotz.ears.move(8, 8);
	
	monTexte = p1(monTexte) + p2(monTexte) + p3(monTexte) + "Fin de la définition";
	
	karotz.led.light(BLACK);
	karotz.led.pulse(BLUE, 500, -1);
	
	karotz.tts.start(monTexte, "fr", function(event){
											if((event == "CANCELLED") || (event == "TERMINATED")) {
												exit();
											}
										});	
}

var buttonListener = function(event) {
    if (event == "DOUBLE") {
		//L'utilisateur veut quitter l'application
		exit();
    }
	return true;
}

var onKarotzConnect = function(data) {
	genStats();
	setTimeout(300000, function(){ log("ping"); ping(); return true; });
    karotz.button.addListener(buttonListener);
	karotz.ears.move(13, 8);
	karotz.led.light(BLACK);
	karotz.led.pulse(WHITE, 200, -1);
	
	prenoms = params[instanceName].prenom;
	//prenoms = "guillaume;";
	
	var elem = prenoms.split(';');
	var nb_prenoms = 0;
	
	for (i=0;i<elem.length;i++)
	{
		if (elem[i] != "")
		{
			nb_prenoms++;
			grammar = grammar + elem[i] + " | ";
		}
	}
	
	grammar = grammar.substr(0, (grammar.length - 3));
	
	log(nb_prenoms + " prenoms trouves");
	
	if (nb_prenoms > 1)
	{
		karotz.tts.start("Quel est le prénom à chercher?", "fr", function(event){
									if((event == "CANCELLED") || (event == "TERMINATED")) {
										obtenirPrenom();
									}
								});					
	}
	
	if (nb_prenoms == 0)
	{
		karotz.tts.start("Vous devez saisir au moins un prénom dans les paramètres de l'application. Modifier ce paramètre et relancez l'application.", "fr", function(event){
										if((event == "CANCELLED") || (event == "TERMINATED")) {
											exit();
										}
									});	
	}
	else
		{
		karotz.tts.start("Signification du prénom " + elem[0] + ". Recherche des informations en cours, veuillez patienter.", "fr", function(event){
										if((event == "CANCELLED") || (event == "TERMINATED")) {
											signification(elem[0]);
										}
									});	
		}
		
	
}

	
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
