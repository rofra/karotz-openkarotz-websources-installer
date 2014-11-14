//forme et couleurs v 0.0.1a
include("util.js");
//jeu forme et couleur
//var karotz_ip = "192.168.1.46";
//var karotz_ip = "192.168.1.29";
var karotz_ip = "localhost";
var a_moi = false;
var hh, mm;
var validation_bonne_reponse, validation, combien_peuvent_repondre,jj;
if (karotz_ip == 'localhost') { var niveau = parseInt(params[instanceName].niveau); }
else var niveau = 2; //1 = très facile, aide l'enfant en lui disant par exemple qu'il a déjà posé cette question
if (karotz_ip == 'localhost') { var manche = parseInt(params[instanceName].manche); }
else var manche = 2; //
if (karotz_ip == 'localhost') { var chemin_music = "/usr/karotz/apps/cfa06aad-dd7f-4544-9832-6e82a57d2d53/"; } //vrai chemin
//if (karotz_ip == 'localhost') { var chemin_music = "/usr/karotz/apps/491ed7c6-c3b0-482f-baee-d206693006f2/"; } //appli tests alain
//if (karotz_ip == 'localhost') { var chemin_music = "/usr/karotz/apps/a1377c8e-4cf1-4d16-b221-e6b9d930e059/"; } //appli tests jess
else var chemin_music = "http://www.bregeon.net/karotz/quisuisje/"; //1 = très facile, aide l'enfant en lui disant par exemple qu'il a déjà posé cette question
var question_jaune = 0;
var question_vert = 0;
var question_triangle = 0;
var question_carre= 0;
var question_rond = 0;
var rejoue = 0;
var tour = 0;
var attendre = false;
var i,j12,ii,ma_premiere_possibilite,ma_music;
var d = new Date();
var jai_entendu;
var mon_choix = new Array();
mon_choix[0] = "9";//1
mon_choix[1] = "18";//2
mon_choix[2] = "5";//3
mon_choix[3] = "10";//4
mon_choix[4] = "6";//5
mon_choix[5] = "17";//6
mon_choix[6] = "8";//7
mon_choix[7] = "19";//8
mon_choix[8] = "11";//9
mon_choix[9] = "16";//10
mon_choix[10] = "7";//11
mon_choix[11] = "4";//12
var choix, jereponds;
var ma_musique_attente = "montertomber.mp3"
var ma_proposition = 0;
var victoire_lapin = 0;
var victoire_joueur = 0;
var nouvelle_partie,victoire_j,victoire_l;

//var tablo_q = new Array("Le fond est-il jaune?", "la forme est-elle rouge", "Est-ce un cercle?", "Est-ce un triangle?", "Est-ce un carré?", "La forme est-elle verte?", "Le fond est-il bleu?");
var tablo_q = new Array("Le fond est-il jaune?", "Est-ce un carré?", "Est-ce un cercle?", "Est-ce un triangle?",  "La forme est-elle verte?");
var tablo_c = new Array(1, 8, 16, 4, 2); //sert pour mes calculs
var tablo_cki = new Array("le fond est jaune...", "c'est un carré...", "c'est un cercle...", "c'est un triangle..", "la forme est verte...", "donc le fond est bleu!", "ça n'est pas un carré!", "ça n'est pas un cercle!", "ça n'est pas un triangle...",  "la forme est rouge");
var alea = new Array(0,3,4,2,1);
var indice_tablo, pas, mes_possibilites,combien_possibilites;
var mes_nons, repete_faux;
var quitter = false;
carte = new Array(20);
for (ii = 0; ii < 20; ii++) {
    carte[ii] = ""; 
    }
carte[4] = "12";carte[5] = "3";carte[6] = "5";carte[7] = "11";carte[8] = "7";carte[9] = "1";carte[10] = "4";carte[11] = "9";
carte[16] = "10";carte[17] = "6";carte[18] = "2";carte[19] = "8";

var grammar = " carrez | cercle |rond | triangle |  jaune |  bleu | rouge |vert | proposer";
var grammarproposition = "1 { $.param='9'}|2 { $.param='18'}|3 { $.param='5'}|4 { $.param='10'}|5 { $.param='6'}|6 { $.param='17'}|7 { $.param='8'}|8 { $.param='19'}";
var grammarproposition = grammarproposition + "| 9 { $.param='11'}|10 { $.param='16'}|11 { $.param='7'}|12 { $.param='4'}";

var monping = function(event) {
    karotz.ping();
    debuglog("ping");
    setTimeout(600000, function() { monping(); return true; });
}

var debuglog = function(string) {
    hh = "" + d.getHours();
    mm = d.getMinutes();
    if (mm < 10) { mm = "0" + mm; }
    hh = hh + 'h' + mm + " : ";
    if (karotz_ip == 'localhost') {
       // karotz.serial.write(hh + string + '\n\r');
    }
    else log(hh + string);
    return true
}

var annonce_score = function(event) {
    debuglog("***************************** annonce score ******************************");
    victoire_j = victoire_joueur; if (victoire_j == 1) victoire_j = "une";
    victoire_l = victoire_lapin; if (victoire_l == 1) victoire_l = "une";
    if ((victoire_joueur >= manche) && (victoire_lapin < manche)) {
        karotz.tts.start(manche + " manches pour toi et " + victoire_l + " pour moi, je m'incline tu es le plus fort, à charge de revanche. C'est toi qui gagne cette partie.", "fr", function(event) {
            if (event == "TERMINATED") {
                karotz.ears.moveRelative(-50000, 50000, 0);
                karotz.multimedia.play(chemin_music + "cirque.mp3", function(event) {
                    if (event == "TERMINATED") {
                        exit();
                    }
                });
            }
        });

    }
    else {
        if ((victoire_joueur < manche) && (victoire_lapin >= manche)) {
            karotz.tts.start(manche + " manches pour moi et " + victoire_j + " pour toi, rien à redire je suis le plus fort. Tu prends ta revanche quand tu veux mais ...", "fr", function(event) {
                if (event == "TERMINATED") {
                    karotz.multimedia.play(chemin_music + "jaigagne.mp3", function(event) {
                        if (event == "TERMINATED") {
                            exit();
                        }
                    });
                }
            });
        }


        else if ((victoire_joueur < manche) && (victoire_lapin < manche)) {//la partie n'est pas terninée j'annonce le score et on rejoue
            // nouvelle_partie = 1;
            raz();
            //debuglog("je viens de faire ma raz voici le a_moi " + a_moi);
            if (!a_moi) { jereponds = victoire_j + " manches pour toi et : " + victoire_l + " manche pour moi : comme tu as perdu c'est toi qui commence la prochaine manche. Quand tu es prêt à me questionner appuie 1 coup sur ma tête et parle lorsque la lumière est : orange." }
            else { jereponds = victoire_j + " manches pour toi et : " + victoire_l + " manche pour moi : comme j'ai perdu c'est moi qui commence la prochaine manche. Quand tu es prêt à m'entendre appuie 1 coup sur ma tête et réponds-moi lorsque la lumière est : orange." }
            karotz.tts.start(jereponds, "fr", function(event) {
                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                    attendre = true;
                    attente("on demarre une nouvelle partie");
                }
            });
        }
    }
    //return true;
}

var attente = function(ma_string) {
    if (!attendre) return;
    debuglog("***** attente *********** " + ma_string);

    karotz.multimedia.play(chemin_music + ma_musique_attente, function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            attente("on rejoue la musique");
        }
    });

}

var jeverifie = function(event) {
    debuglog("***************************** je verifie ******************************");
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        karotz.asr.string(grammarproposition, "fr-FR", function(asrResult) {
        if (karotz_ip == 'localhost') { jai_entendu = asrResult.semantic.param; asr_txt = asrResult.text; }
            else {jai_entendu = asrResult.semantic.substr(7, asrResult.semantic.length - 15);} 
            //debuglog("voici ce que j'ai entendu : en asrResult.semantic" + asrResult.semantic);
            //debuglog("voici ce que j'ai entendu : en text" + asrResult.text);
            //debuglog("voici ce que j'ai entendu : " + jai_entendu);
            if ((asr_txt == "<nomatch>") || (asr_txt == "") || (asr_txt == "No result before the no-input timeout") || (asr_txt == "<error_server_timeout>"))
                setTimeout(1000, function() { karotz.tts.start("je n'ai pas compris. peux-tu répéter? ", "fr", jeverifie); });
            else {
                if (jai_entendu ==  choix ) {
                    debuglog("c'est la bonne reponse ");
                    jereponds = "Félicitations tu as trouvé! Cete manche est pour toi.";
                    ma_music = "petite_victoire.mp3";
                    victoire_joueur += 1;
                    a_moi = true;
                }
                else {
                    debuglog("mauvaise reponse ");
                    if (repete_faux == 0) { repete_faux = 1; karotz.tts.start("je ne suis pas sur d'avoir bien entendu. peux-tu répéter? ", "fr", jeverifie); }
                    else {
                        jereponds = "Malheureusement ça n'est pas la bonne réponse. J'avais choisi : " + carte[choix] + " : je gagne donc cette manche";
                        repete_faux = 0;
                        ma_music = "perdu4.mp3";
                        victoire_lapin += 1;
                        a_moi = false;
                    }
                }

                //karotz.tts.start(jereponds, "fr", annonce_score);
                karotz.multimedia.play(chemin_music + ma_music, function(event) {
                    if ((event == "TERMINATED")|| (event == "CANCELLED")) {
                        karotz.tts.start(jereponds, "fr", function(event) {
                            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                annonce_score();
                            }
                        });
                    }
                });

            }
        });
    };

    return true;
}
var buttonListener = function(event) {
    debuglog("***************************** bouton listener ******************************");
    if (event == "SIMPLE") {
        attendre = false;
        karotz.multimedia.stop();
        karotz.tts.stop();
        quitter = false;
            debuglog("appui simple a_moi vaut : " + a_moi);
            if (a_moi == false) jetecoute();
            else jejoue();
    }
    else if (event == "DOUBLE") {
    karotz.multimedia.stop();
        attendre = false;
        karotz.tts.stop();
        if (!quitter) {
            quitter = true;
            karotz.tts.start("si tu veux vraiment quitter refait un double appui  sur le bouton", 'FR', function(event) {
            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                attendre = true;
                attente("un premier double clic");
                }
            });
        }
        else {
            debuglog("appui deux fois deux fois, je quitte ");
            exit();
        }
    }
    return true;
}

var oui_non = function(event) {
    debuglog("************************** oui_non*******************************************");
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        karotz.asr.string("oui | non", "fr-FR", function(asrResult) {
            validation = asrResult.text;
            log("j'ai entendu (validation) = " + validation);
            if (validation == "oui") {
                ma_proposition = ma_proposition + tablo_c[indice_tablo];
                debuglog(" ma_propOsition : " + ma_proposition);
                a_moi = false;
                karotz.tts.start(tablo_cki[indice_tablo] + " quand tu es prêt à jouer appuie 1 coup sur ma tête et parle lorsque la lumière est : orange. ", "fr", function(event) {
                    if ((event == "CANCELLED") || (event == "TERMINATED")) {
                        attendre = true;
                        attente("oui_non = oui");
                    }
                });
            }
            else {
            if (validation == "non") {
                mes_nons = mes_nons + tablo_c[indice_tablo];
                debuglog(" ma_propOsition : " + ma_proposition);

                a_moi = false;
                karotz.tts.start(tablo_cki[indice_tablo + 5] + " quand tu es prêt à jouer appuie 1 coup sur ma tête et parle lorsque la lumière est : orange.", "fr", function(event) {
                    if ((event == "CANCELLED") || (event == "TERMINATED")) {
                        attendre = true;
                        attente("oui_non = non");
                    }
                });
                }
                else {setTimeout(1000, function() { karotz.tts.start("je n'ai pas compris. : : : " + tablo_q[indice_tablo], "fr", oui_non); });}
            }
        });
    };
}


var indice_prochaine_question = function() {
    debuglog("***************************** indice prochaine question ******************************");
    indice_tablo += pas; if (indice_tablo >= 5) { indice_tablo = indice_tablo - 5; }
    if (niveau == 1) return;
    combien_peuvent_repondre = 0;
    for (jj = 0; jj < 20; jj++) {
        if ((carte[jj] != "") && ((jj & ma_proposition) == ma_proposition) && ((jj & mes_nons) == 0) && ((jj & tablo_c[indice_tablo]) == tablo_c[indice_tablo])) {
            combien_peuvent_repondre += 1;
        }
    };
    debuglog("a la question: " + tablo_c[indice_tablo] + " il y a : " + combien_peuvent_repondre + " qui peuvent repondre");
    if ((combien_peuvent_repondre == 0) || (combien_peuvent_repondre == combien_possibilites)){ indice_prochaine_question(); }
    else  {return; }
    return;
}


var jejoue = function(event) {
    debuglog("***************************** je joue ******************************");
    //debuglog("223");
    karotz.led.light("FF0000");
    tour += 1;
    //debuglog("tour : " + tour);
    //combien de réponses possibles?
    mes_possibilites = "";
    combien_possibilites = 0;
    j12 = 0;
    while (j12 < 12) {
        if ((parseInt(mon_choix[j12]) & ma_proposition) == ma_proposition) {
            if ((parseInt(mon_choix[j12]) & mes_nons) == 0) {
                combien_possibilites += 1;
                if (combien_possibilites == 1) { ma_premiere_possibilite = carte[parseInt(mon_choix[j12])]; }
                mes_possibilites = mes_possibilites + carte[parseInt(mon_choix[j12])] + ";";
                //debuglog("mes_possibilites : " + mes_possibilites);
            }
        }
        //debuglog("j12 :" + j12);
        j12 += 1;
    }
    //debuglog("je sors de ma_moi boucle j12 qui vaut " + j12);
    debuglog("mes possibilites " + combien_possibilites + ":: " + mes_possibilites);
    if (((tour == 8) && (niveau == 1)) || ((niveau == 2) && (combien_possibilites == 2)) || ((niveau == 3) && (combien_possibilites == 1))) {
        // debuglog("308");
        if (combien_possibilites == 2) mes_possibilites = ma_premiere_possibilite;
        debuglog("voici ma proposition " + ma_proposition);
        jereponds = "";
        je_propose();
    }
    else {
        //quelle question vais-je poser?
        //debuglog("avant indice_tablo + pas = : " + indice_tablo + " " + pas);
        indice_prochaine_question(); //permet de tester si la question a besoin d'être posée
        //debuglog("apres indice_tablo + pas + valeur binaire = : " + indice_tablo + " " + pas + " " + tablo_c[indice_tablo]);
        karotz.tts.start(tablo_q[indice_tablo], "fr", oui_non)
    }

    //debuglog("284");
}

function jetecoute() {
    debuglog("***************************** je tecoute ******************************");
    //*************************** provisoire pour tests
    //a_moi = true;
    //karotz.tts.start("c'est à moi à présent", "fr", jejoue)
    //*********************************************)
    karotz.led.light("0000FF");
    //debuglog("92");
    karotz.tts.start("c'est à toi, pose ta question :", "fr", function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            karotz.asr.string(grammar, "fr-FR", function(asrResult) {
                jai_entendu = asrResult.text;
                debuglog("voici ce que j'ai entendu : " + asrResult.text);
                if ((jai_entendu == "<nomatch>") || (jai_entendu == "") || (jai_entendu == "No result before the no-input timeout") || (jai_entendu == "<error_server_timeout>"))
                    setTimeout(1000, function() { jetecoute() });

                else {
                    if (jai_entendu == "jaune"){
                        debuglog("je suis dans le cas fille question_jaune vaut : " + question_jaune + " et niveau = " + niveau);
                        if ((question_jaune == 0) || ((question_jaune == 1) && (niveau == 3))) {
                            jereponds = "Non le fond est bleu!";
                            if ((choix & 1) == 1) jereponds = "Oui le fond est jaune!";
                            question_jaune = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que le fond était bleu! comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 1) == 1) jereponds = "Tu as déjà posé cette question et je t'ai répondu que le fond était jaune! comme je suis un lapin sympa tu peux rejouer";
                                rejoue = 1;
                            }
                            else {
                                if (niveau == 2) { //question déjà posée je permets qu'on en pose une autre mais je ne redonne pas la réponse
                                    jereponds = "Tu as déjà posé cette question mais comme je suis un lapin sympa tu peux rejouer";
                                    rejoue = 1;
                                }
                            }
                        }
                    }
                    if (jai_entendu == "bleu")  {
                        debuglog("je suis dans le cas bleu question_bleu vaut : " + question_bleu + " et niveau = " + niveau);
                        if ((question_bleu == 0) || ((question_bleu == 1) && (niveau == 3))) {
                            jereponds = "Non le fond est jaune!";
                            if (((choix ^ 1) & 1) == 1) jereponds = "Oui le fond est bleu!";
                            question_bleu = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que le fond était jaune! comme je suis un lapin sympa tu peux rejouer";
                                if (((choix ^ 1) & 1) == 1) jereponds = "Tu as déjà posé cette question et je t'ai répondu que le fond est bleu! comme je suis un lapin sympa tu peux rejouer";
                                rejoue = 1;
                            }
                            else {
                                if (niveau == 2) { //question déjà posée je permets qu'on en pose une autre mais je ne redonne pas la réponse
                                    jereponds = "Tu as déjà posé cette question mais comme je suis un lapin sympa tu peux rejouer";
                                    rejoue = 1;
                                }
                            }
                        }
                    }
                    if (jai_entendu == "vert") {
                        debuglog("je suis dans le case vert choix & 2 " + (choix & 2));
                        if ((question_vert == 0) || ((question_vert == 1) && (niveau == 3))) {
                            jereponds = "Non la forme n'est pas verte!";
                            if ((choix & 2) == 2) jereponds = "Oui la forme est verte!";
                            question_vert = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que la forme n'était pas verte mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 2) == 2) jereponds = "Tu as déjà posé cette question et je t'ai répondu que était verte et comme je suis un lapin sympa tu peux rejouer";
                                rejoue = 1;
                            }
                            else {
                                if (niveau == 2) { //question déjà posée je permets qu'on en pose une autre mais je ne redonne pas la réponse
                                    jereponds = "Tu as déjà posé cette question mais comme je suis un lapin sympa tu peux rejouer";
                                    rejoue = 1;
                                }
                            }
                        }
                    }
                    if (jai_entendu == "rouge") {
                        debuglog("je suis dans le case rouge choix ^ 2 " + (choix ^ 2));
                        if ((question_rouge == 0) || ((question_rouge == 1) && (niveau == 3))) {
                            jereponds = "Non la forme est verte!";
                            if (((choix ^ 2) & 2) == 2) jereponds = "Oui la forme est rouge!";
                            question_rouge = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma était verte mais comme je suis un lapin sympa tu peux rejouer";
                                if (((choix ^ 2) & 2) == 2) jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma forme était rouge et comme je suis un lapin sympa tu peux rejouer";
                                rejoue = 1;
                            }
                            else {
                                if (niveau == 2) { //question déjà posée je permets qu'on en pose une autre mais je ne redonne pas la réponse
                                    jereponds = "Tu as déjà posé cette question mais comme je suis un lapin sympa tu peux rejouer";
                                    rejoue = 1;
                                }
                            }
                        }
                    }
                    if (jai_entendu == "triangle") {
                        debuglog("je suis dans le case  triangle choix & 4 " + (choix & 4));
                        if ((question_triangle == 0) || ((question_triangle == 1) && (niveau == 3))) {
                            jereponds = "mon ma forme n'est pas un triangle!";
                            if ((choix & 4) == 4) jereponds = "Oui ma forme est un triangle!";
                            question_triangle = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma forme n'était pas un triangle mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 4) == 4) jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma forme était un triangle et comme je suis un lapin sympa tu peux rejouer";
                                rejoue = 1;
                            }
                            else {
                                if (niveau == 2) { //question déjà posée je permets qu'on en pose une autre mais je ne redonne pas la réponse
                                    jereponds = "Tu as déjà posé cette question mais comme je suis un lapin sympa tu peux rejouer";
                                    rejoue = 1;
                                }
                            }
                        }
                    }
                    if (jai_entendu == "carrez") {
                        debuglog("je suis dans le case carrez choix & 8 " + (choix & 8));
                        //jereponds = "Non mon lapin ne porte pas de lunettes!"; if ((choix & 8) == 8) jereponds = "Oui mon lapin porte des lunettes!";
                        if ((question_carre == 0) || ((question_carre == 1) && (niveau == 3))) {
                            jereponds = "Non ma forme n'est pas un carré!";
                            if ((choix & 8) == 8) jereponds = "Oui ma forme est un carré!";
                            question_carre = 8;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma forme n'était pas un carré mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 1) == 1) jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma forme était un carré et comme je suis un lapin sympa tu peux rejouer";
                                rejoue = 1;
                            }
                            else {
                                if (niveau == 2) { //question déjà posée je permets qu'on en pose une autre mais je ne redonne pas la réponse
                                    jereponds = "Tu as déjà posé cette question mais comme je suis un lapin sympa tu peux rejouer";
                                    rejoue = 1;
                                }
                            }
                        }
                    }
                    if ((jai_entendu == "rond")|| (jai_entendu == "cercle")) {
                        debuglog("je suis dans le case chapeau choix & 16 " + (choix & 16));
                        //jereponds = "Non pas de chapeau!"; if ((choix & 16) == 16) jereponds = "Oui il porte un chapeau!";
                        if ((question_rond == 0) || ((question_rond == 1) && (niveau == 3))) {
                            jereponds = "Non ma forme n'est pas un cercle!";
                            if ((choix & 16) == 16) jereponds = "Oui ma forme est un cercle";
                            question_rond = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma forme n'était pas ronde mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 16) == 16) jereponds = "Tu as déjà posé cette question et je t'ai répondu que ma forme était un cercle et comme je suis un lapin sympa tu peux rejouer";
                                rejoue = 1;
                            }
                            else {
                                if (niveau == 2) { //question déjà posée je permets qu'on en pose une autre mais je ne redonne pas la réponse
                                    jereponds = "Tu as déjà posé cette question mais comme je suis un lapin sympa tu peux rejouer";
                                    rejoue = 1;
                                }
                            }
                        }
                    }
                    if (jai_entendu == "proposer") {
                        debuglog("je suis dans le cas proposer ");
                        jereponds = "je t'écoute! Quelle est ta proposition?";
                    }

                    if ((jai_entendu != "proposer") && (rejoue == 0)) {
                        a_moi = true; karotz.tts.start(jereponds + " : : : appuie sur ma tête quand tu veux entendre ma question", "fr", function(event) {
                            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                attendre = true;
                                attente("not proposer et rejoue = 0");
                            }
                        });
                    }
                    else {
                        if (jai_entendu == "proposer") karotz.tts.start(jereponds, "fr", jeverifie);
                        else {
                            rejoue = 0;
                            karotz.tts.start(jereponds, "fr", jetecoute);
                        }
                    }
                }
            });
        };
    });

}

var raz = function() {
    nouvelle_partie = 0; tour = 0;  question_jaune = 0; question_vert = 0; question_triangle = 0; question_carre = 0;
    question_rond = 0;  rejoue = 0; ma_proposition = 0; mes_nons = 0; repete_faux = 0;
    question_bleu = 0; question_rouge = 0; 
    choix = mon_choix[Math.floor(Math.random() * 12)];
    indice_tablo = Math.floor(Math.random() * 5)
    pas = 1 + Math.floor(Math.random() * 4); //pas vaut de 1 à 4
    //choix = 51; //pour tests uniquement me permet de gagner plus vite
    // ma_proposition = 5; mes_nons = 122;//pour tests uniquement lui permet de gagner de suite
    debuglog("le choix de mon personnage est : " + choix);
}


var onKarotzConnect = function(data) {
    debuglog("***************************** on karotzconnect ******************************");
  /*  if (karotz_ip == 'localhost') {
        karotz.serial.open("/dev/ttyGS0", 9600);
        debuglog("**************** demarrage de l'application ***********");
        debuglog(' appli lancee par ' + launchType.name);
        debuglog(' identifiant du lapin : ' + params[instanceName].uuid);
        
    }*/
    raz();
    monping();
    karotz.button.addListener(buttonListener);
    jereponds = "";
    a_moi = false;
    if (niveau == 1) jereponds = "tu as choisis le niveau un, je te laisse donc commencer, bonne chance à toi. Lorsque tu es prêt à jouer appuie 1 coup sur ma tête et parle lorsque la lumière est : orange..";
    //else if (niveau == 3) { a_moi = true; jereponds = "tu as choisis le niveau 3 nan mais je rêve tu crois vraiment que tu vas me battre? : : : tu te crois le plus fort? : : : Okay : : : on va voir ça! je vais donc commencer, mais  bonne chance à toi. Appuie sur ma tête lorsque tu es prêt à m'entendre."; }
    else if ((niveau == 2) && (Math.floor(Math.random() * 10) > 4)) { a_moi = true; jereponds = "tu as choisis le niveau 2, le sor a décidé que c'est moi qui vais commencer, mais  bonne chance à toi. Appuie sur ma tête lorsque tu es prêt à m'entendre."; }
    else jereponds = "tu as choisis le niveau 2, le sor a décidé que c'est toi qui allait commencer, alors  bonne chance à toi. Lorsque tu es prêt à jouer appuie 1 coup sur ma tête et parle lorsque la lumière est : orange..";
    karotz.tts.start(jereponds, "fr", function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            attendre = true;
            attente("ma premiere attente");
        }
    }); ;
}
var je_propose = function() {
    karotz.tts.start(jereponds + "Je pense avoir trouvé il s'agit de : " + mes_possibilites + ' ? Oui ou non?', "fr", function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            debuglog("je rentre dans mon je propose ********************************************");
            karotz.asr.string("oui | non", "fr-FR", function(asrResult) {
                validation_bonne_reponse = asrResult.text;
                log("validation_bonne_reponse = " + validation_bonne_reponse);
                if (validation_bonne_reponse == "zut") {
                    victoire_lapin += 1;
                    a_moi = false;
                    karotz.multimedia.play(chemin_music + "victoire_modeste.mp3", function(event) {
                    if ((event == "CANCELLED") || (event == "TERMINATED")) {
                            karotz.tts.start("J'ai gagné voici le score ", "fr", annonce_score);
                        }
                    }); //fin function event multimedia.play
                    
                    
                } //fin du validation = oui
                    else if ((validation_bonne_reponse == "non") && (niveau == 2)) {
                            victoire_joueur += 1;
                            a_moi = true;
                            karotz.multimedia.play(chemin_music + "perdu.mp3", function(event) {
                            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                karotz.tts.start("Je m'incline, je me suis trompé! : : Cette manche te revient donc. : : voici le score ", "fr", function(event) {
                                    if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                        annonce_score();
                                    }
                                });
                                }
                            }); //fin function event multimedia.play
                        } //fin du validation = non niveau 2
                        else if ((validation_bonne_reponse == "non") && (niveau != 2)) {
                                victoire_lapin += 1;
                                a_moi = false;
                                karotz.multimedia.play(chemin_music + "ponctuation.mp3", function(event) {
                                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                    karotz.tts.start("Permets-moi d'être surpris de ta réponse : : ma réponse est forcément la bonne je considère donc que j'ai gagné! : : voici le score ", "fr", function(event) {
                                        if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                            annonce_score();
                                        }
                                    });
                                    }
                                }); //fin function event multimedia.play
                            } //fin du validation = non niveau 2
                            else if (validation_bonne_reponse == "oui")  {
                                    victoire_lapin += 1;
                                    a_moi = false;
                                    karotz.multimedia.play(chemin_music + "victoire_modeste.mp3", function(event) {
                                        if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                            karotz.tts.start("j'ai gagné! : : voici le score ", "fr", function(event) {
                                                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                                    annonce_score();
                                                }
                                            });
                                        }
                                    }); //fin function event multimedia.play
                                } //fin du validation = non niveau 2
                                else {

                                    jereponds = "je n'ai pas compris ta réponse. : : : je refais donc ma proposition. : : : ";
                                    je_propose();
                                }

            }); //fin asr string
            // debuglog("ici je sors de ma boucle je propose ce qui ne doit jamai sarriver");
        }
    })
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
