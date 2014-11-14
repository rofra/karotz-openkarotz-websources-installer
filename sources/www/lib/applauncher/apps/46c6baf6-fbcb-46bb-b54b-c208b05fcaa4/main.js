include("util.js");

var karotz_ip="localhost";
//var karotz_ip="192.168.0.15";

var EarsMax=12;
var EarsMin=5;

var LeftEar=0;
var RightEar=0;

listeningColor="2A008B";
YesColor="0000FF";
NoColor="800000";
IdkColor="4DA500";
ProbablyColor="008000";

var Response=0;
var ColorResponse="000000";
var Responses = new Array();

var s0="D'après moi, oui.";
var s1="C'est certain.";
var s2="Oui absolument.";
var s3="Tu peux compter dessus.";
var s4="Sans aucun doute.";
var s5="Trait probable.";
var s6="Oui.";
var s7="C'est bien parti.";

var s8="Essaye plus tard.";
var s9="Je ne sais pas, je ne suis qu'un lapin.";
var s10="Pas d'avis.";
var s11="C'est ton destin.";
var s12="Essaye encore.";
var s13="Une chance sur deux.";
var s14="Repose ta question."

var s15="C'est non !";
var s16="C'est pe probable.";
var s17="Faut pas raiver.";
var s18="N'y compte pas.";
var s19="Impossible.";

Responses.push(s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19);

var buttonListener = function(event) {
    log("Listener - Event : "+event);
	if ((event == "SIMPLE") || (event == "LONG_START") || (event == "LONG_STOP")) {
		beginMove();
    }
	if (event == "DOUBLE") {
        karotz.tts.stop();
		exit();
    }
}

var endFunction=function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		exit();
	}
}

var beginMove=function() {
	log("BeginMove");
	karotz.led.light("000000");
	LeftEar=Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random());
	RightEar=Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random());
	log("Left : "+LeftEar);
	log("Right : "+RightEar);
	karotz.ears.moveRelative(LeftEar,RightEar,endMove);
}

var endMove=function(event) {
	log("endMove");
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		LeftEar=-1*Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random());
		RightEar=-1*Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random());
		log("Left : "+LeftEar);
		log("Right : "+RightEar);
		karotz.ears.moveRelative(LeftEar,RightEar,magicResponse);
		Response=Math.floor(Responses.length*Math.random());
		if (Response<8) ColorResponse=YesColor;
		else if (Response<15) ColorResponse=IdkColor;
		else if (Response<20) ColorResponse=NoColor;
		karotz.led.light(ColorResponse);
	}
}

var magicResponse=function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		log(Responses[Response]);
		karotz.tts.start('<prosody rate="-12%">'+Responses[Response]+'</prosody>',"fr",endFunction);
	}
}

var endPulse=function(event) {
	if (event == "CANCELLED") {
	
	}
	if (event == "TERMINATED") {
		exit();
	}
}

var kWaiting=function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		//log("end kWaiting");
	}
}

var kListening=function() {
	karotz.led.light("000000");
	karotz.led.pulse(listeningColor,1200,15*60*1000,endPulse);
	karotz.tts.start("<prosody rate='-12%'>Quelle est ta question ?</prosody>","fr",kWaiting);
}
	
var onKarotzConnect=function(data) {
	karotz.button.addListener(buttonListener);
	kListening();
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});