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



var ville = params[instanceName].departement;

var data = {};
data.lang = "fr"

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

    var say;
    if (typeof(data.indice) == 'number')
    {        
        say = "aujourd'hui, la qualité de l'air à " + instanceName + " est de " + data.indice +". ";
        karotz.led.fade("00ff00",350,delayedLed);
    }
    else
    {
        say = "je ne trouve pas d'informations pour la commune " + ville;
    }
    log(say);
    karotz.tts.start(say,data.lang,finish);

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
