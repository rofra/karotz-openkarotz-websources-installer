include("util.js");
var depart = params[instanceName].dept;
var karotz_ip="localhost";

var buttonListener = function(event) { 
    if (event == "DOUBLE") { 
        karotz.tts.stop(); 
        exit(); 
    } 
    return true; 
} 


var exitFunction = function(event) { 
    if((event == "CANCELLED") || (event == "TERMINATED")) { 

        exit(); 
    } 
    return true; 
} 

var onKarotzConnect = function(data)
{      
// Fonction callback la première à être appelée
karotz.button.addListener(buttonListener);

var urlcol = "http://www.famillegambier.com/karotz/col" + depart +".txt";
var datacol = http.get2(urlcol);
var responsecol = datacol.content;

karotz.led.light(responsecol);



var url = "http://www.famillegambier.com/karotz/vigi" + depart +".txt";
var data = http.get2(url);
var response = data.content;

karotz.tts.start(response, "fr", exitFunction);

}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

