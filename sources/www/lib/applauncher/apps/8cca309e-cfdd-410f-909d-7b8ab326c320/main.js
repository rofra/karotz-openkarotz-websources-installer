include("util.js");
//var karotz_ip = "192.168.1.46";
//var karotz_ip = "192.168.1.29";
var karotz_ip = "localhost";
var a_moi = false;
var hh, mm;
var validation_bonne_reponse, validation, combien_peuvent_repondre,jj;
if (karotz_ip == 'localhost') { var niveau = parseInt(params[instanceName].niveau); }
else var niveau = 2; //1 = très facile, aide l'enfant en lui disant par exemple qu'il a déjà posé cette question
if (karotz_ip == 'localhost') { var chemin_music = "/usr/karotz/apps/8cca309e-cfdd-410f-909d-7b8ab326c320/"; }//vrai chemin
//if (karotz_ip == 'localhost') { var chemin_music = "/usr/karotz/apps/491ed7c6-c3b0-482f-baee-d206693006f2/"; } //appli tests alain
//if (karotz_ip == 'localhost') { var chemin_music = "/usr/karotz/apps/a1377c8e-4cf1-4d16-b221-e6b9d930e059/"; } //appli tests jess
else var chemin_music = "http://www.bregeon.net/karotz/quisuisje/"; //1 = très facile, aide l'enfant en lui disant par exemple qu'il a déjà posé cette question
var question_fille = 0;
var question_cheveux = 0;
var question_moustache = 0;
var question_lunettes= 0;
var question_chapeau = 0;
var question_bouche = 0;
var question_oreille = 0;
var rejoue = 0;
var tour = 0;
var attendre = false;
var i,j12,ii,ma_premiere_possibilite,ma_music;
var d = new Date();
var jai_entendu, asr_txt;
var mon_choix = new Array();
mon_choix[0] = "3";//yah
mon_choix[1] = "5";//kitty
mon_choix[2] = "10";//harry
mon_choix[3] = "16";//doc
mon_choix[4] = "26";//nao
mon_choix[5] = "34";//YOH
mon_choix[6] = "35";//carmen
mon_choix[7] = "38";//PAULO
mon_choix[8] = "43";//LARA
mon_choix[9] = "46";//prof
mon_choix[10] = "50";//patou
mon_choix[11] = "51";//cleo
mon_choix[12] = "54";//JACK
mon_choix[13] = "80";//marin
mon_choix[14] = "74";//elvisse
mon_choix[15] = "84";//KUISTO
mon_choix[16] = "86";//tim
mon_choix[17] = "98";//box
mon_choix[18] = "99";//BUNNY
mon_choix[19] = "107";//BRIGITTE
mon_choix[20] = "110";//max
mon_choix[21] = "114";//VICK
mon_choix[22] = "115";//PËCHE
mon_choix[23] = "118";//FRED
var choix, jereponds;
var ma_musique_attente = "montertomber.mp3"
var ma_proposition = 0;
var victoire_lapin = 0;
var victoire_joueur = 0;
var nouvelle_partie,victoire_j,victoire_l;

var tablo_q = new Array("Est-ce une fille?", "Ton lapin se prend-il pour une star en portant des lunettes", "Ses oreilles sont-elles rouges?", "Ton lapin a-til un chapeau?", "Est-ce que ton lapin a une bouche?", "Ton lapin a-t-il une moustache?", "Est-ce que ton lapin a des cheveux?");
var tablo_c = new Array(1, 8, 64, 16, 32, 4, 2); //sert pour mes calculs
var tablo_cki = new Array("c'est une fille...", "il porte des lunettes...", "il a les oreilles rouges...", "il a un chapeau...", "il a une bouche...", "il a une moustache...", "il a des cheveux...", "donc c'est un garçon!", "donc il ne porte pas de lunettes!", "donc il a les oreilles blanches!", "il n'a pas de chapeau...", "il n' a pas de bouche", "il est imberbe", "il est chauve alors");
var alea = new Array(0,3,6,4,5,2,1);
var indice_tablo, pas, mes_possibilites,combien_possibilites;
var mes_nons, repete_faux;
var quitter = false;
carte = new Array(119);
for (ii = 0; ii < 119; ii++) {
    carte[ii] = ""; 
    }
carte[3] = "yah";carte[5] = "kitty";carte[10] = "harry";carte[16] = "doc";carte[26] = "nao";carte[34] = "yoh";carte[35] = "carmen";carte[38] = "paulo";
carte[43] = "lara";carte[46] = "prof";carte[50] = "patou";carte[51] = "cleo";carte[54] = "jack";carte[80] = "marin";carte[74] = "elvisse";carte[84] = "kuisto";
carte[86] = "tim";carte[98] = "box";carte[99] = "bunny";carte[107] = "brigitte";carte[110] = "max";carte[114] = "vick";carte[115] = "paiche";carte[118] = "fred";

var grammar = " fille | garsson |cheveux | chauve | moustache | imberbe | lunettes |chapeau |bouche |[oreille] rouge|[oreille] blanche | proposer";
var grammarproposition = "yah { $.param='3'}|jack { $.param='54'}|fred { $.param='118'}|cleho { $.param='51'}|lara { $.param='43'}|bunny { $.param='99'}|kitty { $.param='5'}|elvisse { $.param='74'}";
var grammarproposition = grammarproposition + "| brigitte { $.param='107'}|harry { $.param='10'}|patou { $.param='50'}|carmen { $.param='35'}|paiche { $.param='115'}|yoh { $.param='34'}|vick { $.param='114'}|box { $.param='98'}";
var grammarproposition = grammarproposition + "|max { $.param='110'}|doc { $.param='16'}|marin { $.param='80'}|tim { $.param='86'}|nao { $.param='26'}|prof { $.param='46'}|kuisto { $.param='84'}|paulo { $.param='38'}";

var monping = function(event) {
    karotz.ping();
    debuglog("ping");
    setTimeout(600000, function() { monping(); return true; });
}

var debuglog = function(string) {
  /*  hh = "" + d.getHours();
    mm = d.getMinutes();
    if (mm < 10) { mm = "0" + mm; }
    hh = hh + 'h' + mm + " : ";
    if (karotz_ip == 'localhost') {
        sring = string.replace(/[àâä]/gi, "a").replace(/[éèêë]/gi, "e").replace(/[ç]/gi, "c").replace(/[îï]/gi, "i").replace(/[ùû]/gi, "u").replace(/[ôóö]/gi, "o"); 
        karotz.serial.write(hh + string + '\n\r');
    }
    else log(hh + string);*/
    return true
}

var annonce_score = function() {
    debuglog("***************************** annonce score ******************************");
    victoire_j = victoire_joueur; if (victoire_j == 1) victoire_j = "une";
    victoire_l = victoire_lapin; if (victoire_l == 1) victoire_l = "une";
    if ((victoire_joueur >= 3) && (victoire_lapin < 3)) {
        karotz.tts.start(" 3 manches pour toi et " + victoire_l + " pour moi, je m'incline tu es le plus fort, à charge de revanche. C'est toi qui gagne cette partie.", "fr", function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
                karotz.ears.moveRelative(-50000, 50000, 0);
                karotz.multimedia.play(chemin_music + "cirque.mp3", function(event) {
                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                        exit();
                    }
                });
            }
        });

    }
    else {
        if ((victoire_joueur < 3) && (victoire_lapin >= 3)) {
            karotz.tts.start(" 3 manches pour moi et " + victoire_j + " pour toi, rien à redire je suis le plus fort. Tu prends ta revanche quand tu veux mais ...", "fr", function(event) {
            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                    karotz.multimedia.play(chemin_music + "jaigagne.mp3", function(event) {
                    if ((event == "CANCELLED") || (event == "TERMINATED")) {
                            exit();
                        }
                    });
                }
            });
        }


        else if ((victoire_joueur < 3) && (victoire_lapin < 3)) {//la partie n'est pas terninée j'annonce le score et on rejoue
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

var jeverifie = function()
{
    debuglog("***************************** je verifie ******************************");
    //  if ((event == "CANCELLED") || (event == "TERMINATED")) {
    karotz.asr.string(grammarproposition, "fr-FR", function(asrResult)
    {
        if (karotz_ip == 'localhost') { jai_entendu = asrResult.semantic.param; asr_txt = asrResult.text; }
        else { jai_entendu = asrResult.semantic.substr(7, asrResult.semantic.length - 15); }
        //debuglog("voici ce que j'ai entendu : en asrResult.semantic" + asrResult.semantic);
        //debuglog("voici ce que j'ai entendu : en text" + asrResult.text);
        //debuglog("voici ce que j'ai entendu : " + jai_entendu);
        if ((asr_txt == "<nomatch>") || (asr_txt == "") || (asr_txt == "No result before the no-input timeout") || (asr_txt == "<error_server_timeout>"))
            setTimeout(1000, function()
            {
                karotz.tts.start("je n'ai pas compris. peux-tu répéter? ", "fr", function(event)
                {
                    if ((event == "CANCELLED") || (event == "TERMINATED")) {
                        jeverifie();
                    }
                });
            });
        else {
            if (jai_entendu == choix) {
                debuglog("c'est la bonne reponse ");
                jereponds = "Félicitations tu as trouvé! Cete manche est pour toi.";
                ma_music = "petite_victoire.mp3";
                victoire_joueur += 1;
                a_moi = true;
            }
            else {
                debuglog("mauvaise reponse ");
                if (repete_faux == 0) {
                    repete_faux = 1;
                    karotz.tts.start("je ne suis pas sur d'avoir bien entendu. peux-tu répéter? ", "fr", function(event)
                    {
                        if ((event == "CANCELLED") || (event == "TERMINATED")) {
                            jeverifie();
                        }
                    });
                }
                else {
                    jereponds = "Malheureusement ça n'est pas la bonne réponse. J'avais choisi : " + carte[choix] + " : je gagne donc cette manche";
                    repete_faux = 0;
                    ma_music = "perdu4.mp3";
                    victoire_lapin += 1;
                    a_moi = false;
                }
            }

            //karotz.tts.start(jereponds, "fr", annonce_score);
            karotz.multimedia.play(chemin_music + ma_music, function(event)
            {
                if ((event == "TERMINATED") || (event == "CANCELLED")) {
                    karotz.tts.start(jereponds, "fr", function(event)
                    {
                        if ((event == "CANCELLED") || (event == "TERMINATED")) {
                            annonce_score();
                        }
                    });
                }
            });

        }
    });
    //    };

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
    else if (event == "LONG_STOP") {
    karotz.multimedia.stop();
        karotz.tts.stop();
        exit();
    }
    return true;
}

var oui_non = function() {
    debuglog("************************** oui_non*******************************************");
    //if ((event == "CANCELLED") || (event == "TERMINATED")) {
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
                karotz.tts.start(tablo_cki[indice_tablo + 7] + " quand tu es prêt à jouer appuie 1 coup sur ma tête et parle lorsque la lumière est : orange.", "fr", function(event) {
                    if ((event == "CANCELLED") || (event == "TERMINATED")) {
                        attendre = true;
                        attente("oui_non = non");
                    }
                });
                }
                else {
                    setTimeout(1000, function()
                    {
                        karotz.tts.start("je n'ai pas compris. : : : " + tablo_q[indice_tablo], "fr", function(event)
                        {
                            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                oui_non();
                            }
                        });
                        
                        
                    });
                   }
            }
        });
   // };
}


var indice_prochaine_question = function() {
    debuglog("***************************** indice prochaine question ******************************");
    indice_tablo += pas; if (indice_tablo >= 7) { indice_tablo = indice_tablo - 7; }
    if (niveau == 1) return;
    combien_peuvent_repondre = 0;
    for (jj = 0; jj < 119; jj++) {
        if ((carte[jj] != "") && ((jj & ma_proposition) == ma_proposition) && ((jj & mes_nons) == 0) && ((jj & tablo_c[indice_tablo]) == tablo_c[indice_tablo])) {
            combien_peuvent_repondre += 1;
        }
    };
    debuglog("a la question: " + tablo_c[indice_tablo] + " il y a : " + combien_peuvent_repondre + " qui peuvent repondre");
    if ((combien_peuvent_repondre == 0) || (combien_peuvent_repondre == combien_possibilites)){ indice_prochaine_question(); }
    else  {return; }
    return;
}


var jejoue = function() {
    debuglog("***************************** je joue ******************************");
    //debuglog("223");
    karotz.led.light("FF0000");
    tour += 1;
    //debuglog("tour : " + tour);
    //combien de réponses possibles?
    mes_possibilites = "";
    combien_possibilites = 0;
    j12 = 0;
    while (j12 < 24) {
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
        /*  karotz.tts.start("Je pense avoir trouvé il s'agit de : " + mes_possibilites + ' ? Oui ou non?', "fr", function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
        je_propose();
        }
        });*/
    }
    else {
        //quelle question vais-je poser?
        //debuglog("avant indice_tablo + pas = : " + indice_tablo + " " + pas);
        //indice_tablo += pas; if (indice_tablo >= 7) { indice_tablo = indice_tablo - 7; }
        indice_prochaine_question(); //permet de tester si la question a besoin d'être posée
        //debuglog("apres indice_tablo + pas + valeur binaire = : " + indice_tablo + " " + pas + " " + tablo_c[indice_tablo]);
        karotz.tts.start(tablo_q[indice_tablo], "fr", function(event)
        {
            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                oui_non();
            }
        });
    }

    //debuglog("284");
}

var jetecoute = function()
{
    debuglog("***************************** je tecoute ******************************");
    //*************************** provisoire pour tests
    //a_moi = true;
    //karotz.tts.start("c'est à moi à présent", "fr", jejoue)
    //*********************************************)
    karotz.led.light("0000FF");
    //debuglog("92");
    karotz.tts.start("c'est à toi, pose ta question :", "fr", function(event)
    {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            karotz.asr.string(grammar, "fr-FR", function(asrResult)
            {
                jai_entendu = asrResult.text;
                debuglog("voici ce que j'ai entendu : " + asrResult.text);
                if ((jai_entendu == "<nomatch>") || (jai_entendu == "") || (jai_entendu == "No result before the no-input timeout") || (jai_entendu == "<error_server_timeout>"))
                    setTimeout(1000, function() { jetecoute() });

                else {
                    if (jai_entendu == "fille") {
                        debuglog("je suis dans le cas fille question_fille vaut : " + question_fille + " et niveau = " + niveau);
                        if ((question_fille == 0) || ((question_fille == 1) && (niveau == 3))) {
                            jereponds = "Non mon lapin est un garçon!";
                            if ((choix & 1) == 1) jereponds = "Oui mon lapin est bien une fille!";
                            question_fille = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin était un garçon! comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 1) == 1) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin était une fille! comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "garsson") {
                        debuglog("je suis dans le cas garsson question_garsson vaut : " + question_garsson + " et niveau = " + niveau);
                        if ((question_garsson == 0) || ((question_garsson == 1) && (niveau == 3))) {
                            jereponds = "Non mon lapin est une fille!";
                            if (((choix ^ 1) & 1) == 1) jereponds = "Oui mon lapin est bien un garsson!";
                            question_garsson = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin était une fille! comme je suis un lapin sympa tu peux rejouer";
                                if (((choix ^ 1) & 1) == 1) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin était un garçon! comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "cheveux") {
                        debuglog("je suis dans le case cheveux choix & 2 " + (choix & 2));
                        if ((question_cheveux == 0) || ((question_cheveux == 1) && (niveau == 3))) {
                            jereponds = "Non mon lapin n'a pas de cheveux!";
                            if ((choix & 2) == 2) jereponds = "Oui mon lapin a bien des cheveux!";
                            question_cheveux = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin n'avait pas de cheveux mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 2) == 2) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait bien des cheveux et comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "chauve") {
                        debuglog("je suis dans le case chauve choix ^ 2 " + (choix ^ 2));
                        if ((question_chauve == 0) || ((question_chauve == 1) && (niveau == 3))) {
                            jereponds = "Non mon lapin a des cheveux!";
                            if (((choix ^ 2) & 2) == 2) jereponds = "Oui mon lapin est chauve!";
                            question_chauve = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait des cheveux mais comme je suis un lapin sympa tu peux rejouer";
                                if (((choix ^ 2) & 2) == 2) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin était bien chauve et comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "moustache") {
                        debuglog("je suis dans le case  choix & 4 " + (choix & 4));
                        if ((question_moustache == 0) || ((question_moustache == 1) && (niveau == 3))) {
                            jereponds = "mon lapin n'a pas de moustache!";
                            if ((choix & 4) == 4) jereponds = "Oui mon lapin a une moustache!";
                            question_moustache = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin n'avait pas de moustache mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 4) == 4) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait bien une moustache et comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "imberbe") {
                        debuglog("je suis dans le case  choix ^ 4 " + (choix ^ 4));
                        if ((question_imberbe == 0) || ((question_imberbe == 1) && (niveau == 3))) {
                            jereponds = "mon lapin a une moustache!";
                            if (((choix ^ 4) & 4) == 4) jereponds = "Oui mon lapin est imberbe il n'a donc pas de moustache!";
                            question_moustache = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait une moustache mais comme je suis un lapin sympa tu peux rejouer";
                                if (((choix ^ 4) & 4) == 4) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin était bien imberbe et comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "lunettes") {
                        debuglog("je suis dans le case lunettes choix & 8 " + (choix & 8));
                        //jereponds = "Non mon lapin ne porte pas de lunettes!"; if ((choix & 8) == 8) jereponds = "Oui mon lapin porte des lunettes!";
                        if ((question_lunettes == 0) || ((question_lunettes == 1) && (niveau == 3))) {
                            jereponds = "Non mon lapin ne porte pas de lunettes!, il mange des carottes c'est bon pour la vue!";
                            if ((choix & 8) == 8) jereponds = "Oui mon lapin a des lunettes, il ne doit pas manger assez de carottes!";
                            question_lunettes = 8;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin n'avait pas de lunettes mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 1) == 1) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin portait des lunettes et comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "chapeau") {
                        debuglog("je suis dans le case chapeau choix & 16 " + (choix & 16));
                        //jereponds = "Non pas de chapeau!"; if ((choix & 16) == 16) jereponds = "Oui il porte un chapeau!";
                        if ((question_chapeau == 0) || ((question_chapeau == 1) && (niveau == 3))) {
                            jereponds = "Non pas de chapeau!";
                            if ((choix & 16) == 16) jereponds = "Oui mon lapin porte un chapeau";
                            question_chapeau = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin ne portait pas de chapeau mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 16) == 16) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin portait un chapeau et comme je suis un lapin sympa tu peux rejouer";
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
                    if (jai_entendu == "bouche") {
                        debuglog("je suis dans le case bouche choix & 32 " + (choix & 32));
                        // jereponds = "Non mon lapin n'a pas de bouche!"; if ((choix & 32) == 32) jereponds = "Oui mon lapin a une bouche!";
                        if ((question_bouche == 0) || ((question_bouche == 1) && (niveau == 3))) {
                            jereponds = "Non mon lapin n'a pas de bouche!";
                            if ((choix & 32) == 32) jereponds = "Oui mon lapin a une bouche!";
                            question_bouche = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin n'avait pas de bouche mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 32) == 32) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait bien une bouche et comme je suis un lapin sympa tu peux rejouer";
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
                    if ((jai_entendu == "rouge") || (jai_entendu == "oreille rouge")) {
                        debuglog("je suis dans le case rouge choix & 64 " + (choix & 64));
                        //jereponds = "Non il a des oreilles blanches!"; if ((choix & 64) == 64) jereponds = "Oui mon lapin a bien des oreilles rouges!";
                        if ((question_oreille == 0) || ((question_oreille == 1) && (niveau == 3))) {
                            jereponds = "Laisse moi regarder! : : : : ah bien non il a des oreilles blanches!";
                            if ((choix & 64) == 64) jereponds = "Laisse moi regarder! : : : : ah oui on dirait bien que ses oreilles sont rouges.";
                            question_oreille = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait des oreilles blanches mais comme je suis un lapin sympa tu peux rejouer";
                                if ((choix & 64) == 64) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait des oreilles rouges et comme je suis un lapin sympa tu peux rejouer";
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
                    if ((jai_entendu == "blanche") || (jai_entendu == "oreille blanche")) {
                        debuglog("je suis dans le cas blanche choix ^ 64 " + (choix ^ 64));
                        //jereponds = "Non il a des oreilles blanches!"; if ((choix & 64) == 64) jereponds = "Oui mon lapin a bien des oreilles rouges!";
                        if ((question_blanche == 0) || ((question_blanche == 1) && (niveau == 3))) {
                            jereponds = "Laisse moi regarder! : : : : ah bien non il a des oreilles rouges!";
                            if (((choix ^ 64) & 64) == 64) jereponds = "Attends il faut que je regarde! : : : : ah oui on dirait bien que ses oreilles sont blanches.";
                            question_blanche = 1;
                        }
                        else {
                            if (niveau == 1) { //question déjà posée je permets qu'on en pose une autre et je redonne la réponse
                                jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait des oreilles rouges mais comme je suis un lapin sympa tu peux rejouer";
                                if (((choix ^ 64) & 64) == 64) jereponds = "Tu as déjà posé cette question et je t'ai répondu que mon lapin avait des oreilles blanches et comme je suis un lapin sympa tu peux rejouer";
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
                        a_moi = true; karotz.tts.start(jereponds + " : : : appuie sur ma tête quand tu veux entendre ma question", "fr", function(event)
                        {
                            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                attendre = true;
                                attente("not proposer et rejoue = 0");
                            }
                        });
                    }
                    else {
                        if (jai_entendu == "proposer") {
                            karotz.tts.start(jereponds, "fr", function(event)
                            {
                                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                    jeverifie();
                                }
                            });
                        }
                        else {
                            rejoue = 0;
                            karotz.tts.start(jereponds, "fr", function(event)
                            {
                                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                    jetecoute();
                                }
                            });
                        }
                    }
                }
            });
        };
    });

}

var raz = function() {
    nouvelle_partie = 0; tour = 0;  question_fille = 0; question_cheveux = 0; question_moustache = 0; question_lunettes = 0;
    question_chapeau = 0; question_bouche = 0; question_oreille = 0; rejoue = 0; ma_proposition = 0; mes_nons = 0; repete_faux = 0;
    question_garsson = 0; question_chauve = 0; question_imberbe = 0; question_blanche = 0;
    choix = mon_choix[Math.floor(Math.random() * 24)];
    indice_tablo = Math.floor(Math.random() * 7)
    pas = 1 + Math.floor(Math.random() * 6); //pas vaut de 1 à 6
    //choix = 51; //pour tests uniquement me permet de gagner plus vite
    // ma_proposition = 5; mes_nons = 122;//pour tests uniquement lui permet de gagner de suite
    debuglog("le choix de mon personnage est : " + choix);
}


var onKarotzConnect = function(data) {
    debuglog("***************************** on karotzconnect ******************************");
 /*   if (karotz_ip == 'localhost') {
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
    else if (niveau == 3) { a_moi = true; jereponds = "tu as choisis le niveau 3 nan mais je rêve tu crois vraiment que tu vas me battre? : : : tu te crois le plus fort? : : : Okay : : : on va voir ça! je vais donc commencer, mais  bonne chance à toi. Appuie sur ma tête lorsque tu es prêt à m'entendre."; }
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
                        karotz.tts.start("J'ai gagné voici le score ", "fr", function(event)
                        {
                            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                                annonce_score();
                            }
                        });
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
