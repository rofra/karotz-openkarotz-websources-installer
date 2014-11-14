log("hello")

karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var BLUE        ="0000FF";
var RED         ="FF0000";
var WHITE       ="4FFF68";

var data = {};
data.lang = "fr"
var ledColor = function(color){
  if (color == "rouge") karotz.led.fade(RED,400);
  else if (color == "blanc") karotz.led.fade(WHITE,400);
  else if (color == "bleu") karotz.led.fade(BLUE,400);
  else karotz.led.light("000000");
}

var fadeoff = function()
{
    karotz.led.fade("000000",700,
		function(event){
			if(event == "TERMINATED"){
				karotz.stop();
				log("exiting...");
				exit();
			}
		}
	);
}

var finish = function()
{
log("FINISH")
setTimeout(800, fadeoff);
}

var colorTomorow = function(event){
    if(event != "TERMINATED") return;
    if (data.colorTomorow == "none" ) finish();
    else 
    {
        var say = ". Demain, jour " + data.colorTomorow  + "." ;
        ledColor(data.colorTomorow)

        log(say);  
        karotz.tts.start(say,data.lang,
		function(event){
			if(event == "TERMINATED"){
				karotz.stop();
				log("exiting...");
				finish();
			}
		}
	);
    }
}


var onKarotzConnect = function(data){
    log("add buttonListener");
    karotz.button.addListener(buttonListener);

var edf = http.get("http://bleuciel.edf.com/abonnement-et-contrat/les-prix/les-prix-de-l-electricite/option-tempo/la-couleur-du-jour-2585.html");
var deb = edf.indexOf("<ul class=\"tempoColor\">");
if (deb < 0) exit();
var fin = edf.indexOf("</ul>",deb);
if (fin < 0) exit();
var data1 = edf.substring(deb,fin);
deb = edf.indexOf("<ul class=\"tempoColor\">",fin);
fin = edf.indexOf("</ul>",deb);
var data2 = edf.substring(deb,fin);

data.colorNow =  searchColor(data1)
data.colorTomorow =  searchColor(data2)

log(data.colorNow)
    ledColor(data.colorNow);
    var say = "aujourd'hui, jour " + data.colorNow +". ";
    log(say);

    karotz.tts.start(say,data.lang,colorTomorow);
}

var buttonListener = function(event)
{
    if (event == "DOUBLE")
    {
        // quit, whatever we're doing
        karotz.tts.stop();
        exit();
    }
    return true;
}

var searchColor = function(str){

var X = str.indexOf("X");
if (X < 0) return "none";
X = X - 10
var debcol = str.indexOf("\"",X)+1;
var fincol = str.indexOf("\"",debcol);
var color = str.substring(debcol,fincol)
log(color);
if (color == "red") return "rouge";
if (color == "white") return "blanc";
if (color == "blue") return "bleu";
return "none";
}




karotz.connectAndStart("localhost", 9123, onKarotzConnect, data);
