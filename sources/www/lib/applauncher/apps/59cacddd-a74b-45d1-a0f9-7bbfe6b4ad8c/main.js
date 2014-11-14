include("util.js");

var karotz_ip="localhost";
//var karotz_ip="192.168.1.35";

var buttonListener = function(event) 
{
    if (event == "DOUBLE") 
    {
      karotz.tts.stop();
      exit();
    }
    return true;
}

var exitFunction = function(event) 
{
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var arr_jours = new Array("dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi");
var arr_mois = new Array("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre");

var onKarotzConnect = function(data) 
{
    karotz.led.light("FFFFFF");
    karotz.led.pulse("660000", 500, -1);
    karotz.button.addListener(buttonListener);
    
    var txt = params[instanceName].txt;
    var now = new Date();
    
    // Mise à jour de la phrase par rapport aux tag automatique
    txt = txt.replace("%jour%", arr_jours[now.getDay()]);    
    txt = txt.replace("%journo%", now.getDate());    
    txt = txt.replace("%mois%", arr_mois[now.getMonth()]);    
    txt = txt.replace("%annee%", now.getFullYear());    
    txt = txt.replace("%heure%", now.getHours());    
    txt = txt.replace("%minute%", now.getMinutes());    

    karotz.tts.start(txt, "fr", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
