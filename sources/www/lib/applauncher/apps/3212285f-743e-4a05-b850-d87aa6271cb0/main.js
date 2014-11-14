include("util.js");
var karotz_ip = "localhost"; //<= ATTENTION ici votre adresse IP
var jai_entendu, la_table_est, operateur, resultat;
var EarsPositions = 17; //Nombre de positions d'oreilles existantes
var LeftEar = 0;
var RightEar = 0;
var NoMove = 0.25;
var compteur = 0;
var phrase_ok = 0;
var ma_phrase = "Je suis la pour t'aider a raiviser tes tables d'addition et de multiplication, attends que la lumiaire soit : orange pour me raipondre. A tout moment tu peux dire le mot : table : pour revenir a ce choix. Tu veux raiviser ? : additions ou : multiplications ?";
var deb = '<prosody rate="-12%">';
var fin = '</prosody>';
var tous_les_resultats = "table|0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90";
var bonnes_reponses = new Array();
bonnes_reponses[0] = "bravo ces le bon raizultat !";
bonnes_reponses[1] = "oui ces sa, continue tu es sur la bonne voie...";
bonnes_reponses[2] = "je ne dirai qu'un mot : bravo !";
bonnes_reponses[3] = "encore une bonne raiponse sa mairite une raicompense";
bonnes_reponses[4] = "tu sais que tu es fort toi?";
bonnes_reponses[5] = "je me demande comment tu sais tout ceula?";
bonnes_reponses[6] = "jai limpression de parler avec un surdouai !";
bonnes_reponses[7] = "encore une bonne raiponse sa mairite une raicompense";
bonnes_reponses[8] = "toute mes failicitations !";
bonnes_reponses[9] = "Je suis content de voir que tu t'en sors avec ces tables..";
bonnes_reponses[10] = "jai l'impression que tu es bonne ehlaive, je me trompe?..";
bonnes_reponses[11] = "voici ta raicompense";
bonnes_reponses[12] = "dis moi, tu as une calculatrice avec toi, ces pas possible d'aitre si douez!";
bonnes_reponses[13] = "Je reste sans voix devant tant de si bons raizultats";
bonnes_reponses[14] = "ces trait bien";
bonnes_reponses[15] = "je crois que sa mairite une nouvaile raicompense";
bonnes_reponses[16] = "Whaou...";
bonnes_reponses[17] = "Trop fort";
bonnes_reponses[18] = "chapeau bas !";
bonnes_reponses[19] = "ces daija ta raicompense";
bonnes_reponses[20] = "bientot ces toi qui va mapprendre les tables.";
bonnes_reponses[21] = "tu es seul pour raipondre ou on t'aide?";
bonnes_reponses[22] = "bonne raiponse";
bonnes_reponses[23] = "je ne sais plus quoi dire aussi voici ta raicompense et nous allons changet de table";

var virgules = new Array();
virgules[0] = "1313";
virgules[1] = "1317";
virgules[2] = "1337";
virgules[3] = "9335";
virgules[4] = "3228";
virgules[5] = "20155";
virgules[6] = "20157";
virgules[7] = "9344";
virgules[8] = "13738";
virgules[9] = "22220";
virgules[10] = "17097";
virgules[11] = "17114";
virgules[12] = "17115";

var isSuperior = function() {
    if (NoMove > Math.random()) return 0;
    else return 1;
}

var sens = function() {
    if (Math.random() > 0.5) return 1;
    else return -1;
}


var randColor = function() {
    var color = "" + Math.floor(Math.random() * 16777215).toString(16);
    karotz.led.light(color);
    return true;
}
var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}
var exitFunction = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    } return true;
}
var combien_de_bonnes_reponses = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        phrase_ok += 1;
        if (phrase_ok == 24) { phrase_ok = 0; }
        compteur += 1;
        //var comp = Math.floor(Math.random() * 4);
        log(compteur + "-");
        if (compteur >= 4) {
            compteur = 0;
            var ma_virgule = Math.floor(Math.random() * 13);
            var path = "http://www.universal-soundbank.com/mp3/sounds/" + virgules[ma_virgule] + ".mp3";
            log(path);
            LeftEar = 17 * sens(); //Math.floor((EarsPositions + 1) * Math.random()) * isSuperior() * sens();
            //if (LeftEar == 0) { LeftEar += 25; }
            RightEar = LeftEar;
            //if (RightEar == 0) { RightEar -=25;}
            karotz.ears.moveRelative(LeftEar, RightEar, function(event) {
                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                    karotz.multimedia.play(path, function(event) {
                        if ((event == "TERMINATED") && (phrase_ok > 0)) { setTimeout(1000, function() { je_pose_ma_question("TERMINATED") }); }
                        if ((event == "TERMINATED") && (phrase_ok == 0)) { setTimeout(1000, function() { onKarotzConnect() }); }
                    });
                }
            })
        }
        else je_pose_ma_question("TERMINATED");
    }
}

var est_ce_le_bon_resultat = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        karotz.asr.string(tous_les_resultats, "fr-FR", function(asrResult) {
            var resultat_donne = asrResult.text;
            log("j'ai entendu (validation) = " + resultat_donne);
            //var phrase_ok = Math.floor(Math.random() * 14);
            randColor();
            if (resultat_donne == "<nomatch>")
                setTimeout(1000, function() { je_pose_ma_question("TERMINATED") });
            if (resultat_donne == "table")
                setTimeout(1000, function() { onKarotzConnect() });
            else if (+resultat_donne == resultat)
            //
                karotz.tts.start(deb + bonnes_reponses[phrase_ok] + fin, "fr", combien_de_bonnes_reponses);
            else
                karotz.tts.start(deb + "la raiponse est : " + resultat + fin, "fr", je_pose_ma_question);
        });
    }
}
var je_pose_ma_question = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        ping();
        var la_table = la_table_est;
        if (la_table == 0){la_table =  1 + Math.floor(Math.random() * 9);}
        var mon_nombre_aleatoire = Math.floor(Math.random() * 10);
        resultat = +jai_entendu * +mon_nombre_aleatoire;
        if (operateur == "et") { resultat = +la_table + +mon_nombre_aleatoire };
        if (operateur == "fois") { resultat = +la_table * +mon_nombre_aleatoire };
        if ((operateur == "fois") && (la_table == 1)) {
            karotz.tts.start(deb + "Combien font : une  : " + operateur + " : " + mon_nombre_aleatoire + "?" + fin, "fr", est_ce_le_bon_resultat);
        } //je dis une et non pas un
        karotz.tts.start(deb + "Combien font : " + la_table + " : " + operateur + " : " + mon_nombre_aleatoire + "?" + fin, "fr", est_ce_le_bon_resultat);
    };
    //   });
}
var oui_non = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        karotz.asr.string("table |oui | non", "fr-FR", function(asrResult) {
            var validation = asrResult.text;
            log("j'ai entendu (validation) = " + validation);
            if (validation == "table")
                setTimeout(1000, function() { onKarotzConnect() });
            if ((validation == "<nomatch>") || (validation == "non"))
            //setTimeout(1000, function() { karotz.tts.start(deb + ' ? Oui ou non?' + fin, "fr", oui_non); });
            // else if (validation == "non")
                karotz.tts.start(deb + "alors je repose ma question " + fin, "fr", choisis_ta_table);
            else { je_pose_ma_question("TERMINATED") };

        });
    };
}
var choisis_ta_table = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        operateur = "fois";
        if (jai_entendu == "addition") { operateur = "et" };
        log(operateur);
        karotz.tts.start(deb + "choisis ta table entre : un : et : neuf : ou zairo pour azar" + fin, "fr", function(event) {
            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                karotz.asr.string(" table |1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 ", "fr-FR", function(asrResult) {
                    la_table_est = asrResult.text;
                    log(asrResult.text);
                    if (la_table_est == "table")
                        setTimeout(1000, function() { onKarotzConnect() });
                    if (la_table_est == "<nomatch>")
                        setTimeout(1000, function() { choisis_ta_table(event) });

                    else
                        karotz.tts.start(deb + "As-tu dit : " + la_table_est + ' ? Oui ou non?' + fin, "fr", oui_non);
                });
            }
        });
    };
}
var onKarotzConnect = function(data) {
    log("je passe bien par la");
    karotz.button.addListener(buttonListener);
    karotz.led.light("00FF00");
    karotz.tts.start(deb + ma_phrase + fin, "fr", function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            karotz.asr.string("addition | multiplication ", "fr-FR", function(asrResult) {
                jai_entendu = asrResult.text;
                ma_phrase = " Tu veux raiviser ? : additions ou : multiplications ?";
                log(asrResult.text);
                if (jai_entendu == "<nomatch>")
                    setTimeout(1000, function() { onKarotzConnect() });

                else
                    karotz.tts.start(deb + "As-tu dit : " + jai_entendu + ' ? Oui ou non?' + fin, "fr", function(event) {
                        if ((event == "CANCELLED") || (event == "TERMINATED")) {
                            karotz.asr.string("oui | non", "fr-FR", function(asrResult) {
                                var validation = asrResult.text;
                                log("validation = " + validation);
                                if ((validation == "<nomatch>") || (validation == "non"))
                                // setTimeout(1000, function() { onKarotzConnect });
                                // else if  
                                    karotz.tts.start(deb + "excuse moi j'ai du mal comprendre " + fin, "fr", onKarotzConnect);
                                //ici c'est oui je sais si c'est addition ou multiplication
                                else if (validation == "oui")
                                    karotz.tts.start(deb + "nous allons donc faire des " + jai_entendu + fin, "fr", choisis_ta_table);
                            });
                        };
                    });
            });
        }
    });
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

