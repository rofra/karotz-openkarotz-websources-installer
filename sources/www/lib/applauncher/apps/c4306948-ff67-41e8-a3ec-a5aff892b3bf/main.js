include("util.js");

var status=1;
var colors = 					["FF0000", 
                                "00FF00", 
                                "0000FF", 
                                "FFFF00", 
                                "00FFFF", 
                                "FF00FF", 
                                "FF0088", 
                                "8800FF", 
                                "FF8888", 
                                "00FF00", 
                                "008800", 
                                "00FF88", 
                                "88FF00", 								
                                "FFFF00", 								
                                "FFFFFF"]; 
								
var buttonListener = function(event) {
    if (event == "SIMPLE") {
	karotz.led.light("000000");
	if (status==1) {
		karotz.led.pulse("0000FF", 500, -1);
        	karotz.multimedia.pause();
		status=0;
	}
	else {
		karotz.led.pulse("0000FF", 1500, -1);
        	karotz.multimedia.resume();
		status=1;
	}
    }
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var maFonction = function(event) { 
      var randomnumber = Math.floor(Math.random()*15);
      karotz.led.fade(colors[randomnumber], 2000); 
	  setTimeout(3000,maFonction);
} 

var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("00FFFF", 1500, -1);
	var url = "http://www.sky.fm/mp3/smoothjazz.pls";
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(url);
	karotz.led.fade("FF0000",3000,maFonction);	
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
