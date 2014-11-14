// *************************
//  ** USB Player for Karotz  **
// *************************

include("util.js");

//var karotz_ip="localhost";
var karotz_ip="localhost";
var grammar = "no";

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
//R G B -> 0.3*R  G  0.4*B 

var playing = 1;
var voicerec = 0;
var usbkeyplayList ="";
var usbkeyfolderList="";
var str_Startup="Tu veux ecouter quoi ?";
var str_Error="La lecture des répertoires sur la clé u s b est en echec. Vérifiez qu'il n'y a pas de sous dossiers ou de caractères spéciaux";
var str_Notfound="Album non trouvé, On essaye de nouveau !";
var str_Nosound="Je n'ai rien entendu ! Tu peux parler plus fort ?"
var grammar_language="fr-FR";
var tts_language="fr";

//Get Radio list from Web interface
try {
var usbkeyplayList=params[instanceName].usbplaylist;
} catch(err){
usbkeyplayList="Radio Zen:Party 80";
var karotz_ip="192.168.1.12";
}
while (usbkeyplayList != (usbkeyplayList = usbkeyplayList.replace(":", " | ")));
if (usbkeyplayList=="") {usbkeyplayList="unknown";}
// Check if Bouton  is dbl clicked then stop Music and Quit.
// If Button is clicked pause and start recognition
var buttonListener = function(event) {
    if (event == "DOUBLE") {
	    karotz.multimedia.stop(function(event){return true}); 
        exit();
    }
	
	if (event == "LONG_START") {
	  karotz.multimedia.stop(function(event){return true});
	  voicerec=1;
	  karotz.asr.string(grammar, grammar_language,  ASRListener);
	}
	// pause playing and pulse led
	if (event == "SIMPLE") {
	 if (playing==1) {
	  playing=0;
	  karotz.multimedia.pause();
	  karotz.led.light(BLACK);
	  karotz.led.pulse(PINK, 500, -1, function(event){return true});
	 } else {
	 //resume playing
	 playing=1;
	 karotz.led.light(PINK);
	 karotz.multimedia.resume();
	 }
	}
    return true;

}

// If left ear is used, goto previous Song 
// If right ear is used goto next Song
var earsListener = function(event,step,len) { 
    if ((event.indexOf("START_LEFT") >= 0)&&(playing==1))
    { 
	 log("Next Song");
       karotz.multimedia.next();
    } 
	 if ((event.indexOf("START_RIGHT") >= 0)&&(playing==1))
    { 
	  log("Previous Song");
       karotz.multimedia.previous();
    } 
    return true; 
} 

//after  TTS finished, launch Voice Recognition
var ttsListener=function(event) {
if (event=="TERMINATED"){
//Set Led to Orange, Symbol of Voice Recognition
karotz.led.light(ORANGE);
//Convert FolderList into Voice recognition Grammar 
karotz.multimedia.folder(function(folderList){
		log("FolderList:"+folderList);
		while (folderList != (folderList = folderList.replace(":", " | ")));
		usbkeyfolderList=folderList;
});

//Compil Folder and Play lists in grammar.
grammar=usbkeyfolderList+usbkeyplayList;
log("Grammar:"+grammar);
karotz.asr.string(grammar, grammar_language, ASRListener);
}
return true;
}

//Check result of Voice Recognition, and play Album.
var ASRListener = function(asrResult) {
     log("Semantic:"+asrResult.semantic);
	 log("Text:"+asrResult.text);
	 switch(asrResult.semantic)
	 {
	 // Check if only a pause is selected ...
	 case "No result before the no-input timeout": 
	   karotz.led.light(YELLOW); 
	   karotz.tts.start(str_Nosound,tts_language,ttsListener);
	 break;
	 //Check the result of ASR checking if folder to ASR transform did'nt generate error
	 case "The grammar source compilation failed": 
		karotz.led.light(RED);
		karotz.tts.start(str_Error,tts_language,ttsStructNook);
		break;
	 default:
				var album = asrResult.text;
				log("Result Reco:"+album);
				if ((album=="<nomatch>")||(album=="")){ 
					karotz.led.light(BLUE); 
					karotz.tts.start(str_Notfound,tts_language,ttsListener);} 
				else {
						//Set LED to pink
						karotz.led.light(PINK);
						playing=1;
						karotz.multimedia.stop(function(event){return true});
						voicerec = 0;
							if (usbkeyfolderList.indexOf(album) >= 0) {
									log("Now playing folder:"+album);
									karotz.multimedia.play("dir::"+album,mediaListener);
								} else { 
									log("Now playing playlist:"+album);
									karotz.multimedia.play("/mnt/usbkey/"+album+".m3u"); 
								}
							
							
						}
			break;
	}
}

var mediaListener=function(event) {
if (event=="TERMINATED"){
log("end of mp3");
}
return true;
}

var onKarotzConnect = function(data) {
	 //Set Led to Pink, Symbol of play
     karotz.led.light(PINK);
	 //Add listeners for button and ears
	 karotz.button.addListener(buttonListener);
	 karotz.ears.addListener(earsListener);
	 karotz.multimedia.play("lock::no",mediaListener);
	 // Disable ears during Voice Recognition
	 voicerec=1;
	 // Ping regulary (usefull for Radio Playlist)
	 setTimeout(300000, function(){ log("ping"); karotz.ping(); return true; });
	 // Start tts
     karotz.tts.start(str_Startup,tts_language,ttsListener);  
}

//Stop appli if the structure of folder is not well converted into Voice recognition grammar
var ttsStructNook=function(event) {
if (event=="TERMINATED"){
exit();
}
return true;
}


var toEnd=function(event) {
	if (event=="TERMINATED"){
		karotz.led.light(ORANGE);
		exit();
	}
	return true;
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {}); 