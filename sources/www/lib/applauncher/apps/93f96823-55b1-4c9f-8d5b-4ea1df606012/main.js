//jojo pas le temps
include("util.js");

var karotz_ip = "localhost"; //ici votre adresse IP ou localhost pour la version embarquée.
//var karotz_ip = "192.168.1.46"; //ici votre adresse IP ou localhost pour la version embarquée.
var url = "http://s3.amazonaws.com/karotz/applications/histoire1/8.mp3";
if (karotz_ip == 'localhost') { var ears = params[instanceName].ears; }
else var ears = 'N';
var mon_titre;
var deb = '<prosody rate="-12%">';
var fin = '</prosody>';
var pause = true;
var compteur = 0;


var monping = function(event){//cette fonction évite que la radio se coupe au bout de 15 minutes
    ping();//normalement karotz.ping() mais ne fonctionne pas avec la VM java.
    setTimeout(600000, function() { monping(); return true; });
}

var buttonListener = function(event)
{
    if (event == "SIMPLE") {//Support for pause/resume using the button
        karotz.led.light("000000");
        pause = !pause;
        log('pause = : ' + pause);
        if (!pause) {
            log('here : pause = false => pause');
            karotz.led.pulse("75FF00", 500, -1); //Light flashes faster, LED is yellow when pause
            karotz.multimedia.pause(); //Pause Multimedia
        }
        if (pause) {
            log('here : pause = true => resume');

            karotz.led.pulse("FFCFAF", 2000, -1);
            karotz.multimedia.resume(); //Resume Multimedia
        }
    }
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
        exit();
    }
   return true;
}
var exitFunction = function(event)
{
    if (!pause) return;
          if ((event == "CANCELLED") || (event == "TERMINATED")) {
        log('pause' + pause)
        exit();
    }
    return true;
}
// SET a random led color
var randColor = function()
{
    var color = "" + Math.floor(Math.random() * 16777215).toString(16);
    log("light: " + color);
    karotz.led.pulse(color,2000,-1);
    return true;
}
var onKarotzConnect = function(data)
{
    karotz.led.light("000000");
    //karotz.led.pulse("FFCFAF", 2000, -1); //cligotement rose, pulse de 2 secondes, boucle indéfiniment
    karotz.button.addListener(buttonListener); //autorise l'interruption par le bouton
    monping(); //pour le lancer la première fois, ensuite il s'exécutera toute les 10 mn
    if (ears == 'Y') karotz.ears.moveRelative(-50000, 50000);
    randColor();
    //            karotz.multimedia.play("http://s3.amazonaws.com/karotz/applications/rhymes/" + comptine + ".mp3", exitFunction);
    karotz.multimedia.play(url, exitFunction);
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
