include("util.js");
include("xmldom.js");
var lien, titre, auteur, mon_xml, nbre_item, i, date, date_item, dernier_numero_lu;
var fin_lecture = 0;
var j = 0;
var d = new Date();
var link;
var lecture_description = false;

//var karotz_ip="192.168.1.46";
var karotz_ip = "localhost";
if (karotz_ip == 'localhost') { var rate_t = params[instanceName].rate_t; }
else var rate_t = "slow"; //durée en ms
if (karotz_ip == 'localhost') { var rate_d = params[instanceName].rate_d; }
else var rate_d = "1.15"; //durée en ms
if (karotz_ip == 'localhost') { var pitch_t = params[instanceName].pitch_t; }
else var pitch_t = "medium"; //durée en ms
if (karotz_ip == 'localhost') { var pitch_d = params[instanceName].pitch_d; }
else var pitch_d = "x_high"; //durée en ms
if (karotz_ip == 'localhost') { var duree_pour_lire = +params[instanceName].duree_pour_lire; }
else var duree_pour_lire = 1500; //durée en ms
if (karotz_ip == 'localhost') { var duree_a_lire = +params[instanceName].duree_a_lire; }
else var duree_a_lire = 7; //durée en jour
if (karotz_ip == 'localhost') { var item_a_lire = +params[instanceName].item_a_lire; }
else var item_a_lire = 1;
if (karotz_ip == 'localhost') { var je_veux_lire = params[instanceName].je_veux_lire; }
else var je_veux_lire = "false"; //true = juste les titres

if (karotz_ip == 'localhost') { son1 = "/usr/karotz/apps/7e6fa6fd-9099-40bf-a9ca-4708c0663f69/1.mp3"; }
//if (karotz_ip == 'localhost') { son1 = "/usr/karotz/apps/491ed7c6-c3b0-482f-baee-d206693006f2/1.mp3"; }
else son1 = "1.mp3"; //true = juste les titres
if (karotz_ip == 'localhost') { son2 = "/usr/karotz/apps/7e6fa6fd-9099-40bf-a9ca-4708c0663f69/2.mp3"; }
//if (karotz_ip == 'localhost') { son2 = "/usr/karotz/apps/491ed7c6-c3b0-482f-baee-d206693006f2/2.mp3"; }
else son2 = "2.mp3"; //true = juste les titres



var enleve_balise = function(mon_html)
{
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
var calcul_date = function(num)
{
    date = mon_xml.docNode.selectNode("/channel/item[" + num + "]/pubDate").getText();
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
var debuglog = function(string)
{
    //var d = new Date();
    var hh = "" + d.getHours();
    var mm = d.getMinutes();
    if (mm < 10) { mm = "0" + mm; }
    hh = hh + 'h' + mm + " : ";
    if (karotz_ip == 'localhost') {
        //karotz.serial.write(hh + string + '\n\r');
    }
    else log(hh + string);
    return true
}
var earsListener = function(event, step)
{
    if (event == "START_RIGHT") {
        //karotz.tts.stop();
        j = 2;
    }
    return true;
}
var buttonListener = function(event)
{
    if (event == "DOUBLE") {
        calcul_date(i);
        file.write("numero.txt", date_item);
        debuglog(" sortie par double clic enregistrement du fichier numero.txt avec la valeur de date_item :" + date_item)
        karotz.tts.start("Sortie anticipée ! A bientot", "fr", function(event)
        {
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

var lecture = function(numero)
{
    debuglog("numero lu " + numero);
    //fin_lecture = 0;
    titre = mon_xml.docNode.selectNode("/channel/item[" + numero + "]/title").getText();
    debuglog("je prepare description numero : " + numero);
    description = mon_xml.docNode.selectNode("/channel/item[" + numero + "]/description").getText();
    description = enleve_balise(description);
    var pos = description.lastIndexOf("Tags", description.length);
    //debuglog("position du tag " + pos);
    if (pos > 0) { description = description.substring(1, pos); }
    karotz.multimedia.play(son2, function(event)
    {
        if (event == "TERMINATED") { karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + titre + "." + '</prosody>', "fr", lecture_mp3); }
    });
}
var lecture_mp3 = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        debuglog("numero lu " + i);
        //fin_lecture = 0;
        var nbre_link = mon_xml.docNode.selectNode("/channel/item[" + i + "]").getElements("link").length;
        debuglog('combien de link : ' + nbre_link);
        if (nbre_link != 0) {
            link = mon_xml.docNode.selectNode("/channel/item[" + i + "]/link").getText();
            debuglog("voici le lien : " + link);
            karotz.multimedia.play(link, function(event)
            {
                if ((event == "CANCELLED") || (event == "TERMINATED")) { fin_titre(); }
            });
        }
        else fin_titre();
    };
    return true;
}
var fin_titre = function(event)
{
    //	if ((event == "CANCELLED") || (event == "TERMINATED")){
    debuglog("j ai fini de lire mon titre j attends de savoir si je veux la description");
    if (lecture_description) {
        debuglog("je passe en lecture description ");
        karotz.led.light("0000FF");
        karotz.tts.start('<prosody rate="' + rate_d + '" pitch="' + pitch_d + '">' + description + '</prosody>', "fr", fin_description);
    } else {
        karotz.led.light("FF0000");
        karotz.led.pulse("4FFF68", 500, duree_pour_lire, function(event)
        {
            if ((event == "CANCELLED") || (event == "TERMINATED")) {
                if (!lecture_description) {
                    debuglog("je ne lis que le titre");
                    karotz.led.light("4FFF68");
                    suivant()
                }
                if (lecture_description) {
                    debuglog("je passe en lecture description ");
                    karotz.led.light("0000FF");
                    karotz.tts.start('<prosody rate="' + rate_d + '" pitch="' + pitch_d + '">' + description + '</prosody>', "fr", fin_description);
                }
            }
            return true
        })
    }

    //	};
    //    return true;
}
var fin_sortie = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        debuglog("plus rien a lire je quitte");
        karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Et voilà j'ai terminé ma lecture ! N'hésitez pas à consulter nos différentes pages, blog, fesse bouc, forums pour une information de fond. A bientôt donc." + '</prosody>', "fr", function(event)
        {
            if (event == "TERMINATED") { exit(); }
        });
    }
    return true;
}
var fin_description = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        //karotz.ears.reset();
        // fin_lecture = 1;
        debuglog("je suis dans fonction fin_description");
        if (je_veux_lire == 'true') lecture_description = false;
        karotz.led.light("4FFF68");
        suivant()
    }
    return true;
}
var suivant = function()
{
    i = (i - 1) + j;
    j = 0;
    if (i < 0) {
        calcul_date(0);
        file.write("numero.txt", date_item);
        debuglog(" fin des items enregistrement du fichier numero.txt avec la valeur de date_tem a :" + date_item)

        karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Fin des actualités ! A plus tard" + '</prosody>', "fr", function(event)
        {
            if (event == "TERMINATED") { exit(); }
        });
    }
    debuglog("nbre item dans boucle suivant" + i);
    lecture(i)
}
var onKarotzConnect = function(data)
{
    /*  if (karotz_ip == 'localhost') {
    karotz.serial.open("/dev/ttyGS0", 9600);
    debuglog("**************** demarrage de l'application ***********");
    debuglog(' appli lancee par ' + launchType.name);
    debuglog(' identifiant du lapin : ' + params[instanceName].uuid);
    }*/
    karotz.button.addListener(buttonListener);
    karotz.ears.addListener(earsListener);
    if (je_veux_lire == 'false') lecture_description = true;
    dernier_numero_lu = file.read("numero.txt");
    var mon_dernier_numero = dernier_numero_lu.text;
    debuglog("dernier numero lu " + mon_dernier_numero);
    var date_a_traiter = new Date();
    // date_a_traiter.setTime(date_a_traiter.getTime() - duree_a_lire * 30 * 24 * 3600 * 1000);//calcul avec durée en mois
    date_a_traiter.setTime(date_a_traiter.getTime() - duree_a_lire * 24 * 3600 * 1000); //calcul avec durée en jour
    var jour_a_traiter = date_a_traiter.getDate(); if (jour_a_traiter < 10) jour_a_traiter = "0" + jour_a_traiter;
    var mois_a_traiter = date_a_traiter.getMonth() + 1; if (mois_a_traiter < 10) mois_a_traiter = "0" + "" + mois_a_traiter;
    //var toto = date_a_traiter.getDate() + "/" + (date_a_traiter.getMonth() + 1) + "/" + date_a_traiter.getFullYear()
    date_a_traiter = date_a_traiter.getFullYear() + "" + mois_a_traiter + jour_a_traiter + "000000";
    debuglog("date a traiter vaut : " + date_a_traiter);
    if (mon_dernier_numero < date_a_traiter) mon_dernier_numero = date_a_traiter;
    debuglog("dernier numero lu " + mon_dernier_numero);
    var mon_rss = http.get("http://karotznews.karotz.com/karotznews.xml")
    var pos = mon_rss.lastIndexOf("<rss version", mon_rss.length);
    debuglog("position du tag " + pos);
    if (pos > 0) { mon_rss = mon_rss.substring(pos, mon_rss.length); }
    //debuglog(mon_rss.substring(1,12);)
    mon_xml = new XMLDoc(mon_rss);
    nbre_item = mon_xml.docNode.selectNode('/channel').getElements("item").length;
    debuglog("nbre item " + nbre_item);
    for (i = nbre_item - 1; i > -1; i--) {
        calcul_date(i);
        if (mon_dernier_numero < date_item) break;
    } //fin du for i
    i = i + 1 + item_a_lire;
    debuglog("valeur de i tenant compte du deja lu et du a relire : " + i);
    if (i > nbre_item) i = nbre_item;
    debuglog("je sors de ma boucle voici la valeur de I :" + i);
    if (i == 0) karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Je suis désolé mais je n'ai pas de nouvelles news depuis notre précédente lecture." + '</prosody>', "fr", fin_sortie);
    else {
        karotz.multimedia.play(son1, function(event)
        {
            if (event == "TERMINATED") {
                karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Bienvenue sur le flux RSS de Karotz niouze : : " + '</prosody>', "fr", function(event)
                {
                    if (event == "TERMINATED") { suivant(); }
                });
            }
        });

    }
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
