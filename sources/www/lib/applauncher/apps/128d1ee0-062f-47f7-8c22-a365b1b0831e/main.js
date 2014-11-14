include("util.js");

var karotz_ip="localhost";
//var karotz_ip="192.168.0.15";

var durationName=params[instanceName].duration;
var duration=0;
if(durationName=="thirty") duration=0.5*60000;
if(durationName=="one") duration=1*60000;
if(durationName=="two") duration=2*60000;
if(durationName=="five") duration=5*60000;

//var duration=30000;
var PulsePeriod=700;

var NoMove=0.25; // Chance de ne pas bouger une oreille ; de 0 à 0,25 on ne bouge pas, de 0,25 à 1 on bouge

//Paramètres de la LED
var NoLED=0.1;		//De 0,0 à 0,1, la LED ne change pas
var LEDPulse=0.35;	//De 0,1 à 0,35, la LED change de couleur en pulsant
var LEDFade=0.85;	//De 0,35 à 0,85, la LED change de couleur en fadeant
var LEDLight=1;		//De 0,8 à 1,0, la LED passe directement à la nouvelle couleur

//var EarsPositions=17; //Nombre de positions d'oreilles existantes
var EarsMin=4;
var EarsMax=25;

var Colors = ["000000","0000FF","00FF9F","00FF00","FFA500","FFCFAF","9F00FF","FF0000","75FF00","4FFF68"];
var NbColors=Colors.length;

var MaxPauseDuration=3500;
var MinPauseDuration=200;
var MaxLEDDuration=4200;
var MinLEDDuration=1400;
var LEDTime=0;


var time = new Date();
var beginTime=0;
var endTime=0;
var pauseTime=0;

var LeftEar=0;
var RightEar=0;
var newLEDColor=Colors[0];
var LEDFunc=0;

var EarsEnded=true;
var LEDEnded=true;

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        exit();
    }
    return true;
}

var isSuperior = function() {
	if(NoMove > Math.random()) return 0;
	else return 1;
}

var sens = function() {
	if(Math.random()>0.5) return 1;
	else return -1;
}

var LEDfunction = function(LEDColor) {
	log("entering LEDfunction with color "+LEDColor);
	LEDFunc=Math.random();
	LEDTime=MinLEDDuration+Math.floor((MaxLEDDuration-MinLEDDuration)*Math.random());
	if(LEDFunc<NoLED) {
		log("NoLED");
		LEDEnded=true;
	}
	else if(LEDFunc<LEDPulse) {
		log("LEDPulse for "+LEDTime+" with period "+PulsePeriod);
		karotz.led.pulse(LEDColor,PulsePeriod,LEDTime,LEDMove);
	}
	else if(LEDFunc<LEDFade) {
		log("LEDFade for "+LEDTime);
		karotz.led.fade(LEDColor,LEDTime,LEDMove);
	}
	else if(LEDFunc<LEDLight) {
		log("LEDLight");
		LEDEnded=true;
		karotz.led.light(LEDColor);
	}
}

var EarsLEDloop = function() {
	var currentTime = new Date();
	if(endTime<currentTime.getTime()) {
		log("Exit");
		exit();
	}
	else {
		LeftEar=Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random())*isSuperior()*sens();
		RightEar=Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random())*isSuperior()*sens();
		newLEDColor=Colors[Math.floor(NbColors*Math.random())];
		pauseTime=Math.floor(Math.random()*(MaxPauseDuration-MinPauseDuration))+MinPauseDuration;
		EarsEnded=false;
		LEDEnded=false;
		setTimeout(pauseTime,function(){
			LEDfunction(newLEDColor);
			karotz.ears.moveRelative(LeftEar,RightEar,earsMove);
		});
	}
}

var LEDMove = function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		LEDEnded=true;
		if(EarsEnded) {
			EarsLEDloop();
		}
	}
}

var earsMove = function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		EarsEnded=true;
		if(LEDEnded) {
			EarsLEDloop();
		}
	}
}

var beginMove=function() {
	LeftEar=Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random())*isSuperior()*sens();
	RightEar=Math.floor(EarsMin+(EarsMax-EarsMin)*Math.random())*isSuperior()*sens();
	newLEDColor=Colors[Math.floor(NbColors*Math.random())];
	pauseTime=Math.floor(Math.random()*(MaxPauseDuration-MinPauseDuration))+MinPauseDuration;
	EarsEnded=false;
	LEDEnded=false;
	setTimeout(pauseTime,function(){
		LEDfunction(newLEDColor);
		karotz.ears.moveRelative(LeftEar,RightEar,earsMove);
		});
}

var onKarotzConnect=function(data) {
    karotz.button.addListener(buttonListener);
	beginTime=time.getTime();
	endTime=beginTime+duration;
	beginMove();
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
