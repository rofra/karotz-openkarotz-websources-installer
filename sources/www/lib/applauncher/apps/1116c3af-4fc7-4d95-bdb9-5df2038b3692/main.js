// *************************
//  ** USB Player for Karotz  **
// *************************

include("util.js");
include("language.js");

var karotz_ip="localhost";
//var karotz_ip="192.168.1.16";
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

var playing = 0;
var looping=1;
var albumindex = 0;
var album=new Array();
var context="folder";
var listtype="";
var str_Startup="";

var debuglog = function(string) {
   var d = new Date();
   var hh = "" + d.getHours();
   var mm = d.getMinutes();
   if (mm < 10) { mm = "0" + mm; }
   hh = hh + 'h' + mm + " : ";
   log(hh + string);
   return true
}

var repeatmanager=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")) { 
	if (looping==1) {
       looping=0; 
       karotz.multimedia.play("mode::norepeat");
		} else {
       looping=1; 
       karotz.multimedia.play("mode::repeat");
		}
	}
	return true;
}

// Check if Bouton  is dbl clicked then stop Music and Quit.
// If Button is clicked pause and start recognition
var buttonListener = function(event) {
    debuglog("in ButtonListener, event "+event+" context is "+context+" ,playing is "+playing);
    if (event == "DOUBLE") {
	    debuglog("Double clic detected, stopping song and exiting");
		karotz.multimedia.stop(function(event){karotz.multimedia.play("lock::yes",function(event){exit()});});
    }
	
	if (event == "SIMPLE") {
	// If we are playing a song, the button is used to pause and resume playing
	if (context=="song") {
	 if (playing==1) {
	 debuglog("Pause current song");
	  playing=0;
	  karotz.multimedia.pause();
	  debuglog("Setting led to pause");
	  karotz.led.light(BLACK);
	  karotz.led.pulse(PINK, 500, -1, function(event){return true});
	 } else {
	 //resume playing
	 debuglog("Resume Playing current song");
	 playing=1;
	 debuglog("Setting led back to play");
	 karotz.led.light(PINK);
	 karotz.multimedia.resume();
	 }
	}
	// if we are choosing an album, the button is used to select and play the album
	if (context=="folder"){
	 debuglog("Validation of:"+album[albumindex]);
	 playing=1;
	 debuglog("Setting context to song");
	 context="song";
	 debuglog("Setting led to play (pink)");
	 karotz.led.light(PINK);
	 debuglog("Now playing"+listtype+":"+album[albumindex]);
	 karotz.multimedia.play(listtype+"::"+album[albumindex],mediaListener);
	}
	
	}
	//if button is press a long time,  and in song context back to album list
	if (event == "LONG_START") {
	if (context=="song") {
		debuglog("Back to "+listtype+" choice, so setting led and context");
		karotz.led.light(RED);
		karotz.led.pulse(BLUE, 1000, -1, function(event){return true});
		context="folder";
		debuglog("Stopping song playing");
		karotz.multimedia.stop(function(event){return true});
		debuglog("Ask for "+listtype+" choice");
		karotz.tts.start(str_Startup,tts_language,function(event){return true});
		} else 	{ 
		debuglog("Long start in folder context mean changing repeat mode");
		karotz.tts.stop();
			if (looping==1) { 				
					debuglog("Repeat mode is set to off");
					karotz.tts.start(str_loopoff,tts_language,repeatmanager);
					}
					else 
					{
					debuglog("Repeat mode is set to on");
					karotz.tts.start(str_loopon,tts_language,repeatmanager);}
		}		
	}
    return true;
}

// If left ear is used, goto previous Song 
// If right ear is used goto next Song
var earsListener = function(event,step,len) { 
debuglog("in earsListener, context is "+context+" event is "+event+".");	
  if (context=="song") {
    if ((event.indexOf("START_LEFT") >= 0)&&(playing==1))
    { 
	debuglog("Playing next song");
       karotz.multimedia.next(mediaListener);
    } 
	 if ((event.indexOf("START_RIGHT") >= 0)&&(playing==1))
    { 
	debuglog("Playing previous song");
       karotz.multimedia.previous(mediaListener);
    } 
	}
	
	if (context=="folder") {
	if (event.indexOf("START_") >= 0) {
	  debuglog("Stopping tts if needed");
	   karotz.tts.stop(function(event){return true});
	}
	 if (event.indexOf("START_RIGHT") >= 0) {
	if (albumindex<album.length-1) {albumindex++} else {albumindex=0}
	debuglog(listtype+" "+album[albumindex]+" is selected");
	karotz.tts.start(album[albumindex],tts_language,function(event){return true});
	}
	 if (event.indexOf("START_LEFT") >= 0) {
	if (albumindex>0) {albumindex=albumindex-1} else {albumindex=album.length-1}
	debuglog(listtype+" "+album[albumindex]+" is selected");
	karotz.tts.start(album[albumindex],tts_language,function(event){return true});
	}
	}
	
    return true; 
} 


var mediaListener=function(event) {
debuglog("In mediaListener, event is:"+event+" playing status is "+playing);
if (event=="TERMINATED"){
 if (playing==1) {
 debuglog("End of mp3 - have to reselect an "+listtype);
 context="folder";
 debuglog("Led back to "+listtype+" selection");
 karotz.led.light(RED);
 karotz.led.pulse(BLUE, 1000, -1, function(event){return true});
 }
 
 if (playing==0) debuglog("Pause detected");

}
return true;
}

var listItems=function(folderList){
	debuglog("In listItems function");
		if (folderList.lastIndexOf(":")!=0) {
		folderList=folderList.substr(0,folderList.lastIndexOf(":"));
		}
		if (folderList!="") {
			debuglog(listtype+" list:"+folderList);
			album=folderList.split(":");
			debuglog(listtype+ "list is not empty, propose to play with ears");
			karotz.tts.start(str_Startup,tts_language,function(event){return true}); 	 
	      } else {
			debuglog("Nothing found in the key, ask to insert a key and exit");
			karotz.tts.start(str_Error,tts_language,function(event){if (event=="TERMINATED"){exit()} return true;}); 
	     }
}

var onKarotzConnect = function(data) {
	debuglog("--------------------------------");
	debuglog("| Welcome to Miniplay V 2.0.8   |");
	debuglog("|       Vote for my App !!      |");
	debuglog("|                               |");
	debuglog(" --------------------------------");
 	// Ping regulary (usefull for Radio Playlist)
	setTimeout(300000, function(){ debuglog("ping"); karotz.ping(); return true; });
	//Play with Led as icon
	debuglog("Led is like the icon");
	karotz.led.light(RED);
	karotz.led.pulse(BLUE, 1000, -1, function(event){return true});
	//Add listeners for button and ears
	debuglog("Setting listeners");
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);
	debuglog("Multimedia unlocked");
	karotz.multimedia.play("lock::no");
	debuglog("repeat mode enabled");
	karotz.multimedia.play("mode::repeat");
	//Setting values depending of screen.xml
	if (karotz_ip == 'localhost') { listtype=params[instanceName].mytype;} else { listtype="playlist" }
	debuglog("List selected in screen.xml is "+listtype);
	str_Startup=str_FolderStartup;
	if (listtype=="artist") { str_Startup=str_ArtistStartup }
	if (listtype=="genre") { str_Startup=str_GenreStartup }
	//Get folder list on  key and put in in album	
	switch(listtype) {
	case "dir":
		karotz.multimedia.folder(listItems);
		break;
	case "artist":
		karotz.multimedia.artist(listItems);
		break;
	case "genre":
		karotz.multimedia.genre(listItems);
		break;
	case "playlist":
		karotz.multimedia.playlist(listItems);
		break;
	}
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect,{}); 