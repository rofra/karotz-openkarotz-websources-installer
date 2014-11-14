include("util.js"); 
var karotz_ip="localhost" 
                                                                                                                          
var buttonListener = function(event) {
    

if (event == "DOUBLE") {
             karotz.multimedia.stop();
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
karotz.button.addListener(buttonListener);
var lang = params[instanceName].lang;

if (lang == "French")
{
	var path = "http://old.marseillaise.org/francais/audio/mireille_mathieu_-_la_marseillaise.mp3";
}

else 
{
//var path = "http://www.pch.gc.ca/pgm/ceem-cced/symbl/MP3/O-Canada-fra.MP3";
}
  karotz.led.light("3300FF");
  karotz.multimedia.play(path, exitFunction);
	

}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
