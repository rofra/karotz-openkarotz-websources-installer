include("util.js"); 
var karotz_ip="localhost" 
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
    if (event == "DOUBLE") { 
        exit(); 
    } 
    return true; 
} 


var maFonction = function(event) { 
      var randomnumber = Math.floor(Math.random()*15);
      karotz.led.fade(colors[randomnumber], 2000); 
	  setTimeout(3000,maFonction);
} 

var onKarotzConnect = function(data) { 

	karotz.led.light("FFFFFF");
	karotz.button.addListener(buttonListener); 
	var duree = params[instanceName].temps;
	var duree_ms = duree*60000;
	setTimeout(duree_ms,exit);
	karotz.led.fade("FF0000",3000,maFonction);
	
} 

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {}); 