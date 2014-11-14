include("util.js");
include("tinyxmldom.js");
var lien, titre, auteur, mon_xml, nbre_item, i, date, date_item, dernier_numero_lu;
var fin_lecture = 0;
var j = 0;
var rate = "slow"; //params[instanceName].rate
var pitch = "medium"; //params[instanceName].pitch

var mon_rss, flux_lu, jourdate;
var d = new Date();
var lecture_description = false;
//var karotz_ip="192.168.1.46";
//var karotz_ip="10.0.252.180";
var karotz_ip = "localhost";
if (karotz_ip == 'localhost') { var duree_pour_lire = +params[instanceName].duree_pour_lire; }
else var duree_pour_lire = 1500; //durée en ms
/*if (karotz_ip == 'localhost') { var lire_date = +params[instanceName].lire_date; }
else var lire_date = 1; //1 je lis la date, 0 je ne lis pas la date*/
if (karotz_ip == 'localhost') { var item_a_lire = +params[instanceName].item_a_lire; }
else var item_a_lire = 5;
if (karotz_ip == 'localhost') { var lire_acteurs = params[instanceName].lire_acteurs; }
else var lire_acteurs = "1";//0 = non, 1 = oui



var enleve_balise = function(mon_html) {
    //PROCESS STRING
    if (arguments.length < 3) {
        mon_html = mon_html.replace(/<\/?(?!\!)[^>]*>/gi, '');
    } else {
        var allowed = arguments[1];
        var specified = eval("[" + arguments[2] + "]");
        if (allowed) {
            var regex = '</?(?!(' + specified.join('|') + '))\b[^>]*>';
            mon_html = mon_html.replace(new RegExp(regex, 'gi'), '');
        } else {
            var regex = '</?(' + specified.join('|') + ')\b[^>]*>';
            mon_html = mon_html.replace(new RegExp(regex, 'gi'), '');
        }
    }
    return mon_html;
}
var calcul_date = function(num) {
    date = mon_xml.docNode.selectNode("/channel/item[" + num + "]/pubDate").getText();
    debuglog("date item en sortie du selectnode : " + date);
    date_item = date.substring(12, 16);
    //debuglog("date_mois :" + date.substring(8, 12));
    switch (date.substring(8, 11)) {
        case "Jan":
            date_item = date_item + "01";
            break;
        case "Feb":
            date_item = date_item + "02";
            break;
        case "Mar":
            date_item = date_item + "03";
            break;
        case "Apr":
            date_item = date_item + "04";
            break;
        case "May":
            date_item = date_item + "05";
            break;
        case "Jun":
            date_item = date_item + "06";
            break;
        case "Jul":
            date_item = date_item + "07";
            break;
        case "Aug":
            date_item = date_item + "08";
            break;
        case "Sep":
            date_item = date_item + "09";
            break;
        case "Oct":
            date_item = date_item + "10";
            break;
        case "Nov":
            date_item = date_item + "11";
            break;
        case "Dec":
            date_item = date_item + "12";
            break;
    }
    date_item = date_item + date.substring(5, 7) + date.substring(17, 19) + date.substring(20, 22) + date.substring(23, 25);
    debuglog("ma date item : " + date_item);
    return date_item;




}
var debuglog = function(string) {
    //var d = new Date();
    var hh = "" + d.getHours();
    var mm = d.getMinutes();
    if (mm < 10) { mm = "0" + mm; }
    hh = hh + 'h' + mm + " : ";
    if (karotz_ip == 'localhost') {
      //  karotz.serial.write(hh + string + '\n\r');
    }
    else log(hh + string);
    return true
}
var earsListener = function(event, step) {
    if (event == "START_RIGHT") {
        //karotz.tts.stop();
        j = 2;
    }
    return true;
}
var buttonListener = function(event) {
    if (event == "DOUBLE") {
        calcul_date(i);
        file.write("numero"  + ".txt", date_item + titre);
        debuglog(" sortie par double clic enregistrement du fichier numero.txt avec la valeur de date_item :" + date_item)
        karotz.tts.start("Sortie anticipée ! A bientot", "fr", function(event) {
            if (event == "TERMINATED") { exit(); }
        });
    }
    if (event == "SIMPLE") {
        debuglog("je suis dans bouton, event vaut simple voici lecture description :" + lecture_description);
        if (!lecture_description) {
            lecture_description = true; ;
            debuglog("lecture_description :" + lecture_description);
            karotz.ears.moveRelative(360, 0);
        }
        else {
            karotz.ears.moveRelative(0, 360);
            karotz.tts.stop(fin_description);
        }
    }
    debuglog("j ai gere mon event bouton et je repars d ou je viens");
    return true;
}

var lecture = function(numero) {
    debuglog("numero lu " + numero);
    titre = mon_xml.docNode.selectNode("/channel/item[" + numero + "]/title").getText();
    debuglog("je prepare description numero : " + numero);
    description = mon_xml.docNode.selectNode("/channel/item[" + numero + "]/description").getText();
    description = enleve_balise(description);
    description = description.replace(new RegExp(" - ", "g"), " : ");
    var pos = description.lastIndexOf("Date de sortie", description.length);
    //debuglog("**************** description apres nettoyage balise " + description);
    if (pos > 0) { var montitre = titre + " : : : " + description.substring(0, pos); }
    var pos = description.lastIndexOf("Un film de", description.length);
    var pos2 = description.lastIndexOf("Voir le casting complet", description.length);
    if (pos2 < 0) pos2 = description.lastIndexOf("Voir les séances", description.length);
    if (lire_acteurs == 1) { montitre = montitre + " : : : " + description.substring(pos, pos2).replace(new RegExp("Avec", "g"), " : Avec : "); }
    pos = description.lastIndexOf("Bande-annonce", description.length);
    pos2 = description.lastIndexOf("lire la suite", description.length);
    description = description.substring(pos + 13, pos2);
    karotz.multimedia.play("http://www.bregeon.net/karotz/fluxrss/874.mp3", function(event) {
    //'<prosody rate="' + rate + '" pitch="' + pitch + '">' + lire + '</prosody>'
        if (event == "TERMINATED") { karotz.tts.start('<prosody rate="' + rate + '" pitch="' + pitch + '">' + montitre + "." + '</prosody>', "fr", fin_titre); }
    });

}
var fin_titre = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        debuglog("j ai fini de lire mon titre j attends de savoir si je veux la description");
        // flux_lu = "";
        if (lecture_description) {
            debuglog("je passe en lecture description ");
            karotz.led.light("0000FF");
            karotz.tts.start(description, "fr", fin_description);
        } else {
            karotz.led.light("FF0000");
            karotz.led.pulse("4FFF68", 500, duree_pour_lire, function(event) {
                if ((event == "CANCELLED") || (event == "TERMINATED")) {
                    if (!lecture_description) {
                        debuglog("je ne lis que le titre");
                        karotz.led.light("4FFF68");
                        suivant()
                    }
                    if (lecture_description) {
                        debuglog("je passe en lecture description ");
                        karotz.led.light("0000FF");
                        karotz.tts.start(description, "fr", fin_description);
                    }
                }
                return true
            })
        }

    };
    return true;
}
var fin_sortie = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        debuglog("plus rien a lire je quitte");
        karotz.tts.start("Et voilà j'ai terminé ma lecture ! A bientôt donc.", "fr", function(event) {
            if (event == "TERMINATED") { exit(); }
        });
    }
    return true;
}
var fin_description = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        //karotz.ears.reset();
        // fin_lecture = 1;
        debuglog("je suis dans fonction fin_description");
        lecture_description = false;
        karotz.led.light("4FFF68");
        suivant()
    }
    return true;
}
var suivant = function() {
    i = (i - 1) + j;
    j = 0;
    if (i < 0) {
        calcul_date(0);
        file.write("numero" + ".txt", date_item + titre);
        debuglog(" fin des items enregistrement du fichier numero.txt avec la valeur de date_tem a :" + date_item)
        karotz.tts.start("Ce sera tout pour les sorties de la semaine. Plusse sur le site cinéfil point comme ! A plus tard", "fr", function(event) {
            if (event == "TERMINATED") { exit(); }
        });
    }
    debuglog("nbre item dans boucle suivant" + i);
    lecture(i)
}
var onKarotzConnect = function(data) {
/*    if (karotz_ip == 'localhost') {
        karotz.serial.open("/dev/ttyGS0", 9600);
        debuglog("**************** demarrage de l'application ***********");
        debuglog(' appli lancee par ' + launchType.name);
        debuglog(' identifiant du lapin : ' + params[instanceName].uuid);
    }*/
    karotz.button.addListener(buttonListener);
    karotz.ears.addListener(earsListener);
    dernier_numero_lu = file.read("numero" + ".txt");
    var mon_dernier_numero = dernier_numero_lu.text; //pour le site cinéma contient la date ET le nom du film (title)
    debuglog("dernier numero lu " + mon_dernier_numero);
    var mon_rss = http.get("http://www.cinefil.com/rss-sorties-cinema-de-la-semaine")
    if (karotz_ip != 'localhost') {
        debuglog("**************** mon flux rss ***********");
        debuglog(mon_rss);
    }
    //  debuglog( 'utf8 ansi : ' + Utf8.decode("c'est à moi alain brégeon"));


    while (mon_rss != (mon_rss = mon_rss.replace("\xE9", "é")));
    while (mon_rss != (mon_rss = mon_rss.replace("&#38;", "&")));
    while (mon_rss != (mon_rss = mon_rss.replace("&#39;", "'")));
    while (mon_rss != (mon_rss = mon_rss.replace("&#60;", "<")));
    while (mon_rss != (mon_rss = mon_rss.replace("&#62;", ">")));
    while (mon_rss != (mon_rss = mon_rss.replace("&nbsp;", " ")));
    while (mon_rss != (mon_rss = mon_rss.replace("&egrave;", "è")));
    while (mon_rss != (mon_rss = mon_rss.replace("&Egrave;", "è")));
    while (mon_rss != (mon_rss = mon_rss.replace("&eacute;", "é")));
    while (mon_rss != (mon_rss = mon_rss.replace("&eacute;", "é")));
    while (mon_rss != (mon_rss = mon_rss.replace("&aacute;", "á")));
    while (mon_rss != (mon_rss = mon_rss.replace("&Aacute;", "Á")));
    while (mon_rss != (mon_rss = mon_rss.replace("&ecirc;", "ê")));
    while (mon_rss != (mon_rss = mon_rss.replace("&agrave;", "à")));
    while (mon_rss != (mon_rss = mon_rss.replace("&ugrave;", "ù")));
    while (mon_rss != (mon_rss = mon_rss.replace("&uuml;", "ü")));
    while (mon_rss != (mon_rss = mon_rss.replace("&iuml;", "ï")));
    while (mon_rss != (mon_rss = mon_rss.replace("&icirc;", "î")));
    while (mon_rss != (mon_rss = mon_rss.replace("&ocirc;", "ô")));
    while (mon_rss != (mon_rss = mon_rss.replace("&acirc;", "â")));
    while (mon_rss != (mon_rss = mon_rss.replace("&Euml;", "ë")));
    while (mon_rss != (mon_rss = mon_rss.replace("&euml;", "ë")));
    while (mon_rss != (mon_rss = mon_rss.replace("&ccedil;", "ç")));
    while (mon_rss != (mon_rss = mon_rss.replace("&Ccedil;", "ç")));
    while (mon_rss != (mon_rss = mon_rss.replace("&ucirc;", "û")));
    while (mon_rss != (mon_rss = mon_rss.replace("&laquo;", "")));
    while (mon_rss != (mon_rss = mon_rss.replace("&raquo;", "")));
    while (mon_rss != (mon_rss = mon_rss.replace("&rsquo;", "'")));
    while (mon_rss != (mon_rss = mon_rss.replace("&ldquo;", "")));
    while (mon_rss != (mon_rss = mon_rss.replace("&raquo;", "''")));
    while (mon_rss != (mon_rss = mon_rss.replace("&rdquo;", "''")));
    while (mon_rss != (mon_rss = mon_rss.replace("&oelig;", "oe")));
    while (mon_rss != (mon_rss = mon_rss.replace("&hellip;", "...")));
    var pos = mon_rss.lastIndexOf("<rss version", mon_rss.length);
    // debuglog("mon RSS " + mon_rss);
    if (pos > 0) { mon_rss = mon_rss.substring(pos, mon_rss.length); }
    //debuglog(mon_rss.substring(1,12);)
    mon_xml = new XMLDoc(mon_rss);
    nbre_item = mon_xml.docNode.selectNode('/channel').getElements("item").length;
    debuglog("nbre item " + nbre_item);
    for (i = nbre_item - 1; i > -1; i--) {
        calcul_date(i);
        titre = mon_xml.docNode.selectNode("/channel/item[" + i + "]/title").getText();
       // debuglog("dernier nom lu dans fichier de sauvegarde : " + mon_dernier_numero);
       // debuglog("date plus titre en cours : " + date_item + titre);
        if (mon_dernier_numero == date_item + titre) break;
    } //fin du for i
    i = i + 1 + item_a_lire;
    debuglog("valeur de i tenant compte du deja lu et du a relire : " + i);
    if (i > nbre_item) i = nbre_item;
    debuglog("je sors de ma boucle voici la valeur de I :" + i);
    if (i == 0) karotz.tts.start("Je suis désolé mais je n'ai pas de nouvelles news depuis notre précédente lecture.", "fr", fin_sortie);
    else {
        var ladate = "";
        date = mon_xml.docNode.selectNode("/channel/item[0]/pubDate").getText();
        debuglog("date  en sortie du selectnode : " + date);
        //var jourdate = date.substring(0, 3);
        debuglog("jour date :" + date.substring(0, 3));
        //ladate = "Brève du ";
        switch (date.substring(0, 3)) {
            case "Mon":
                ladate = ladate + "lundi : ";
                break;
            case "Tue":
                ladate = ladate + "mardi : ";
                break;
            case "Wed":
                ladate = ladate + "mercredi : ";
                break;
            case "Thu":
                ladate = ladate + "jeudi : ";
                break;
            case "Fri":
                ladate = ladate + "vendredi : ";
                break;
            case "Sat":
                ladate = ladate + "samedi : ";
                break;
            case "Sun":
                ladate = ladate + "dimanche : ";
                break;
        }
        if ((date.substring(5, 6) == "0") && (date.substring(6, 7) == "1")) ladate = ladate + "premier ";
        if ((date.substring(5, 6) == "0") && (date.substring(6, 7) != "1")) ladate = ladate + date.substring(6, 7) + " ";
        if (date.substring(5, 6) != "0") ladate = ladate + date.substring(5, 7) + " ";
        switch (date.substring(8, 11)) {
            case "Jan":
                ladate = ladate + "janvier : ";
                break;
            case "Feb":
                ladate = ladate + "février : ";
                break;
            case "Mar":
                ladate = ladate + "mars : ";
                break;
            case "Apr":
                ladate = ladate + "avril : ";
                break;
            case "May":
                ladate = ladate + "mai : ";
                break;
            case "Jun":
                ladate = ladate + "juin : ";
                break;
            case "Jul":
                ladate = ladate + "juillet : ";
                break;
            case "Aug":
                ladate = ladate + "oute : ";
                break;
            case "Sep":
                ladate = ladate + "septembre : ";
                break;
            case "Oct":
                ladate = ladate + "octobre : ";
                break;
            case "Nov":
                ladate = ladate + "novembre : ";
                break;
            case "Dec":
                ladate = ladate + "décembre ";
                break;
        }
 
flux_lu = " Les films qui sortent ce " + ladate + " par le site cinéfil point comme ";

        karotz.tts.start(flux_lu, "fr", function(event) {
            if (event == "TERMINATED") { suivant(); }
        });

    }
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
