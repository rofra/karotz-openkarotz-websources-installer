//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// fonction on connect

karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var button_Listener = function(event) {
if (event == "LONG_START"){

	if (je_suis_en_pause=="non"){
	je_suis_en_pause = "oui";
	karotz.multimedia.pause();
	}
	
karotz.asr.string("stop|choix","fr-FR",function(asrResult){

	var jai_entendu_choix=asrResult.text;
	var confiance_choix=asrResult.confident;
	log("j'ai entendu "+jai_entendu_choix);
	
	if(jai_entendu_choix=="<nomatch>"){
	je_suis_en_pause = "non";
	karotz.multimedia.resume();
	couleur();
	monping();
	}
		
	else if ((jai_entendu_choix=="stop") && (confiance_choix>"30")){
	
	karotz.multimedia.stop();
	exitFunction();
	}
	else if ((jai_entendu_choix=="choix") && (confiance_choix>"20")){
	
	karotz.multimedia.stop();
	radio(appels_radio,liens_radio);
		}
	});}

else if (event=="DOUBLE"){

exitFunction();
}
	return true;		
}


var button_radio_Listener = function(event) {

if ((event == "SIMPLE")&& (je_suis_en_pause == "non")) {
je_suis_en_pause = "oui";
karotz.multimedia.pause();
karotz.tts.start(deb_prosody+"La pause s'impose !"+fin_prosody,"fr",function(event){
if ((event == "CANCEL")|| (event == "TERMINATED")) {
}
});
}

else if ((event == "SIMPLE")&& (je_suis_en_pause == "oui")) {
karotz.tts.start(deb_prosody+"C'est repartiiiii !"+fin_prosody,"fr",function(event){
if ((event == "CANCEL")|| (event == "TERMINATED")) {
je_suis_en_pause = "non";
karotz.multimedia.resume();
}
});
}


return true;
 
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction reconnaissance nom radio

radio_reconnu= function(appels,jai_entendu,confiance){

var retour=-1;

for (i=0; i<appels.length; i++){

	if((jai_entendu==appels[i])&&(confiance>40)){
	
	retour=i;

	}

}

return retour;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction ping pour radio et lecture
var monping = function(event) {
ping();
log("ping");
setTimeout(600000, function() { monping(); return true; });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction couleur pour modifier couleur led

var couleur=function(){

karotz.led.fade("FF0000", 10000, attendre_fin_lumiere_rouge);
log("rentre")
}

var attendre_fin_lumiere_rouge=function(event){

if((event=="CANCELED")||(event=="TERMINATED")) {
karotz.led.fade("993399", 10000, attendre_fin_lumiere_violet);
}
return true;
}

var attendre_fin_lumiere_violet=function(event){

if((event=="CANCELED")||(event=="TERMINATED")) {
karotz.led.fade("0000FF", 10000, attendre_fin_lumiere_bleu);
}
return true;
}


var attendre_fin_lumiere_bleu=function(event){

if((event=="CANCELED")||(event=="TERMINATED")) {
karotz.led.fade("FFCC66", 10000, attendre_fin_lumiere_jaune);
}
return true;
}

var attendre_fin_lumiere_jaune=function(event){

if((event=="CANCELED")||(event=="TERMINATED")) {
karotz.led.fade("FF0000", 10000, attendre_fin_lumiere_rouge);
}
return true;
log("sort")
}



var exitFunction_radio=function(event){
if((event=="TERMINATED")&&(je_suis_en_pause=="non")) {
exitFunction();
}
return true;
}