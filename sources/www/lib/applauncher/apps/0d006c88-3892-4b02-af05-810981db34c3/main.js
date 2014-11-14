//comptines françaises 3
include("util.js");

var karotz_ip = "localhost"; //ici votre adresse IP ou localhost pour la version embarquée.
//var karotz_ip = "192.168.1.46"; //ici votre adresse IP ou localhost pour la version embarquée.
if (karotz_ip == 'localhost') { var comptine = parseInt(params[instanceName].comptine); }
else var comptine = 0;
var alea = comptine;
if (comptine ==0){comptine = 1 + Math.floor(Math.random() * 10); }
if (karotz_ip == 'localhost') { var quit = params[instanceName].quit; }
else var quit = 'N';
if (karotz_ip == 'localhost') { var ears = params[instanceName].ears; }
else var ears = 'N';
var mon_titre;
var grammar = "(1 | pirouette cacahouete) { $.param='1'}|(2 | prom'nons nous dans les bois) { $.param='2'}|(3 |rock n roll des gallinacet) { $.param='3'}|(4 | rond jaune rectangle bleu) { $.param='4'}|(5 | savez-vous planter les choux) { $.param='5'}|(6 | sur le pont d'avignon) { $.param='6'}|(7 | tapent petites mains) { $.param='7'}|( 8 | un deux trois) { $.param='8'}";
var grammar = grammar + "| (9 | une souris verte) { $.param='9'}| (10 | vla le bon vent) { $.param='10'} | (11 | vive le vent) { $.param='11'}";
var deb = '<prosody rate="-12%">';
var fin = '</prosody>';
var pause = true;
var compteur = 0;
function jetecoute()
{
    karotz.tts.start(deb + "Indique le numéro ou le titre de la comptine que tu souhaites entendre :" + fin, "fr", function(event)
    {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            karotz.asr.string(grammar, "fr-FR", function(asrResult)
            {
                if (karotz_ip == 'localhost') { comptine = asrResult.semantic.param; }
                else { comptine = asrResult.semantic.substr(7, asrResult.semantic.length - 15); }
                /*                if ((jai_entendu == "<nomatch>") || (jai_entendu == "") || (jai_entendu == "No result before the no-input timeout") || (jai_entendu == "<error_server_timeout>"))
                setTimeout(1000, function() { jetecoute() });

               else {
                comptine = jai_entendu;
                alea = 99;
                lecture();
                }*/
                log('comptine : ' + comptine);
lecture();


            });
        };
    });

}
var lecture = function()
{
    switch ("" + comptine) {
        case "1":
            compteur = 0; mon_titre = "  : pirouette cacahouète : "; break;
        case "2":
            compteur = 0; mon_titre = "  : prom'nons nous dans les bois : "; break;
        case "3":
            compteur = 0; mon_titre = "  : Rock end roll des gallinacés : "; break;
        case "4":
            compteur = 0; mon_titre = "  : rond jaune rectangle bleu : "; break;
        case "5":
            compteur = 0; mon_titre = "  : savez-vous planter les choux : "; break;
        case "6":
            compteur = 0; mon_titre = "  : sur le pont d'avignon : "; break;
        case "7":
            compteur = 0; mon_titre = "  : tapent petites mains : "; break;
        case "8":
            compteur = 0; mon_titre = "  : un deux trois : "; break;
        case "9":
            compteur = 0; mon_titre = "  : une souris verte : "; break;
        case "10":
            compteur = 0; mon_titre = "  : vla le bon vent : "; break;
        case "11":
            compteur = 0; mon_titre = "  : vive le vent : "; break;

        default:
            compteur += 1; if (compteur >= 3) exit();
            setTimeout(1000, function() { jetecoute() });
            return false;
            break;

    }
    if (ears == 'Y') karotz.ears.moveRelative(-50000, 50000);
    randColor();
    karotz.tts.start(deb + mon_titre + fin, "fr", function(event)
    {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            karotz.multimedia.play("http://s3.amazonaws.com/karotz/applications/comptines3/" + comptine + ".mp3", exitFunction);
//            karotz.multimedia.play("http://www.bregeon.net/karotz/comptines1/" + comptine + ".mp3", exitFunction);
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
    if (event == "LONG_START") {
        karotz.multimedia.stop(function(event)
        {
            log('event du stop : ' + event);
            if (event == "OK") {
                log("je passe ici");
                karotz.led.light("000000");
                compteur = 0;
                jetecoute();
            }
        });
    }

    return true;
}
var exitFunction = function(event)
{
    if (!pause) return;
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        if (quit == 'Y') exit();
        comptine = comptine + 3;
        log('comptine vaut : ' + comptine);
        if (comptine > 10) comptine = comptine - 10;
        if (alea == 0)lecture();
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
