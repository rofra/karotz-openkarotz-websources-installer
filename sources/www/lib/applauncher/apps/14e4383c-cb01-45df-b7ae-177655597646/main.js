include("util.js");

var app_name = "Lancé de dé";
var app_version = "1.0.5";

//var karotz_ip="192.168.3.65"
var karotz_ip = 'localhost';
var nb_faces = 0;

var randomnumber = 0;
var WHITE = "4FFF68";
var BLACK = "000000";
var RED = "FF0000";

var grammar = "3 | 4 | 6 | 8 | 10 | 12 | 20"; 

var monretour = function(asrResult)
{
	log("monretour");
	log(asrResult.text);
	if (asrResult.text == "<nomatch>")
	{
    	karotz.tts.start("       Je n'ai pas compris, veuillez réessayer", "fr-FR", function(event){
											if((event == "CANCELLED") || (event == "TERMINATED")) {
												obtenirNbFaces();
											}
										});
	}
	nb_faces = asrResult.text;
	karotz.tts.start("Vous avez choisi un dé à " + nb_faces + " faces. C'est parti !", "fr");
	nb_faces++;
	karotz.led.light(BLACK);
	karotz.led.pulse(WHITE, 2000, -1);
}

var obtenirNbFaces = function()
{
	log("obtenirNbFaces");
	karotz.asr.string(grammar,"fr-FR", monretour);
}

var lancerDe = function(){
	karotz.led.light(BLACK);
	karotz.led.pulse(RED, 200, 1000);
	while(randomnumber==0)
	{
		//Tant qu'on obtient 0 on boucle
		randomnumber=Math.floor(Math.random()*nb_faces)
	}
	karotz.tts.start(randomnumber, "fr");
	randomnumber = 0;
	karotz.led.light(BLACK);
	karotz.led.pulse(WHITE, 2000, -1);
}

var buttonListener = function(event) {
    if (event == "SIMPLE") {
		//Le joueur veut lancer le dé
		lancerDe();
    }
    if (event == "DOUBLE") {
		//Le joueur veut quitter le jeu
		karotz.tts.start("Fin de la partie !", "fr-FR", function(event){
			if((event == "CANCELLED") || (event == "TERMINATED")) {
        		exit();
			}
    	});
    	
	}
	return true;
}

var onKarotzConnect = function(data) {
	genStats();
	setTimeout(300000, function(){ log("ping"); ping(); return true; });
    karotz.button.addListener(buttonListener);
	karotz.ears.move(13, 8);
	var texteIntro = "Veuillez choisir le nombre de faces";
    karotz.tts.start(texteIntro, "fr-FR", function(event){
											if((event == "CANCELLED") || (event == "TERMINATED")) {
												obtenirNbFaces();
											}
										});
}

	
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
