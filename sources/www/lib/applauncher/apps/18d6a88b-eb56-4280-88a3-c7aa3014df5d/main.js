include("util.js");
include("tinyxmldom.js");

var BLACK       ="000000"; 
var BLUE        ="0000FF"; 
var CYAN        ="00FF9F"; 
var GREEN       ="00FF00"; 
var ORANGE      ="FFA500"; 
var PINK        ="FFCFAF"; 
var PURPLE      ="9F00FF"; 
var RED         ="FF0000"; 
var YELLOW      ="75FF00"; 
var WHITE       ="4FFF68";

var grammar_language="fr-FR";
var tts_language="fr";
var str_dep1="Indiquez le nom de la station de daipart de Vélille";
var str_dep2="Indiquez le nom de la seconde station de daipart de Vélille, ou stop pour passer";
var str_fin3="Indiquer le nom de la station d'arrivai de Vélille, ou stop pour passer";
var str_Notfound="Je n'ai pas reconnu le nom de la station. ";
var str_nosound="Je n'ai pas entendu le nom de la station. ";
var str_critical="L'application a rencontrai un probleme critique. Veuillez relancer";
var msg_fin=". Bon trajet en vailille et a bientot"

var karotz_ip="localhost";
//var karotz_ip="192.168.1.12";
var origine1={};
var origine2={};
var dest={};
//risk of no vlill when coming.
var limit=3;

//Get the list of the VLille stations 
var XmlStation=http.get("http://www.vlille.fr/stations/xml-stations.aspx");
var StationDom=new XMLDoc(XmlStation);
var StationTree=StationDom.docNode;
//grammar construction from station list. Stop is added to permit to bypass ASR
var grammar=StationTree.getElements("marker")[0].getAttribute("name");
for (i=1; i<StationTree.getElements("marker").length; i++){ 
grammar=grammar+"|"+StationTree.getElements("marker")[i].getAttribute("name")
}
grammar=grammar+"|"+"Stop";

//Give all infos about station 
function InfoStation(station) {
 log("found station:"+station.name);
 for (i=0; i<StationTree.getElements("marker").length; i++){ 
   if (StationTree.getElements("marker")[i].getAttribute("name")==station.name) {
    var XmlData = http.get("http://www.vlille.fr/stations/xml-station.aspx?borne="+StationTree.getElements("marker")[i].getAttribute("id"));
	var objDom = new XMLDoc(XmlData);
	station.id=i+1;
	station.address=objDom.selectNode("/adress").getText();
	station.bikes=objDom.selectNode("/bikes").getText();
	station.attachs=objDom.selectNode("/attachs").getText();
	log("Station:"+station.name+" vlill dispo: "+station.bikes+" emplacements dispos "+station.attachs);
	}
 }
}

origine1.name=params[instanceName].origine1
origine2.name=params[instanceName].origine2
dest.name=params[instanceName].dest
//origine1.name="Bois Blancs";
//origine2.name="None";
//dest.name="Rihour";

var ASRfin3Listener = function(asrResult) {
     log("Semantic:"+asrResult.semantic);
	 log("Text:"+asrResult.text);
	 switch(asrResult.semantic)
	 {
	 // Check if only a pause is selected ...
	 case "No result before the no-input timeout": 
	 karotz.tts.start(str_nosound+str_fin3,tts_language,ttsfin3Listener);
	 break;
	 //Check the result of ASR checking if folder to ASR transform did'nt generate error
	 case "The grammar source compilation failed": 
		karotz.led.light(RED);
		log("Error in grammar");
		karotz.tts.start(str_critical,tts_language,ttsExitFunction);
		break; 
	 default:
				dest.name=asrResult.text;
				if (dest.name=="Stop") dest.name="None";
				if ((dest.name=="<nomatch>")||(dest.name=="")){ 
					karotz.led.light(BLUE); 
					karotz.tts.start(str_Notfound+str_dep2,tts_language,ttsfin3Listener);} 
				else {
				        if (dest.name!="None") InfoStation(dest);
						information();
					}	
			break;
	}
}

//after  TTS finished, launch Voice Recognition
var ttsfin3Listener=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")){
//Set Led to Orange, Symbol of Voice Recognition
karotz.led.light(ORANGE);
karotz.asr.string(grammar, grammar_language, ASRfin3Listener);
}
return true;
}

var ASRdep2Listener = function(asrResult) {
     log("Semantic:"+asrResult.semantic);
	 log("Text:"+asrResult.text);
	 switch(asrResult.semantic)
	 {
	 // Check if only a pause is selected ...
	 case "No result before the no-input timeout": 
	 karotz.tts.start(str_nosound+str_dep2,tts_language,ttsdep2Listener);
	 break;
	 //Check the result of ASR checking if folder to ASR transform did'nt generate error
	 case "The grammar source compilation failed": 
		karotz.led.light(RED);
		log("Error in grammar");
		karotz.tts.start(str_critical,tts_language,ttsExitFunction);
		break; 
	 default:
				origine2.name=asrResult.text;
				if (origine2.name=="Stop") origine2.name="None";
				if ((origine2.name=="<nomatch>")||(origine2.name=="")){ 
					karotz.led.light(BLUE); 
					karotz.tts.start(str_Notfound+str_dep2,tts_language,ttsdep2Listener);} 
				else {
				       if (origine2.name!="None") InfoStation(origine2);
						fin3();
					}	
			break;
	}
}

//after  TTS finished, launch Voice Recognition
var ttsdep2Listener=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")){
//Set Led to Orange, Symbol of Voice Recognition
karotz.led.light(ORANGE);
karotz.asr.string(grammar, grammar_language, ASRdep2Listener);
}
return true;
}

var ASRdep1Listener = function(asrResult) {
     log("Semantic:"+asrResult.semantic);
	 log("Text:"+asrResult.text);
	 switch(asrResult.semantic)
	 {
	 // Check if only a pause is selected ...
	 case "No result before the no-input timeout": 
	 karotz.tts.start(str_nosound+str_dep1,tts_language,ttsdep1Listener);
	 break;
	 //Check the result of ASR checking if folder to ASR transform did'nt generate error
	 case "The grammar source compilation failed": 
		karotz.led.light(RED);
		log("Error in grammar");
		karotz.tts.start(str_critical,tts_language,ttsExitFunction);
		break; 
	 default:
				origine1.name=asrResult.text;
				if (origine1.name=="Stop") origine1.name="None";
				if ((origine1.name=="<nomatch>")||(origine1.name=="")){ 
					karotz.led.light(BLUE); 
					karotz.tts.start(str_Notfound+str_dep1,tts_language,ttsdep1Listener);} 
				else {
				        if (origine1.name!="None") InfoStation(origine1);
						dep2();
					}	
			break;
	}
}

//after  TTS finished, launch Voice Recognition
var ttsdep1Listener=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")){
//Set Led to Orange, Symbol of Voice Recognition
karotz.led.light(ORANGE);
karotz.asr.string(grammar, grammar_language, ASRdep1Listener);
}
return true;
}

var ttsExitFunction=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")) {
 exit();
}
}

function information() {

if (origine1.bikes==0) {
    origine1.sentence="Attention, aucun Vélo à la station "+origine1.name+". "; } else {
    if (origine1.bikes<=limit) origine1.sentence="Attention, plu que "+origine1.bikes+" Vélos à la station "+origine1.name+". ";
   }
if (origine1.bikes>limit) origine1.sentence="Il y a "+origine1.bikes+" Vélos à la station "+origine1.name+". ";
if (origine2.name=="None") { 
 origine2.sentence="";
} else {
if (origine2.bikes==0) {
    origine2.sentence="Attention, aucun Vélo à la station "+origine2.name+". "; } else {
   if (origine2.bikes<=limit) origine2.sentence="Attention, plu que "+origine2.bikes+" Vélos à la station "+origine2.name+". ";
 } 
if (origine2.bikes>limit) origine2.sentence="Il y a "+origine2.bikes+" Vélos à la station "+origine2.name+". ";
}
if (dest.name=="None") { 
 dest.sentence="";
} else {
  if (dest.attachs==0) {
      dest.sentence="Attention, plu d'emplacements Vélille libres à la station "+dest.name+". ";} else {
      if (dest.attachs<=limit) dest.sentence="Attention, plu que "+dest.attachs+" emplacements libres à la station "+dest.name;
	}
  if (dest.attachs>limit) dest.sentence="Il y a "+dest.attachs+" emplacements libres à la station "+dest.name;
 }
var bikeinfo=origine1.sentence+origine2.sentence+dest.sentence+msg_fin;
while (bikeinfo != (bikeinfo = bikeinfo.replace("Bd ", "Boulevard ")));
while (bikeinfo != (bikeinfo = bikeinfo.replace("JB ", "Jean Baptiste ")));
while (bikeinfo != (bikeinfo = bikeinfo.replace("N.D. ", "Notre Dame ")));
while (bikeinfo != (bikeinfo = bikeinfo.replace("St ", "Saint ")));
karotz.led.light(RED);
karotz.tts.start(bikeinfo,tts_language,ttsExitFunction);
}

function fin3() {
 if (dest.name=="Vocal") {
      karotz.tts.start(str_fin3,tts_language,ttsfin3Listener);
	} else {
	if (dest.name!="None") InfoStation(dest);
	information();
	}
}

function dep2() {
 if (origine2.name=="Vocal") {
     karotz.tts.start(str_dep2,tts_language,ttsdep2Listener);
	} else {
	if (origine2.dest!="None") InfoStation(origine2);
	fin3();
	}
}

function dep1() {
 if (origine1.name=="Vocal") {
     karotz.tts.start(str_dep1,tts_language,ttsdep1Listener);
	} else {
	 InfoStation(origine1);
	 dep2();
	}
}

var onKarotzConnect = function(data) {
    karotz.led.light(RED);
	dep1();
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});