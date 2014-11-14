log("APP qualite de l air")

karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var lang = params[instanceName].lang
//var lang= "es|de";
lang = lang.split("|")
log("lang: "+lang)
lang = lang[Math.floor(Math.random()*lang.length)]
log("lang: "+lang)


var ville = params[instanceName].departement;
//var ville = 92100

var data = {};
data.lang = lang

var finish = function(event){
if (event == "TERMINATED")
  setTimeout(1000,function(){exit();})
}

var delayedLed = function(event){
if (event != "TERMINATED") return
data.indice = data.indice / 10
var len = ((data.indice) * 300)
log(len)
if (len != 0)
karotz.led.pulse("ff0000",300*10 ,len);
if (data.indice >= 5)
  karotz.ears.move(5,5);
}

var onKarotzConnect = function(data){
    log("add buttonListener");
    karotz.multimedia.play("http://karotz.s3.amazonaws.com/applications/air/fr/signature.mp3",sayAirQuality)
    karotz.button.addListener(buttonListener);
   var air = http.get("http://www.airparif.asso.fr/indices/indice-europeen-departement/dep/"+ville);
    var deb = air.indexOf('<td class="table_date">Global</td>'); //1
    deb = air.indexOf("<td class",deb+5); //2
    deb = air.indexOf("<td class",deb+5); //3
    if (deb<=0)
    {
        data.indice = "none";
    }
    else
    {
        deb = air.indexOf(">",deb+5)+1;
        data.indice = air.substring(deb,air.indexOf("<",deb+1));
        log ("indice "+data.indice)
        data.indice = parseInt(data.indice)
    }
    if (typeof(data.indice) == 'number')
	karotz.led.fade("00ff00",350,delayedLed);

}

var sayAirQuality = function(event)
{
    if (event == "OK") return
    var say;
    if (typeof(data.indice) == 'number')
    {        
        var url = "http://karotz.s3.amazonaws.com/applications/air/"+data.lang+"/quality/";
        if (data.indice <= 3) url +="good.mp3";
	else if (data.indice <= 6) url +="middle.mp3";
        else url +="bad.mp3";
        karotz.multimedia.play(url,finish)      
    }
    else
    {
        say = "je ne trouve pas d'informations pour la commune " + ville;
	karotz.tts.start(say,"fr",finish)
    }
    log(say);
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




karotz.connectAndStart("localhost", 9123, onKarotzConnect, data);
