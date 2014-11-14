include("util.js"); 
var karotz_ip="localhost" 
var colors =        ["FF0000", 
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

var ears = params[instanceName].ears;                                                                                                                             
var buttonListener = function(event) {
    

if (event == "DOUBLE") {
             karotz.multimedia.stop();
	     karotz.ears.reset(exitFunction);
	exit();
    }


    return true;
}




var flipout = function(event) { 
      karotz.button.addListener(buttonListener);
      var randomnumber = Math.floor(Math.random()*90);
      karotz.led.pulse(colors[randomnumber],20, 20); 

if(ears == "on")
{
      karotz.ears.moveRelative(randomnumber, randomnumber, flipout);
}

      setTimeout(30000,exitFunction);
} 

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}


var onKarotzConnect = function(data)
{
var duration = params[instanceName].duration; 
 setTimeout(60000, function(){ log("ping"); ping(); 
 return true; });
 
 if(duration > 0)
     {

  setTimeout(duration * 60000,  function(){ log("exit"); exit(); 
 return false; });
     }

	var path = "http://www.wefunkradio.com/play/shoutcast.pls";
	var earsrand = Math.floor(Math.random()*15);
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        karotz.led.light("FFFFFF");
if (ears == "on")
{
	karotz.ears.moveRelative(50, 20, flipout);
}
        karotz.led.pulse("FF0000",200, 20,flipout);
	
    });
	

}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
