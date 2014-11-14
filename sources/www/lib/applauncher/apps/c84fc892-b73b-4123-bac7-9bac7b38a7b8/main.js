include("util.js");

var app_name = "Flash FM";
var app_version = "1.0.15";
var karotz_ip = 'localhost';
//var karotz_ip = '192.168.3.65';

var ipause = 0;
var BLUE = "0000ff";
var WHITE = "ffffff";
var BLACK = "000000";
var VIOLET = "641e60";
var RED = "ff0000";
var flux = "http://live140.impek.com:8002/";

var buttonListener = function(event) {
	if (event=='SIMPLE')
	{
		if (ipause == 0)
		{
			fPause();
		}
		else
			{
				fLecture();
			}
	}
	else
		{
			karotz.multimedia.stop();
			exit();
		}
	return true;
}

var fPause = function(){
	ipause = 1;
	karotz.led.light(RED);
	karotz.multimedia.stop();
}

var fLecture = function(){
	ipause = 0;
	karotz.led.light(BLUE);
	karotz.led.pulse(VIOLET, 1000, -1);
	karotz.multimedia.play(flux);
}

var EcouterRadio = function(iduree) {
	karotz.led.pulse(VIOLET, 1000, -1);
	karotz.multimedia.play(flux);
	setTimeout(300000, function(){ log("ping"); ping(); return true; });
	
	if (iduree != -1)
	{
		setTimeout(iduree, function(){ karotz.multimedia.stop(); exit(); });
	}
}

var onKarotzConnect = function(data) {
	genStats();
	karotz.button.addListener(buttonListener);
	//var duree = "1";
	var duree = params[instanceName].duree;
	var texte = "";
	karotz.led.fade(BLUE, 1000);

	switch(duree)
	{
		case "1" :
			texte = "pendant 5 minutes";
			iduree = 300000;
			break;
		case "2" :
			texte = "pendant 15 minutes";
			iduree = 900000;
			break;
		case "3" :
			texte = "pendant 30 minutes";
			iduree = 1800000;
			break;
		case "4" :
			texte = "pendant 1 heure";
			iduree = 3600000;
			break;
		case "5" :
			texte = "sans interruption";
			iduree = -1;
			break;
		default :
			texte = "pendant 5 minutes";
			iduree = 300000;
			break;
	}
	
	karotz.tts.start("Ecoute de Flash FM " + texte, "FR", function(event)
								{
									if (event=="TERMINATED")
									{
										EcouterRadio(iduree);
									}
								});
}

var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);
