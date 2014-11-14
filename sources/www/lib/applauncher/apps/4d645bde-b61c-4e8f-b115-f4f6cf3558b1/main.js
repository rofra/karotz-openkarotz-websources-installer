include("util.js");
include("tinyxmldom.js");
var lien, titre, auteur, mon_xml, nbre_item, i,  date, date_item, dernier_numero_lu;
var fin_lecture = 0;
var j = 0;

var mon_rss, flux_lu,jourdate;
var d = new Date();
var lecture_description = false;
//var karotz_ip="192.168.1.29";
//var karotz_ip="10.0.252.180";
var karotz_ip = "localhost";
if (karotz_ip == 'localhost') { var duree_pour_lire = +params[instanceName].duree_pour_lire; }
    else var duree_pour_lire = 1500; //durée en ms
if (karotz_ip == 'localhost') { var lire_date = +params[instanceName].lire_date; }
    else var lire_date = 1; //1 je lis la date, 0 je ne lis pas la date
if (karotz_ip == 'localhost') { var item_a_lire = +params[instanceName].item_a_lire; }
    else var item_a_lire = 1;
if (karotz_ip == 'localhost') { var flux_a_lire = params[instanceName].flux_a_lire; }
    else var flux_a_lire = "4";
if (karotz_ip == 'localhost') { var rate_t = params[instanceName].rate_t; }
    else var rate_t = "slow"; //durée en ms
if (karotz_ip == 'localhost') { var rate_d = params[instanceName].rate_d; }
    else var rate_d = "1.15"; //durée en ms
if (karotz_ip == 'localhost') { var pitch_t = params[instanceName].pitch_t; }
    else var pitch_t = "medium"; //durée en ms
if (karotz_ip == 'localhost') { var pitch_d = params[instanceName].pitch_d; }
    else var pitch_d = "x_high"; //durée en ms
if (karotz_ip == 'localhost') { var je_veux_lire = params[instanceName].je_veux_lire; }
    else var je_veux_lire = 'false'; //true = juste les titres    
    
     
/*
		<option label="JO 2012" key="1" checked="true"/>
		<option label="Euro 2012" key="2" checked="false"/>
		<option label="Football" key="3" checked="false"/>
		<option label="Rugby" key="4" checked="false"/>
		<option label="Tennis" key="5" checked="false"/>
		<option label="Basket/Hand/Volley" key="6" checked="false"/>
		<option label="Auto-moto" key="7" checked="false"/>
		<option label="Cyclisme" key="8" checked="false"/>
		<option label="Golf" key="9" checked="false"/>
		<option label="Sports d'hiver" key="10" checked="false"/>
		<option label="+100 sports" key="11" checked="false"/>
		<option label="OM" key="12" checked="false"/>
		<option label="PSG" key="13" checked="false"/>
		<option label="Lyon" key="14" checked="false"/>
		<option label="Bordeaux" key="15" checked="false"/>
		<option label="LOSC" key="16" checked="false"/>
		<option label="Monaco" key="17" checked="false"/>
		<option label="ASSE" key="18" checked="false"/>
		<option label="Sochaux" key="19" checked="false"/>
		<option label="FC Barcelone" key="20" checked="false"/>
		<option label="Real Madrid" key="21" checked="false"/>
		<option label="Manchester United" key="22" checked="false"/>
		<option label="Arsenal" key="23" checked="false"/>
		<option label="Liverpool" key="24" checked="false"/>

*/
    switch (flux_a_lire) {
        case "1":
            mon_rss = http.get("http://www.sport.fr/RSS/jo2012.xml"); flux_lu = " Flux air esse esse Jeux Olympiques 2012 par le site sport point F R ";  break;
        case "2":
            mon_rss = http.get("http://www.sport.fr/RSS/euro2012.xml"); flux_lu = " Flux air esse esse : Euro 2012 : par le site sport point F R "; break;
        case "3":
            mon_rss = http.get("http://www.sport.fr/RSS/sport1.xml"); flux_lu = " Flux air esse esse Foot Bal par le site sport point F R "; break;
        case "4":
            mon_rss = http.get("http://www.sport.fr/RSS/sport2.xml"); flux_lu = " Flux air esse esse Rugby par le site sport point F R "; break;
        case "5":
            mon_rss = http.get("http://www.sport.fr/RSS/sport3.xml"); flux_lu = " Flux air esse esse tennis par le site sport point F R "; break;
        case "6":
            mon_rss = http.get("http://www.sport.fr/RSS/sport4.xml"); flux_lu = " Flux air esse esse basket hande volley par le site sport point F R "; break;
        case "7":
            mon_rss = http.get("http://www.sport.fr/RSS/sport5.xml"); flux_lu = " Flux air esse esse auto-moto par le site sport point F R "; break;
        case "8":
            mon_rss = http.get("http://www.sport.fr/RSS/sport6.xml"); flux_lu = " Flux air esse esse cyclisme par le site sport point F R "; break;
        case "9":
            mon_rss = http.get("http://www.sport.fr/RSS/sport7.xml"); flux_lu = " Flux air esse esse golf par le site sport point F R "; break;
        case "10":
            mon_rss = http.get("http://www.sport.fr/RSS/sport8.xml"); flux_lu = " Flux air esse esse sports d'hiver par le site sport point F R "; break;
        case "11":
            mon_rss = http.get("http://www.sport.fr/RSS/sport9.xml"); flux_lu = " Flux air esse esse autres sports par le site sport point F R "; break;
        case "12":
            mon_rss = http.get("http://www.sport.fr/RSS/om.xml"); flux_lu = " Flux air esse esse des supporters de l'eau aime par le site sport point F R "; break;
        case "13":
            mon_rss = http.get("http://www.sport.fr/RSS/psg.xml"); flux_lu = " Flux air esse esse des supporters du pé esse gé par le site sport point F R "; break;
        case "14":
            mon_rss = http.get("http://www.sport.fr/rss/Lyon.xml"); flux_lu = " Flux air esse esse des supporters de lyon par le site sport point F R "; break;
        case "15":
            mon_rss = http.get("http://www.sport.fr/rss/Bordeaux.xml"); flux_lu = " Flux air esse esse des supporters de bordeaux par le site sport point F R "; break;
        case "16":
            mon_rss = http.get("http://www.sport.fr/rss/LOSC.xml"); flux_lu = " Flux air esse esse des supporters du l'os que par le site sport point F R "; break;
        case "17":
            mon_rss = http.get("http://www.sport.fr/rss/Monaco.xml"); flux_lu = " Flux air esse esse des supporters de monaco par le site sport point F R "; break;
        case "18":
            mon_rss = http.get("http://www.sport.fr/rss/ASSE.xml"); flux_lu = " Flux air esse esse des supporters de la ess saint étienne par le site sport point F R "; break;
        case "19":
            mon_rss = http.get("http://www.sport.fr/rss/Sochaux.xml"); flux_lu = " Flux air esse esse des supporters de sochaux par le site sport point F R "; break;
        case "20":
            mon_rss = http.get("http://www.sport.fr/rss/Barcelone.xml"); flux_lu = " Flux air esse esse des supporters du F C Bar ce lonne par le site sport point F R "; break;
        case "21":
            mon_rss = http.get("http://www.sport.fr/rss/Real.xml"); flux_lu = " Flux air esse esse des supporters du réal madrid par le site sport point F R "; break;
        case "22":
            mon_rss = http.get("http://www.sport.fr/rss/ManUtd.xml"); flux_lu = " Flux air esse esse des supporters de manchestère youna itide par le site sport point F R "; break;
        case "23":
            mon_rss = http.get("http://www.sport.fr/rss/Arsenal.xml"); flux_lu = " Flux air esse esse des supporters d'arsenal par le site sport point F R "; break;
        case "24":
            mon_rss = http.get("http://www.sport.fr/rss/Liverpool.xml"); flux_lu = " Flux air esse esse des supporters de liverpool par le site sport point F R "; break;
        case "25":
            mon_rss = http.get("http://www.sport.fr/RSS/sport.xml"); flux_lu = " Flux air esse esse tout sports confondus par le site sport point F R "; break;
        case "26":
            mon_rss = http.get("http://sports.feedsportal.com/c/282/f/3677/index.rss"); flux_lu = " Flux air esse esse Roland GARROS 2012 par le site sport point F R "; break;
    }

    /**
    *
    *  UTF-8 data encode / decode
    *  http://www.webtoolkit.info/
    *
    **/

    var Utf8 = {

        // public method for url encoding
        encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // public method for url decoding
        decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    }    
var   enleve_balise = function(mon_html)
    {
    //PROCESS STRING
    if(arguments.length < 3) {
     mon_html=mon_html.replace(/<\/?(?!\!)[^>]*>/gi, '');
    } else {
     var allowed = arguments[1];
     var specified = eval("["+arguments[2]+"]" );
     if(allowed){
      var regex='</?(?!(' + specified.join('|') + '))\b[^>]*>';
      mon_html=mon_html.replace(new RegExp(regex, 'gi'), '');
     } else{
      var regex='</?(' + specified.join('|') + ')\b[^>]*>';
      mon_html=mon_html.replace(new RegExp(regex, 'gi'), '');
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
		//karotz.serial.write(hh + string + '\n\r');
	}
		else log(hh + string);
	return true
}
var earsListener = function(event,step) {
	if (event == "START_RIGHT") {
		//karotz.tts.stop();
		j = 2;
	}
	return true;
}
var buttonListener = function(event) {
    if (event == "DOUBLE") {
		calcul_date(i);
		file.write("numero" + flux_a_lire + ".txt", date_item);
		debuglog(" sortie par double clic enregistrement du fichier numero.txt avec la valeur de date_item :" + date_item)
		karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Sortie anticipée ! A bientot" + '</prosody>', "fr", function(event)
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

var lecture = function(numero) {
    debuglog("numero lu " + numero);
    var ladate = "";
    if (lire_date == "1") {
        date = mon_xml.docNode.selectNode("/channel/item[" + numero + "]/pubDate").getText();
        debuglog("date  en sortie du selectnode : " + date);
        //var jourdate = date.substring(0, 3);
        debuglog("jour date :" + date.substring(0, 3));
        //ladate = "Brève du ";
        switch (date.substring(0, 3)) {
            case "Mon":
                ladate = ladate + "lundi ";
                break;
            case "Tue":
                ladate = ladate + "mardi ";
                break;
            case "Wed":
                ladate = ladate + "mercredi ";
                break;
            case "Thu":
                ladate = ladate + "jeudi ";
                break;
            case "Fri":
                ladate = ladate + "vendredi ";
                break;
            case "Sat":
                ladate = ladate + "samedi ";
                break;
            case "Sun":
                ladate = ladate + "dimanche ";
                break;
        }
        if ((date.substring(5, 6) == "0") && (date.substring(6, 7)== "1")) ladate = ladate + "premier ";
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
    }
    titre = mon_xml.docNode.selectNode("/channel/item[" + numero + "]/title").getText();
    debuglog("je prepare description numero : " + numero);
    description = mon_xml.docNode.selectNode("/channel/item[" + numero + "]/description").getText();
    description = enleve_balise(description);
    var pos = description.lastIndexOf("Tags", description.length);
    //debuglog("position du tag " + pos);
    if (pos > 0) { description = description.substring(1, pos); }
    karotz.multimedia.play("http://www.bregeon.net/karotz/fluxrss/dingdong.wav", function(event) {
    //'<prosody rate="' + rate + '" pitch="' + pitch + '">' + lire + '</prosody>'
    if (event == "TERMINATED") { karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + ladate + titre + "." + '</prosody>', "fr", fin_titre); }
    });    
    
}
var fin_titre = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        debuglog("j ai fini de lire mon titre j attends de savoir si je veux la description");
       // flux_lu = "";
        if (lecture_description) {
            debuglog("je passe en lecture description ");
            karotz.led.light("0000FF");
            karotz.tts.start('<prosody rate="' + rate_d + '" pitch="' + pitch_d + '">' + description + '</prosody>', "fr", fin_description);
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
                        karotz.tts.start('<prosody rate="' + rate_d + '" pitch="' + pitch_d + '">' + description + '</prosody>', "fr", fin_description);
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
		karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Et voilà j'ai terminé ma lecture ! A bientôt donc." + '</prosody>', "fr", function(event)
		{
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
	   if (je_veux_lire == 'true') lecture_description = false;
		karotz.led.light("4FFF68");
		suivant()
    }
    return true;
}
var suivant = function(){
	i = (i- 1) + j;
	j = 0;
	if(i < 0){
		calcul_date(0);
		file.write("numero" + flux_a_lire + ".txt", date_item);
	   debuglog(" fin des items enregistrement du fichier numero.txt avec la valeur de date_tem a :" + date_item)
	   karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Fin des actualités ! A plus tard" + '</prosody>', "fr", function(event)
	   {
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
    if (je_veux_lire == 'false') lecture_description = true;   
    dernier_numero_lu = file.read("numero" + flux_a_lire + ".txt");
    var mon_dernier_numero = dernier_numero_lu.text;
    debuglog("dernier numero lu " + mon_dernier_numero);
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
        if (mon_dernier_numero < date_item) break;
    } //fin du for i
    i = i + 1 + item_a_lire;
    debuglog("valeur de i tenant compte du deja lu et du a relire : " + i);
    if (i > nbre_item) i = nbre_item;
    debuglog("je sors de ma boucle voici la valeur de I :" + i);
    if (i == 0) karotz.tts.start('<prosody rate="' + rate_t + '" pitch="' + pitch_t + '">' + "Je suis désolé mais je n'ai pas de nouvelles news depuis notre précédente lecture." + '</prosody>', "fr", fin_sortie);
    else {
        karotz.tts.start(flux_lu, "fr", function(event) {
            if (event == "TERMINATED") { suivant(); }
        });

    }
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
