include("util.js");


var karotz_ip = "localhost"; //ici votre adresse IP ou localhost pour la version embarquée.
if (karotz_ip == 'localhost') { var comptine = parseInt(params[instanceName].comptine); }
else var comptine = 0;
var quit = 'Y';
if (karotz_ip == 'localhost') { var ears = params[instanceName].ears; }
else var ears = 'N';
var mon_titre;

var pause = true;

var lecture = function()
{
    switch ("" + comptine) {
        case "0":
            mon_titre = " La fleur de toutes les couleurs : "; break;
        case "1":
            mon_titre = " Quand je suis sur tes genoux : "; break;
        case "2":
            mon_titre = " En ce jour charmant : "; break;
        case "3":
            mon_titre = " Merci maman : "; break;
        case "4":
            mon_titre = " Comment s'écrit le mot Maman? : "; break;
        case "5":
            mon_titre = " C'est aujourd'hui la fête des mamans : "; break;
        case "6":
            mon_titre = " Ouvre grand la fenêtre maman : "; break;
        case "7":
            mon_titre = " Si j'étais jardinier : "; break;
        case "8":
            mon_titre = " Un miroir : "; break;
        case "9":
            mon_titre = " Mon poème : "; break;
        case "10":
            mon_titre = " Petit panier : "; break;
        case "11":
            mon_titre = " Je voudrais pour ta fête : "; break;
        case "12":
            mon_titre = " Les bras d'une maman : "; break;

    }
    if (ears == 'Y') karotz.ears.moveRelative(-50000, 50000);
    randColor();
   karotz.tts.start(mon_titre, "fr", function(event)
    {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            karotz.multimedia.play("http://www.bregeon.net/karotz/fete_mere/" + comptine + ".mp3", exitFunction);
        }
    })
}
var monping = function(event){//cette fonction évite que la radio se coupe au bout de 15 minutes
    ping();//normalement karotz.ping() mais ne fonctionne pas avec la VM java.
    setTimeout(600000, function() { monping(); return true; });
}

var buttonListener = function(event)
{
    log('event ' + event);
    if (event == "SIMPLE") {//appui simple permet de mettre en pause / reprendre la lecture du flux radio
        karotz.led.light("000000");
        pause = !pause;
        if (!pause) {
            karotz.led.pulse("75FF00", 500, -1); //le clignotement est jaune et plus rapide pour indiquer une pause
            karotz.multimedia.pause(); //je mets le lecteur multimedia en pause
        }
        else {
            karotz.led.pulse("FFCFAF", 2000, -1);
            karotz.multimedia.resume(); //je reprends ma lecture
        }
    }
    if (event == "DOUBLE") {
        karotz.multimedia.stop(function(event)
        {
            log('event du stop : ' + event);
            if (event == "OK") {
                log("je passe ici");
                exit();
            }
        });
    }

    return true;
}
var exitFunction = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
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
    lecture();
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
