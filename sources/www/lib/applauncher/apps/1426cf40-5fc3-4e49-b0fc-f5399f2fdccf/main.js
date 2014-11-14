include("util.js");
include("tts2.js");

// integration vitesse-ton pour la voix du lapin

var rate = "x-slow";//ou "slow" ou "medium" ou "fast" ou "x-fast"
var pitch = "x-high";// ou x-low ou medium
var deb_prosody = '<prosody rate="' + rate + '" pitch="' + pitch + '">';
var fin_prosody = '</prosody>';
var je_suis_en_pause="non";



// regroupement des appels et liens associes dans un tableau

var appels_radio_site= new Array();
var liens_radio_site= new Array();


var appels_radio= new Array();
var liens_radio= new Array();

//declaration des radios et liens associes en local

//liens_radio_site[1]="http://www.shinsen-radio.org/listen.m3u";
//appels_radio_site[1]="J Muzic";

//liens_radio_site[2]="http://listen.radionomy.com/beatles-on-line.m3u";
//appels_radio_site[2]="Beeteulsss";

//declaration des radios et liens associes à partir du screen.xml

appels_radio_site[0]=params[instanceName].appel_radio1;
liens_radio_site[0]=params[instanceName].lien_radio1;

appels_radio_site[1]=params[instanceName].appel_radio2;
liens_radio_site[1]=params[instanceName].lien_radio2;

appels_radio_site[2]=params[instanceName].appel_radio3;
liens_radio_site[2]=params[instanceName].lien_radio3;

appels_radio_site[3]=params[instanceName].appel_radio4;
liens_radio_site[3]=params[instanceName].lien_radio4;

appels_radio_site[4]=params[instanceName].appel_radio5;
liens_radio_site[4]=params[instanceName].lien_radio5;

appels_radio_site[5]=params[instanceName].appel_radio6;
liens_radio_site[5]=params[instanceName].lien_radio6;

appels_radio_site[6]=params[instanceName].appel_radio7;
liens_radio_site[6]=params[instanceName].lien_radio7;

appels_radio_site[7]=params[instanceName].appel_radio8;
liens_radio_site[7]=params[instanceName].lien_radio8;

appels_radio_site[8]=params[instanceName].appel_radio9;
liens_radio_site[8]=params[instanceName].lien_radio9;

appels_radio_site[9]=params[instanceName].appel_radio10;
liens_radio_site[9]=params[instanceName].lien_radio10;

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//récupération des adresses liens radio et appel radio modifié sur la page de paramétrage
var j=0;

for (i=0; i<appels_radio_site.length; i++){
	
	if((appels_radio_site[i]=="nom radio") || (liens_radio_site[i]=="http://________.m3u"))
	{	

	}
	else
	{
	appels_radio[j]=appels_radio_site[i];
	liens_radio[j]=liens_radio_site[i];
	log(appels_radio[j]+" "+liens_radio[j]+" "+j);
	j=j+1;
	}
}

var karotz_ip="localhost";


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction permettant de lancer l'écoute de la radio choisie

var lancement_radio=function(num){
var x=1;
karotz.button.addListener(button_radio_Listener);
karotz.multimedia.play(liens_radio[num],function(event){
		if(x==2){
		exitFunction();
		}
		});
monping();
couleur();
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction permettant de choisir la radio à écouter grâce à la commande vocale

var radio=function(appels,liens){

var grammaire_radio="stop|liste";
var liste="Liste des radio";

karotz.tts.start(deb_prosody+"Quelle radio souétez vou écouter ?"+fin_prosody,"fr",function(event){
if((event=="CANCELED")||(event=="TERMINATED")){

	for (i=0; i<appels.length; i++){
	

	grammaire_radio=grammaire_radio+"|"+appels[i];
	liste=liste+". "+appels[i];
	}
	log("liste: "+liste);
	log("grammaire: "+grammaire_radio);

	karotz.asr.string(grammaire_radio,"fr-FR",

function(asrResult){

	jai_entendu=asrResult.text;
	log("radio entendu"+asrResult.text);

	var confiance=asrResult.confident;

	var num_radio=radio_reconnu(appels,jai_entendu,confiance);
	
	
	if(jai_entendu=="liste"){

	karotz.tts.start(deb_prosody+liste+fin_prosody,"fr",function(event){
		if((event=="CANCELED")||(event=="TERMINATED")){
		radio(appels,liens);
		}
	
	
	});
	}
				
	if(jai_entendu=="stop"){exitFunction();}
	
	if(num_radio==-1) 
	
	karotz.tts.start(deb_prosody+"Je n'ai pas bien compris. Pour avoir la liste des radios installé, dite liste. Pour arrêter, dite stop"+fin_prosody,"fr",function(event){
		if((event=="CANCELED")||(event=="TERMINATED")){
		radio(appels,liens);
		}
		});
		
	else 
	
	karotz.tts.start(deb_prosody+"Je lance la radio "+appels[num_radio]+"."+fin_prosody,"fr",function(event){
		if((event=="CANCELED")||(event=="TERMINATED")){

		lancement_radio(num_radio);
		}
		});
			
});
}
});
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exit function
var exitFunction=function(){
log("exit");
karotz.tts.stop();
karotz.multimedia.stop();
karotz.tts.start(deb_prosody+"Merci d'avoir écouté radio Karotz !"+fin_prosody,"fr",function(event){

if((event=="CANCELED")||(event=="TERMINATED")) {

exit()}});
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//On Connect

var onKarotzConnect = function(data) {
karotz.button.addListener(button_Listener);
karotz.tts.start(deb_prosody+"Bienvenu sur radio Karotz !"+fin_prosody,"fr",function(event){

if((event=="CANCELED")||(event=="TERMINATED"))

radio(appels_radio,liens_radio); 

});


}


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
