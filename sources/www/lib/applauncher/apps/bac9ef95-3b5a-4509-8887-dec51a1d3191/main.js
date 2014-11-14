include("util.js");

//var karotz_ip="192.168.0.40";
var karotz_ip="localhost";
var karotz1 = 1;
var user = 2;
var niveau = 1;
var hg = 0;
var hc = 0;
var hd = 0;
var cg = 0;
var cc = 0;
var cd = 0;
var bg = 0;
var bc = 0;
var bd = 0;
var suivant = 0;
var dico = "[je] [joue] [en] haut [a] gauche { $.param='1'} | [je] [joue] [en] haut [au] milieu { $.param='2'} | [je] [joue] [en] haut [a] droite { $.param='3'} | [je] [joue] [au] milieu [a] gauche { $.param='4'} | [je] [joue] [au] centre { $.param='5'} | [je] [joue] [au] milieu [a] droite { $.param='6'} | [je] [joue] [en] bas [a] gauche { $.param='7'} | [je] [joue] [en] bas [au] milieu { $.param='8'} | [je] [joue] [en] bas [a] droite { $.param='9'}";


var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
	if (event == "SIMPLE") {
		log("--------------------------------------------------3");
		karotz.asr.string(dico,"fr",asrResult);
		log("--------------------------------------------------3bis");
}


    return true;
}



var onKarotzConnect = function(data) {
	karotz.tts.start("Tu veux joué au morpion alors sors un papier et un crayon quand tu est prêt appui sur ma  tète", "fr");
	log("--------------------------------------------------1");
    	karotz.button.addListener(buttonListener);
	log("--------------------------------------------------2");
	
}

var asrResult = function(asrResult)
{
	log("--------------------------------------------------4");
	if (asrResult.semantic.param == 1) {
		if (hg == 0) {hg = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}	else if (asrResult.semantic.param == 2) {
		if (hc == 0) {hc = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}	else if (asrResult.semantic.param == 3) {
		if (hd == 0) {hd = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}	else if (asrResult.semantic.param == 4) {
		if (cg == 0) {cg = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}	else if (asrResult.semantic.param == 5) {
		if (cc == 0) {cc = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}	else if (asrResult.semantic.param == 6) {
		if (cd == 0) {cd = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
} 	else if (asrResult.semantic.param == 7) {
		if (bg == 0) {bg = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}	else if (asrResult.semantic.param == 8) {
		if (bc == 0) {bc = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}	else if (asrResult.semantic.param == 9) {
		if (bd == 0) {bd = user;karotzReflexion();}
		else {karotz.tts.start("Cette case est dejà joué","fr");}
}
return true;
}
var karotzReflexion = function(data) {

		if (hg == hc && hc == hd && hg == karotz1) {karotz.tts.start("J'ai gagné", "fr", exitFunction);}
		else if (cg == cc && cc == cd && cg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (bg == bc && bc == bd && bg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hg == cg && cg == bg && hg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hc == cc && cc == bc && hc == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hd == cd && cd == bd && hd == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hg == cc && cc == bd && hc == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hd == cc && cc == bg && hd == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hg == hc && hc == hd && hg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (cg == cc && cc == cd && cg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (bg == bc && bc == bd && bg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg == cg && cg == bg && hg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hc == cc && cc == bc && hc == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hd == cd && cd == bd && hd == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg == cc && cc == bd && hc == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hd == cc && cc == bg && hd == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg == hc && hc == hd && hg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg != 0 && hc != 0 && hd != 0 && cg != 0 && cc != 0 && cd != 0 && bg != 0 && bc != 0 && bd != 0) {karotz.tts.start("égalité personne n'a gagné.", "fr", exitFunction);}
		else {

			if (suivant == 0){
		if (hg == hc && hg == karotz1 && hd == 0) {hd=karotz1;suivant=0;karotz.tts.start("Je joue en haut à droite.", "fr", verification);}
		else if (cg == cc && cg == karotz1 && cd == 0) {cd=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à droite.", "fr", verification);}
		else if (bg == bc && bg == karotz1 && bd == 0) {bd=karotz1;suivant=0;karotz.tts.start("Je joue en bas à droite.", "fr", verification);}
		else if (hg == cg && hg == karotz1 && bg == 0) {bg=karotz1;suivant=0;karotz.tts.start("Je joue en bas à gauche.", "fr", verification);}
		else if (hc == cc && hc == karotz1 && bc == 0) {bc=karotz1;suivant=0;karotz.tts.start("Je joue en bas au milieu.", "fr", verification);}
		else if (hd == cd && hd == karotz1 && bd == 0) {bd=karotz1;suivant=0;karotz.tts.start("Je joue en bas à droite.", "fr", verification);}
		else if (hg == cc && hg == karotz1 && bd == 0) {bd=karotz1;suivant=0;karotz.tts.start("Je joue en bas à droite.", "fr", verification);}
		else if (hd == cc && hd == karotz1 && bg == 0) {bg=karotz1;suivant=0;karotz.tts.start("Je joue en bas à gauche.", "fr", verification);}

		else if (hd == hc && hd == karotz1 && hg == 0) {hg=karotz1;suivant=0;karotz.tts.start("Je joue en haut à gauche.", "fr", verification);}
		else if (cd == cc && cd == karotz1 && cg == 0) {cg=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à gauche.", "fr", verification);}
		else if (bd == bc && bd == karotz1 && bg == 0) {bg=karotz1;suivant=0;karotz.tts.start("Je joue en bas à gauche.", "fr", verification);}
		else if (bg == cg && bg == karotz1 && hg == 0) {hg=karotz1;suivant=0;karotz.tts.start("Je joue en haut à gauche.", "fr", verification);}
		else if (bc == cc && bc == karotz1 && hc == 0) {hc=karotz1;suivant=0;karotz.tts.start("Je joue en haut au milieu.", "fr", verification);}
		else if (bd == cd && bd == karotz1 && hd == 0) {hd=karotz1;suivant=0;karotz.tts.start("Je joue en haut à droite.", "fr", verification);}
		else if (bd == cc && bd == karotz1 && hg == 0) {hg=karotz1;suivant=0;karotz.tts.start("Je joue en haut à gauche.", "fr", verification);}
		else if (bg == cc && bg == karotz1 && hd == 0) {hd=karotz1;suivant=0;karotz.tts.start("Je joue en haut à droite.", "fr", verification);}

		else if (hg == hd && hg == karotz1 && hc == 0) {hc=karotz1;suivant=0;karotz.tts.start("Je joue en haut au milieu.", "fr", verification);}
		else if (cg == cd && cg == karotz1 && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}
		else if (bg == bd && bg == karotz1 && bc == 0) {bc=karotz1;suivant=0;karotz.tts.start("Je joue en bas au milieu.", "fr", verification);}
		else if (hg == bg && hg == karotz1 && cg == 0) {cg=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à gauche.", "fr", verification);}
		else if (hc == bc && hc == karotz1 && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}
		else if (hd == bd && hd == karotz1 && cd == 0) {cd=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à droite.", "fr", verification);}
		else if (hg == bd && hg == karotz1 && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}
		else if (hd == bg && hd == karotz1 && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}

		else {log("++++++++++++++++++++++++++++++++++++salut : "+suivant);suivant=1;karotzReflexion();}
			}
			else if (suivant == 1) {
		if (hg == hc && hg == user && hd == 0) {hd=karotz1;suivant=0;karotz.tts.start("Je joue en haut à droite.", "fr", verification);}
		else if (cg == cc && cg == user && cd == 0) {cd=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à droite.", "fr", verification);}
		else if (bg == bc && bg == user && bd == 0) {bd=karotz1;suivant=0;karotz.tts.start("Je joue en bas à droite.", "fr", verification);}
		else if (hg == cg && hg == user && bg == 0) {bg=karotz1;suivant=0;karotz.tts.start("Je joue en bas à gauche.", "fr", verification);}
		else if (hc == cc && hc == user && bc == 0) {bc=karotz1;suivant=0;karotz.tts.start("Je joue en bas au milieu.", "fr", verification);}
		else if (hd == cd && hd == user && bd == 0) {bd=karotz1;suivant=0;karotz.tts.start("Je joue en bas à droite.", "fr", verification);}
		else if (hg == cc && hg == user && bd == 0) {bd=karotz1;suivant=0;karotz.tts.start("Je joue en bas à droite.", "fr", verification);}
		else if (hd == cc && hd == user && bg == 0) {bg=karotz1;suivant=0;karotz.tts.start("Je joue en bas à gauche.", "fr", verification);}

		else if (hd == hc && hd == user && hg == 0) {hg=karotz1;suivant=0;karotz.tts.start("Je joue en haut à gauche.", "fr", verification);}
		else if (cd == cc && cd == user && cg == 0) {cg=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à gauche.", "fr", verification);}
		else if (bd == bc && bd == user && bg == 0) {bg=karotz1;suivant=0;karotz.tts.start("Je joue en bas à gauche.", "fr", verification);}
		else if (bg == cg && bg == user && hg == 0) {hg=karotz1;suivant=0;karotz.tts.start("Je joue en haut à gauche.", "fr", verification);}
		else if (bc == cc && bc == user && hc == 0) {hc=karotz1;suivant=0;karotz.tts.start("Je joue en haut au milieu.", "fr", verification);}
		else if (bd == cd && bd == user && hd == 0) {hd=karotz1;suivant=0;karotz.tts.start("Je joue en haut à droite.", "fr", verification);}
		else if (bd == cc && bd == user && hg == 0) {hg=karotz1;suivant=0;karotz.tts.start("Je joue en haut à gauche.", "fr", verification);}
		else if (bg == cc && bg == user && hd == 0) {hd=karotz1;suivant=0;karotz.tts.start("Je joue en haut à droite.", "fr", verification);}

		else if (hg == hd && hg == user && hc == 0) {hc=karotz1;suivant=0;karotz.tts.start("Je joue en haut au milieu.", "fr", verification);}
		else if (cg == cd && cg == user && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}
		else if (bg == bd && bg == user && bc == 0) {bc=karotz1;suivant=0;karotz.tts.start("Je joue en bas au milieu.", "fr", verification);}
		else if (hg == bg && hg == user && cg == 0) {cg=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à gauche.", "fr", verification);}
		else if (hc == bc && hc == user && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}
		else if (hd == bd && hd == user && cd == 0) {cd=karotz1;suivant=0;karotz.tts.start("Je joue au milieu à droite.", "fr", verification);}
		else if (hg == bd && hg == user && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}
		else if (hd == bg && hd == user && cc == 0) {cc=karotz1;suivant=0;karotz.tts.start("Je joue au centre.", "fr", verification);}

		else {log("++++++++++++++++++++++++++++++++++++coucou : "+suivant);suivant=2;karotzReflexion();}
			}
else if (suivant == 2){
log("++++++++++++++++++++++++++++++++++++ok : "+suivant);
var rand = Math.round(Math.random()*9);
switch (rand) {
  case 1:
    if (hg == 0) {hg = karotz1;karotz.tts.start("Je joue en haut à gauche.", "fr", verification);}
	else {karotzReflexion();}
  break;
  case 2:
    if (hc == 0) {hc = karotz1;karotz.tts.start("Je joue en haut au milieu.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 3:
   if (hd == 0) {hd = karotz1;karotz.tts.start("Je joue en haut à droite.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 4:
    if (cg == 0) {cg = karotz1;karotz.tts.start("Je joue au milieu à gauche.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 5:
    if (cc == 0) {cc = karotz1;karotz.tts.start("Je joue au centre.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 6:
    if (cd == 0) {cd = karotz1;karotz.tts.start("Je joue au milieu à droite.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 7:
    if (bg == 0) {bg = karotz1;karotz.tts.start("Je joue en bas à gauche.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 8:
    if (bc == 0) {bc = karotz1;karotz.tts.start("Je joue en bas au milieu.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 9:
    if (bd == 0) {bd = karotz1;karotz.tts.start("Je joue en bas à droite.", "fr", verification);}
	else {karotzReflexion();}
  break;

  case 10:
   karotz.tts.start("Erreur nombre dépassé", "fr", exitFunction);
	
  break;

  default:
karotz.tts.start("Erreur "+alea, "fr", exitFunction);
}}}
return true;
}
var verification = function(event) {
log("--------------------------------------------------6");
		if((event == "CANCELLED") || (event == "TERMINATED")) {
log("--------------------------------------------------7");
		if (hg == hc && hc == hd && hg == karotz1) {karotz.tts.start("J'ai gagné", "fr", exitFunction);}
		else if (cg == cc && cc == cd && cg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (bg == bc && bc == bd && bg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hg == cg && cg == bg && hg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hc == cc && cc == bc && hc == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hd == cd && cd == bd && hd == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hg == cc && cc == bd && hc == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hd == cc && cc == bg && hd == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (hg == hc && hc == hd && hg == karotz1) {karotz.tts.start("J'ai gagné.", "fr", exitFunction);}
		else if (cg == cc && cc == cd && cg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (bg == bc && bc == bd && bg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg == cg && cg == bg && hg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hc == cc && cc == bc && hc == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hd == cd && cd == bd && hd == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg == cc && cc == bd && hc == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hd == cc && cc == bg && hd == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg == hc && hc == hd && hg == user) {karotz.tts.start("tu as gagné.", "fr", exitFunction);}
		else if (hg != 0 && hc != 0 && hd != 0 && cg != 0 && cc != 0 && cd != 0 && bg != 0 && bc != 0 && bd != 0) {karotz.tts.start("égalité personne n'a gagné.", "fr", exitFunction);}
		else {suivant=0;karotz.asr.string(dico,"fr",asrResult);}
}}
var exitFunction = function(event) {
log("--------------------------------------------------8");
	if((event == "CANCELLED") || (event == "TERMINATED")){
log("--------------------------------------------------9");
	karotz.tts.stop();
	exit();
	}}
		
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
