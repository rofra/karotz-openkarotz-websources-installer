include("util.js");
//var karotz_ip="192.168.0.59";
var karotz_ip="localhost";
include("tinyxmldom.js");

var BLUE        ="0000FF"; 
var BLUE2       ="000068"; 
var CYAN	="00FF9F";
var YELLOW2	="408900"; 
var YELLOW      ="75FF00"; 
var WHITE       ="4FFF68";

var buttonListener = function(event) {
    if (event == "DOUBLE") {
      //  karotz.tts.stop();
        exit();
    }
    if (event == "SIMPLE") {
      //  karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {

       // exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
	var date = new Date();
	var heure = date.getHours();
	//var ville="lille";
	var ville=params[instanceName].ville;
	var pays=params[instanceName].pays;	
	var data = http.get("http://www.google.com/ig/api?weather="+ville+","+pays+"&hl=en");
	karotz.button.addListener(buttonListener);	
	if (data.length > 200)
	{
		var objDom = new XMLDoc(data);
		var domTree = objDom.docNode;
		var condition;
		if (heure <= 14)
		{
			condition = domTree.selectNode("/weather/forecast_conditions[0]/condition").getAttribute("data");
		}
		else
		{
			condition = domTree.selectNode("/weather/forecast_conditions[1]/condition").getAttribute("data");	
		}
		log(condition);


			if (condition == "Clear")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(YELLOW2,1500,-1);
		}
		else if (condition == "Sunny")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(YELLOW2,3000,-1);
		}
		else if (condition == "Cloudy")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(BLUE,1500,-1);
		}
		else if (condition == "Fog")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(CYAN,1500,-1);
		}
		else if (condition == "Haze")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(CYAN,3000,-1);
		}
		else if (condition == "Light Rain")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,3000,-1);
		}
		else if (condition == "Drizzle")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,3000,-1);
		}
		else if (condition == "Mostly Cloudy")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(BLUE,1500,-1);
		}	
		else if (condition == "Mostly sunny")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(BLUE,3000,-1);
		}
		else if (condition == "Partly Sunny")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(BLUE,3000,-1);
		}
		else if (condition == "Overcast")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(BLEU,3000,-1);
		}
		else if (condition == "Partly Cloudy")
		{
		karotz.led.light(YELLOW);
		karotz.led.pulse(BLUE2,3000,-1);
		}
		else if (condition == "Rain")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,1000,-1);
		}
		else if (condition == "Rain Showers")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,2000,-1);
		}
		else if (condition == "Scattered Showers")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,1000,-1);
		}
		else if (condition == "Showers")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,3000,-1);
		}
		else if (condition == "Chance of Showers")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,3000,-1);
		}
		else if (condition == "Thunderstorm")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(WHITE,250,-1);
		}
		else if (condition == "Chance of Snow")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(WHITE,3000,-1);
		}
		else if (condition == "Chance of Storm")
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,500,-1);
		}
		else
		{
		karotz.led.light(BLUE);
		karotz.led.pulse(BLUE2,3000,-1);
		}
	}
	else
	{
		karotz.led.light("FF0000");
		karotz.led.pulse("FFFF00",500,-1);	
	}
	var temps = params[instanceName].temps;
   	//var temps = 10;
	var duree_ms = temps*60*1000;
	setTimeout(duree_ms,exit);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
