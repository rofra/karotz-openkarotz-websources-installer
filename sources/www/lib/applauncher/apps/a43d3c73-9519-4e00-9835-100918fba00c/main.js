include("dom.js");


karotz.connectAndStart = function(host, port, callback, data) {	
    try {
        karotz.connect(host, port); log("connected");
    	karotz.start(callback, data);
    } catch(err) { log(err); }
}


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


var lang = params[instanceName].lang
lang = lang.split("|")
log("lang: "+lang)
lang = lang[Math.floor(Math.random()*lang.length)]
log("lang: "+lang)


var nbSound= [];
nbSound["br"]=[-15,115];
nbSound["de"]=[-20,115];
nbSound["en"]=[-15,115];
nbSound["es"]=[-30,95];
nbSound["fr"]=[-9,110];
nbSound["it"]=[-20,115];
nbSound["ja-JP"]=[-30,115];
nbSound["uk"]=[-15,115];
nbSound["us"]=[-30,100];


///////////////////// normal weather engine


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

if (data.unit == "C" ) data.unitName = "degree.mp3";
else data.unitName = "farenheit.mp3";

var meteoToday = function(event){
    if(event != "TERMINATED") return;
    var ret = animation(data.current_icon);
    var url;
    if (ret>=0) url = "http://karotz.s3.amazonaws.com/applications/weather/"+data.lang+"/out/today"+ret+".mp3";
    else url = "http://karotz.s3.amazonaws.com/applications/weather/"+data.lang+"/today.mp3";
    karotz.multimedia.play(url,todayTemp);
}

var todayTemp = function(event)
{
  if (event =="TERMINATED")
  {
    var temp = data.current_temp
    if (temp >= nbSound[data.lang][0] || temp <= nbSound[data.lang][1] ){
      var url = "http://karotz.s3.amazonaws.com/applications/weather/"+data.lang+"/out/"+temp+data.unitName;
      karotz.multimedia.play(url,meteoTomorrow);
    }
    else meteoTomorrow("TERMINATED");
  }
}



var meteoTomorrow = function(event){
    if(event != "TERMINATED") return;
    var ret = animation(data.tomorrow_icon);
    var url;
    if (ret>=0) url = "http://karotz.s3.amazonaws.com/applications/weather/"+data.lang+"/out/tomorrow"+ret+".mp3";
    else url = "http://karotz.s3.amazonaws.com/applications/weather/"+data.lang+"/tomorrow.mp3";
    karotz.multimedia.play(url,tomorrowTemp);
}

var tomorrowTemp = function(event)
{
  if (event =="TERMINATED")
  {
    var temp =  data.tomorrow_temp_high
    if (temp >= nbSound[data.lang][0] || temp <= nbSound[data.lang][1] ){
      var url = "http://karotz.s3.amazonaws.com/applications/weather/"+data.lang+"/out/"+temp+data.unitName;
      karotz.multimedia.play(url,finish);
    }
    else finish("TERMINATED");
  }
}

var finish = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.multimedia.stop(); exit();
	}
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

var cbRain = function(){
   karotz.led.fade("006DBC",100,function(event){if(event == "TERMINATED"){karotz.led.fade("000000",500);}  }); 
   setTimeout(1000,cbRain); 
}

var cbCloud = function(){
   karotz.led.pulse("3CC44F",1000,-1 ); 
}


var cbStorm = function(){
    karotz.led.light(YELLOW);
    karotz.led.light(WHITE);	
    //karotz.multimedia.play("/usr/thunder.wav");
    karotz.led.fade("020219",100,function(event){if(event == "TERMINATED"){karotz.led.pulse("000009",1100,9000);}  });
    setTimeout(2500,cbStorm);
}



var animation = function(icon){
    log(icon);
    var reg=new RegExp("/", "g");
    list_split=icon.split(reg);
    icon = list_split[list_split.length -1];
    reg=new RegExp(".gif", "g");
    list_split=icon.split(reg);
    icon = list_split[0];
    log(icon);
    if (icon.indexOf("snow") != -1)
    { 
	 karotz.led.fade(WHITE,400,cbSnow);
         return 4;//neige
    }
    else if (icon.indexOf("sunny") != -1)
    {
         karotz.led.fade(YELLOW,400);    
         return 0;//soleil
    } 
    else if (icon.indexOf("cloudy") != -1)
    {
	 karotz.led.fade(WHITE,400,cbCloud); 
         return 1;//nuage   
    } 
    else if (icon.indexOf("rain") != -1)
    {
         //karotz.multimedia.play("/usr/rain.wav");
         cbRain();   
         return 3;//pluie  
    }
    else if (icon.indexOf("flurries") != -1)
    {
	//karotz.multimedia.play("/usr/windy.wav");
         karotz.led.fade(WHITE,900);    
         return 5;//orage
    }
    else if (icon.indexOf("storm") != -1)
    { 
         cbStorm(); 
         return 5;//orage   
    }
    else if (icon.indexOf("fog") != -1)
    { 
         karotz.led.fade("1B5923",1200); 
         return 2;//orage    
    }
    else
    {
         karotz.led.fade("00FF9F",1200); 
         return -1    
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
      karotz.tts.start("Désolé, je ne peux pas trouver la météo pour " + data.city + " "+ data.country + " finden",data.lang,function(event)
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

  var elements_current = xmlDoc.getElementsByTagName("current_condition");
  data.current_temp = elements_current[0].getElementsByTagName( "temp_" + data.unit )[0].textContent;

  data.current_icon = getIcon( elements_current[0].getElementsByTagName( "weatherCode" )[0].textContent );

  var elements_weather = xmlDoc.getElementsByTagName( "weather" );

  data.tomorrow_temp_low = elements_weather[1].getElementsByTagName( "tempMin" + data.unit )[0].textContent;
  data.tomorrow_temp_high = elements_weather[1].getElementsByTagName( "tempMax" + data.unit )[0].textContent;
  data.tomorrow_icon = getIcon( elements_weather[1].getElementsByTagName( "weatherCode" )[0].textContent );

  return 0
  //log("TEMMMMMMMMP : "+data.tomorrow_temp_high + " " +data.current_temp);
}

var onKarotzConnect = function(data){
    log("add buttonListener");
    karotz.button.addListener(buttonListener);
    var url = "http://karotz.s3.amazonaws.com/applications/weather/fr/signature.mp3";
    karotz.multimedia.play(url,meteoToday);
    if (processMeteo() != 0) return;
}


log("connect and start");
//karotz.connectAndStart("10.2.2.113", 9123, onKarotzConnect, data);
karotz.connectAndStart("localhost", 9123, onKarotzConnect, data);


