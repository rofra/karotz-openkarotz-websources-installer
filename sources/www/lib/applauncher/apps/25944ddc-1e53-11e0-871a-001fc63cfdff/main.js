log("START meteo");
include("dom.js");

karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

//********* Regexp
var minusArray = new Array();
minusArray["fr"] = " moins ";
minusArray["en"] = " minus ";
minusArray["de"] = " minus ";
minusArray["es"] = " minus ";
minusArray["nl"] = " minus ";

var minusReg =new RegExp("-", "g");
//*********

var BLACK       ="000000";
var BLUE        ="0000FF";
var CYAN        ="00FF9F";
var GREEN       ="00FF00";
var ORANGE      ="FFA500";
var PINK        ="FFCFAF";
var PURPLE      ="9F00FF";
var RED         ="FF0000";
var YELLOW      ="75FF00";
var WHITE       ="4FFF68";

log("START2 meteo");
var parser = new DOMParser();

var data = {};
include("data.js");

log("instanceName: "+instanceName);
data.city = params[instanceName].city;
data.country = params[instanceName].country;
log("unit "+params[instanceName].unit);
data.unit = params[instanceName].unit;
data.lang = lang;

/*data.city = "Paris";
data.country = "France";
data.unit = "C";
data.lang = lang;
*/

var meteoTomorrow = function(event){
    if(event != "TERMINATED") return;
    var say = sayTomorrow();
    log(say);
    karotz.tts.start(say,data.lang,
		function(event){
			if(event == "TERMINATED"){
				log("exiting...");
				exit();
			}
		}
	);
   animation(getAnim( data.weather2code) );
}





var buttonListener = function(event)
{
    log("in buttonListener");
    if (event == "DOUBLE")
    {
        // quit, whatever we're doing
        karotz.tts.stop();
        exit();
    }
    return true;
}



var cbSnow = function(event){
  if(event == "TERMINATED"){
    karotz.led.fade(WHITE,200,function(event){if(event == "TERMINATED"){karotz.led.fade("0E2F12",1700,cbSnow);}  }); 
  }
}

var cbRainInternal=function()
{
  
}

var cbRain = function(event){
  if(event == "TERMINATED"){
    karotz.led.fade(BLACK,200,function(event){if(event == "TERMINATED"){karotz.led.fade("006DBC",1700,cbRain);}  }); 
  }

}

var cbCloud = function( event ){
  if(event == "TERMINATED"){
    karotz.led.fade("00FF9F",1000,function(event){if(event == "TERMINATED"){karotz.led.fade(WHITE,1000,cbCloud);}  }); 
  }
}


var cbStorm = function(event){
  if(event == "TERMINATED"){
    karotz.led.light(YELLOW);
    karotz.led.light(WHITE);	

    karotz.led.fade("020219",100,function(event){if(event == "TERMINATED"){karotz.led.fade("000009",1100,cbStorm);}  }); 
  }
}

var animation = function(icon){
    log("#### animation " + icon );
    if (icon.indexOf("snow") != -1)
    { 
	 karotz.led.fade(WHITE,400,cbSnow);
    }
    else if (icon.indexOf("sunny") != -1)
    {
        log( "... sunny 1" );
         karotz.led.fade(YELLOW,400);    
        log( "... sunny 2" );
    } 
    else if (icon.indexOf("cloudy") != -1)
    {
	 karotz.led.fade(WHITE,400,cbCloud);    
    } 
    else if (icon.indexOf("rain") != -1)
    {
          karotz.led.fade(BLACK,100,cbRain);
    }
    else if (icon.indexOf("flurries") != -1)
    {
         karotz.led.fade(WHITE,900);    
    }
    else if (icon.indexOf("storm") != -1)
    { 
         // cbStorm();    
        karotz.led.fade( BLACK, 100, cbStorm );
    }
    else if (icon.indexOf("fog") != -1)
    { 
         karotz.led.fade("1B5923",1200);     
    }
    else
    {
         karotz.led.fade("00FF9F",1200);     
    }
} 

var getMeteo = function(){
    cmd = "http://api.worldweatheronline.com/free/v1/weather.ashx?key=347q27twrq5a2g5m5as2pruj&num_of_days=2&q=" + encodeURIComponent(data.city) + "," + encodeURIComponent(data.country);
    log(cmd);
    var weatherData = http.get(cmd);
    return parser.parseFromString(weatherData);
}

var processMeteo = function(){

  var xmlDoc = getMeteo();
  var error = xmlDoc.getElementsByTagName("error");
  if (typeof(error[0]) != "undefined" ) {
      karotz.tts.start("Désolé, je ne trouve pas la météo pour " + data.city + " "+ data.country,data.lang,function(event)
        {
			if(event == "TERMINATED"){
				log("exiting...");
				exit();
			}
		}
        );
        return 1
    }

    log( "Meteo trouvee pour " + data.city + ","+ data.country );

  var elements_place = xmlDoc.getElementsByTagName( "request" );
  data.placeFound = elements_place[0].getElementsByTagName( "query" )[ 0 ].textContent;

  var elements_current = xmlDoc.getElementsByTagName("current_condition");
  data.tempCurrent = elements_current[0].getElementsByTagName( "temp_" + data.unit )[0].textContent;

  data.weathercode = elements_current[0].getElementsByTagName( "weatherCode" )[0].textContent;
  data.weatherdesc = getDescription( data.weathercode, elements_current[0].getElementsByTagName( "weatherDesc" )[0].textContent );

  var elements_weather = xmlDoc.getElementsByTagName( "weather" );
  data.tempMin = elements_weather[0].getElementsByTagName( "tempMin" + data.unit )[0].textContent;
  data.tempMax = elements_weather[0].getElementsByTagName( "tempMax" + data.unit )[0].textContent;

  log( "temp : current=" + data.tempCurrent + " / min=" + data.tempMin + " / max=" + data.tempMax + " / desc=" + data.weatherdesc );

  data.temp2Min = elements_weather[1].getElementsByTagName( "tempMin" + data.unit )[0].textContent;
  data.temp2Max = elements_weather[1].getElementsByTagName( "tempMax" + data.unit )[0].textContent;
  data.weather2code = elements_weather[1].getElementsByTagName( "weatherCode" )[0].textContent;
  data.weather2desc = getDescription( data.weather2code, elements_weather[1].getElementsByTagName( "weatherDesc" )[0].textContent );

  log( "tomorrow : min=" + data.temp2Min + " / max=" + data.temp2Max + " / desc=" + data.weather2desc );
 
  //convert minus sign
  data.tempCurrent = data.tempCurrent.replace(minusReg, minusArray[lang]);
  data.tempMin = data.tempMin.replace(minusReg, minusArray[lang]);
  data.tempMax = data.tempMax.replace(minusReg, minusArray[lang]);

  data.temp2Min = data.temp2Min.replace(minusReg, minusArray[lang]);
  data.temp2Max = data.temp2Max.replace(minusReg, minusArray[lang]);
  return 0
}

var onKarotzConnect = function(data){
    log("add buttonListener");
    karotz.button.addListener(buttonListener);
    if (processMeteo() != 0) return;
    var say = sayToday()
    log(say);
    karotz.tts.start( say,data.lang,meteoTomorrow);
    animation( getAnim( data.weathercode) );
}

log("connect and start");
// karotz.connectAndStart("192.168.0.11", 9123, onKarotzConnect, data);
karotz.connectAndStart("localhost", 9123, onKarotzConnect, data);


