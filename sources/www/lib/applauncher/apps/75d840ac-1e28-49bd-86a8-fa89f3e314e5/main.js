include("util.js");

var token;

var karotz_ip="localhost";
//var karotz_ip="192.168.1.10"

var base_repertoire = "http://karotz.mikey-life.com/horloge/sons/";
	
var base_repertoire_tmp = "http://karotz.mikey-life.com/horloge/temp/";

var mp3_intro = "signature.mp3";

var stopApp = function(event) {
	
	if(event == "TERMINATED" || event=="CANCELLED" || event=="CANCELLED") {
		log("Application stoped");
		exit();
	}
}

var PlayFinal = function(event) {
	
	if(event == "TERMINATED" || event=="CANCELLED") {
		
		karotz.led.fade('0000FF', 1500);
		
		karotz.multimedia.stop();
		
		karotz.multimedia.play(base_repertoire + mp3_intro,  function(event) {stopApp(event)});

	}
}

var Horloge = function(event) {
	
	if(event == "TERMINATED" || event=="CANCELLED") {
		
		karotz.multimedia.stop();
	
		karotz.led.pulse('75FF00', 100, -1);
		
		token = params[instanceName].token;
		
		var url = "http://karotz.mikey-life.com/horloge/horloge_javascript.php?token=" + token;
		
		var mp3_final = http.get(url); 
		
		log("received : " + mp3_final);
		
		karotz.multimedia.play(mp3_final,  function(event) {PlayFinal(event)});
	
	}
			
}

var PlayIntro = function(data) { 

	karotz.led.fade('0000FF', 1500);
	
	karotz.multimedia.play(base_repertoire + mp3_intro,  function(event) {Horloge(event)});
			
}

karotz.connectAndStart(karotz_ip, 9123, PlayIntro, {});