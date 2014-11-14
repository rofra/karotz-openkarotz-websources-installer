include("util.js");

var karotz_ip="localhost"

var grammar = "1 [minute]| 2 [minutes]| 2 [minute] | 4 [minutes]| 5 [minutes] | 6  [minutes] | 7  [minutes] | 8  [minutes] | 9  [minutes] | 10  [minutes] | 11  [minutes] | 12  [minutes] | 13  [minutes] | 14  [minutes] | 15  [minutes] | 16  [minutes] | 17  [minutes] | 18  [minutes] | 19  [minutes] | 20 [minutes] "; 
var WHITE       ="4FFF68"; 
var BLACK       ="000000"; 
var ORANGE   ="FFFF00"; 
var duree ;

var buttonListener = function(event) { 
    if (event == "DOUBLE") { 
        exit(); 
    } 
    return true; 
} 


var obtenirDuree = function()
{
	karotz.asr.string(grammar,"fr-FR",monretour);
}

var monretour = function(asrResult) 
{ 
		dureeTexte = asrResult.text; 
		if (dureeTexte == "<nomatch>")
		{
		karotz.tts.start("Je ne parviens pas à vous comprendre, veuillez relancer l'application ! ","FR-fr",function(event){ 
								if(event == "TERMINATED")
									{ 
										exit(); 
									} 
								}
				);		
		}
		else
		{
		duree = parseInt(dureeTexte);
		dureems = duree*1000*60;
		dureems2 = dureems-60000;
		karotz.tts.start("Je vous préviens dans "+duree+" minutes ","FR-fr",function(event){ 
								if(event == "TERMINATED")
									{ 
										noTimeout(); 
									} 
								}
				);
		karotz.led.light(BLACK); 
		karotz.led.pulse(WHITE, 1000, -1); 
		
		setTimeout(dureems2,fin);
		setTimeout(dureems,masortie); 
		}
}
 
var fin = function()
{
		karotz.led.light(BLACK); 
		karotz.led.pulse(WHITE, 250, -1); 
}

var noTimeout = function()
{
	ping();
	setTimeout(600000,noTimeout);
}
 
var masortie = function() 
{ 
    karotz.multimedia.play("http://www.vinceonline.fr/karotz/minuteur/end.mp3",
	function(event){ 
		if(event == "TERMINATED")
		{ 
			karotz.tts.start("Fin du minuteur !","FR-fr",function(event){ 
				if(event == "TERMINATED")
				{ 
					exit(); 
				} 
				}
			);

		} 
	}
	);
} 

var onKarotzConnect = function(data) { 
     karotz.led.light(ORANGE); 
     karotz.button.addListener(buttonListener); 	 
     karotz.tts.start("Minuteur : quelle durée en minutes pour le minuteur? ","FR-fr",function(event){ 
		if(event == "TERMINATED")
		{ 
			obtenirDuree(); 
		} 
	}
	);
} 




karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {}); 
