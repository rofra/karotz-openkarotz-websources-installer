include("util.js");
//var karotz_ip = "192.168.1.46";
var karotz_ip = "localhost";
var moncompteur; //= 180 //60 * 3 pour 3 minutes par exemple
var compteur = 0;
var avant = true;
var letemps = "déjà : ";
if (karotz_ip == 'localhost') { var decompte = parseInt(params[instanceName].decompte); }
else var decompte = -1; ////j'indique le temps qui reste si +1 j'indique le temps passé,
if (karotz_ip == 'localhost') { var increment = parseInt( params[instanceName].increment); }
else var increment = 30; //10 s ou 30 s ou 60 s
if (karotz_ip == 'localhost') { var defaut = parseInt(params[instanceName].defaut); }
else var defaut = 0; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var music = params[instanceName].music; }
else var music = "11"; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var ears = params[instanceName].ears; }
else var ears = "N"; //temps par défaut pour éviter l'ASR en minute
var lien_music;
var d = new Date();

var annonce_compteur;
var gauche = 0;
var droite = 2;
var grammar = " ([oeuf] a la coque|coque) |[oeuf] dur|[oeuf] poché|[oeuf] mollet|[lavage] dent|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|";
var grammar = grammar + "21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|";
var grammar = grammar + "41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|";
var grammar = grammar + "61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|";
var grammar = grammar + "81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99|100|";
var grammar = grammar + "101|102|103|104|105|106|107|108|109|110|111|112|113|114|115|116|117|118|119|120";
var nume;
var kill=0;
var mode;
var heure;
switch (music) {
    case "1":
        lien_music = "http://www.bregeon.net/karotz/passageaniveau.mp3"; break;
    case "2":
        lien_music = "http://www.bregeon.net/karotz/coucou10.mp3"; break;
    case "3":
        lien_music = "http://www.bregeon.net/karotz/saxo1.mp3"; break;
    case "4":
        lien_music = "http://www.bregeon.net/karotz/trompette2.mp3"; break;
    case "5":
        lien_music = "http://www.bregeon.net/karotz/alarmedanger10.mp3"; break;
    case "6":
        lien_music = "http://www.bregeon.net/karotz/alarmeelectronique10.mp3"; break;
    case "7":
        lien_music = "http://www.bregeon.net/karotz/alarmefumee10.mp3"; break;
    case "8":
        lien_music = "http://www.bregeon.net/karotz/clochecontinue10.mp3"; break;
    case "9":
        lien_music = "http://www.bregeon.net/karotz/woodywoodpecker.mp3"; break;
    case "10":
        lien_music = "http://www.bregeon.net/karotz/cesttout.mp3"; break;
    case "11":
        lien_music = "http://www.bregeon.net/karotz/oinkouhihponk.mp3"; break;
}
var debuglog = function(string) {
    //var d = new Date();
    var hh = "" + d.getHours();
    var mm = d.getMinutes();
    if (mm < 10) { mm = "0" + mm; }
    hh = hh + 'h' + mm + " : ";
     log(hh + string);
    return true
}		
function execAction(num, delay) {
    setTimeout(delay, function() {
        automate(num);
    });
}

function speakAndGoto(txt, num, delay) {
    execAction(num, delay);
    karotz.tts.start(txt, "fr", function(event) {
        if ((event == "TERMINATED") && (kill == 0)) {
            //execAction(num, delay);
        }
    });
}
function playAndGoto(adr, num, delay) {
    execAction(num, delay);
    karotz.multimedia.play(adr, function(event) {
        if ((event == "TERMINATED") && (kill == 0)) {
           oreille();
        }
    });
}


var buttonListener = function(event) {
	if (event == "SIMPLE") {
		kill=1;
		karotz.tts.stop(function(event){});
		automate(nume);
	}
	else if (event == "DOUBLE") {
		exit();
	}
	return true;
}

var earsListener = function(event,step) {
/*	if (event == "START_RIGHT") {
		kill=1;
		karotz.tts.stop(function(event){});
		if(nume>0){automate(nume-1);}
		else{automate(nume);}
	}
	else if (event == "START_LEFT") {
		kill=1;
		karotz.tts.stop(function(event){});
		automate(nume+1);
	}*/
	return true;
}
function oreille()
{
    if (ears == 'Y')  {
        if (avant) {
            karotz.ears.moveRelative(gauche, droite, function(event) {
                if (event == "TERMINATED") {
                    if ((droite == 2) || (droite == 1)) { droite = -2; gauche = 0; }
                    else { droite = 2; gauche = 0; }
                    oreille();
                }
            });
        }
        else {
            karotz.ears.moveRelative(gauche, droite, function(event) {
                if (event == "TERMINATED") {
                    droite = 1000;
                    gauche = 1000;
                    oreille();
                }
            });

        }
    }
}
function calcul_minute_seconde(temps) {
    annonce_compteur = "";
    if ((Math.floor(temps / 3600) > 0)) {
        annonce_compteur = Math.floor(temps / 3600) + " heure : ";
        temps = temps - 3600 * (Math.floor(temps / 3600));
    }
    //if (((Math.floor(temps / 3600) > 0)) && ((temps % 3600) > 0)) annonce_compteur = annonce_compteur + " et "
   // else {
        if ((Math.floor(temps / 60) > 0)) annonce_compteur = annonce_compteur + Math.floor(temps / 60) + " minute : ";
        //if (((Math.floor(temps / 60) > 0)) && ((temps % 60) > 0)) annonce_compteur = annonce_compteur + " et "
        if ((temps % 60) > 0) annonce_compteur = annonce_compteur + (temps % 60) + " secondes ";
    //}
    return annonce_compteur;
}
function automate(i) {
    debuglog("avant vaut :" + avant);
    //oreille();
    if (avant) {
        nume = i;
        if (((compteur > 10+increment) && (decompte == -1)) || ((compteur < moncompteur - (10+increment)) && (decompte == +1))) {
            compteur = compteur + (decompte * increment);
            debuglog("mon compteur :) " + compteur + " le floor de ma division : " + Math.floor(compteur / 3600) + " le reste de ma division : " + (compteur % 3600));
            annonce_compteur = calcul_minute_seconde(compteur);
            if (((increment > 0) && (compteur > increment) && (decompte == -1)) || ((increment > 0) && (compteur < moncompteur-increment) && (decompte == +1))) speakAndGoto("<voice emotion='happy'>" + letemps + annonce_compteur + "</voice>", i + 1, increment * 1000);
            if ((increment == 30) && (compteur == 30)) speakAndGoto("<voice emotion='happy'>" + letemps + annonce_compteur + "</voice>", i + 1, 20000);
            if ((increment == 60) && (compteur == 60)) speakAndGoto("<voice emotion='happy'>" + letemps + annonce_compteur + "</voice>", i + 1, 50000);
            if (increment == 0) { compteur = compteur + decompte * 10; execAction(i + 1, 10000); }
        }
        else {
            
            karotz.tts.start("10 <break time='600ms'/> 9 <break time='600ms'/> 8 <break time='600ms'/> 7 <break time='600ms'/> 6 <break time='600ms'/> 5 <break time='600ms'/> 4  <break time='600ms'/> 3 <break time='600ms'/> 2 <break time='600ms'/> 1 ", "fr", function(event) {
            if (event == "TERMINATED") {
                avant = !avant;
                compteur = 0;
                letemps = "déjà : ";
                karotz.led.light("FF0000");
                karotz.led.pulse("0000FF", 500, -1);
                playAndGoto(lien_music, 0, 10000); 
            }
            });
        }
    }
    else {//je suis après
        nume = i;
      /*  compteur = compteur + 10;
        if ((compteur % 20)== 0 ){
            //log("mon compteur :) " + compteur + " le floor de ma division : " + Math.floor(compteur / 60) + " le reste de ma division : " + (compteur % 60));
            annonce_compteur = calcul_minute_seconde(compteur);
            speakAndGoto("<voice emotion='happy'>" + letemps + annonce_compteur + "</voice>", i + 1, 10000);
        }
        else {*/
        playAndGoto(lien_music, i + 1, 15000); 
            
        //}
    
    }
}
var onKarotzConnect = function(data) {


    karotz.button.addListener(buttonListener);
    karotz.ears.addListener(earsListener);
    if (defaut == 0) {
        karotz.tts.start("Indiquez votre durée en minute ( de une à 120 ) ou donner un mot clé comme : oeuf à la coque ou lavage dent par exemple.", "fr", function(event) {
            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                karotz.asr.string(grammar, "fr-FR", function(asrResult) {
                    jai_entendu = asrResult.text;
                    debuglog("voic ce que j'ai entendu : " + asrResult.text);
                    if (jai_entendu == "<nomatch>")
                        setTimeout(1000, function() { onKarotzConnect() });

                    else
                        karotz.tts.start("Avez-vous dit : " + jai_entendu + ' ? Oui ou non?', "fr", function(event) {
                            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                karotz.asr.string("oui | non", "fr-FR", function(asrResult) {
                                    var validation = asrResult.text;
                                    debuglog("validation = " + validation);
                                    if ((validation == "<nomatch>") || (validation == "non"))
                                    // setTimeout(1000, function() { onKarotzConnect });
                                    // else if  
                                        karotz.tts.start("excusez-moi j'ai du mal comprendre ", "fr", onKarotzConnect);
                                    //ici c'est oui je sais si c'est addition ou multiplication
                                    else if (validation == "oui") {
                                        moncompteur = 60 * parseInt(jai_entendu);
                                        if ((jai_entendu == "oeuf dur") || (jai_entendu == "dur")) moncompteur = 480;
                                        if ((jai_entendu == "oeuf mollet") || (jai_entendu == "mollet")) moncompteur = 360;
                                        if ((jai_entendu == "oeuf poché") || (jai_entendu == "poché")) moncompteur = 180;
                                        if ((jai_entendu == "lavage dent") || (jai_entendu == "dent")) moncompteur = 180;
                                        if ((jai_entendu == "oeuf a la coque") || (jai_entendu == "coque")) moncompteur = 180;
                                        debuglog("mon compteur vaut : " + moncompteur);
                                        if (decompte == -1) { compteur = moncompteur; letemps = "il reste : "; }
                                        karotz.led.light("000000");
                                        karotz.led.pulse("FF00FF", 1500, -1);
                                        playAndGoto("http://www.bregeon.net/karotz/remonter_horloge.mp3", 0, 1000*increment);
                                    }
                                });
                            };
                        });
                });
            }
        });
    }
    else {
        moncompteur = 60 * defaut;
    
    if (decompte == -1) { compteur = moncompteur; letemps = "il reste : "; }
    karotz.led.light("000000");
    karotz.led.pulse("FF00FF", 1500, -1);
    //oreille();
    playAndGoto("http://www.bregeon.net/karotz/remonter_horloge.mp3", 0, increment * 1000);
    }
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
