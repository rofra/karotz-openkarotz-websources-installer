include("util.js");
include("xmldom.js");
var mon_xml, nbre_item, i, j, date, villelue, pos;
var ciel_matin0, ciel_midi0, ciel_apmidi0, ciel_soir0, temp_matin0, temp_midi0, temp_apmidi0, temp_soir0
var ciel_matin1, ciel_midi1, ciel_apmidi1, ciel_soir1, temp_matin1, temp_midi1, temp_apmidi1, temp_soir1
var ciel_matin2, ciel_midi2, ciel_apmidi2, ciel_soir2, temp_matin2, temp_midi2, temp_apmidi2, temp_soir2
var vent_matin0, vent_midi0, vent_apmidi0, vent_soir0, pluie_matin0, pluie_midi0, pluie_apmidi0, pluie_soir0
var vent_matin1, vent_midi1, vent_apmidi1, vent_soir1, pluie_matin1, pluie_midi1, pluie_apmidi1, pluie_soir1
var vent_matin2, vent_midi2, vent_apmidi2, vent_soir2, pluie_matin2, pluie_midi2, pluie_apmidi2, pluie_soir2
var matin_texte0, midi_texte0, apmidi_texte0, soir_texte0, matin_texte1, midi_texte1, apmidi_texte1, soir_texte1, matin_texte2, midi_texte2, apmidi_texte2, soir_texte2
var hh, date1, date2
var a_traiter, temp_int;
var karotz_ip = "localhost";

//var karotz_ip = "192.168.1.46";
if (karotz_ip == 'localhost') { var rate = params[instanceName].rate; }
else var rate = "slow"; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var pitch = params[instanceName].pitch; }
else var pitch = "medium"; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var jour = params[instanceName].jour; }
else var jour = 3; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var ville = params[instanceName].ville; }
else var ville = "Montlhery"; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var villealire = params[instanceName].villealire; }
else var villealire = "Montlairy"; //temps par défaut pour éviter l'ASR en minute

if (karotz_ip == 'localhost') { var pays = params[instanceName].pays; }
else var pays = "France"; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var saint = params[instanceName].saint; }
else var saint = "oui"; //temps par défaut pour éviter l'ASR en minute
if (karotz_ip == 'localhost') { var citation = params[instanceName].citation; }
else var citation = "oui"; //temps par défaut pour éviter l'ASR en minute


var com = "oui"; //params[instanceName].com //commentaires du lapin
var saint_array = new Array("Jour de l'an", "St Basile", "Ste Geneviaive", "St Odilon", "St Aidouard", "Ste Mailaine", "St Raymond", "St Lucien", "Ste Alix", "St Guillaume", "St Paulin", "Ste Tatiana", "Ste Yvette", "Ste Nina", "St Raimi", "St Marcel", "Ste Roseline", "Ste Prisca", "St Marius", "St Saibastien", "Ste Agnaisse", "St Vincent", "St Barnard", "St Frassois de Sales", "St Apollos", "Ste Paule", "Ste Angaile", "St Thomas d'Aquin", "St Gildas", "Ste Martine", "Ste Marcelle", "Ste Ailla", "St Thaiophane", "St Blaise", "Ste Vaironique", "Ste Agathe", "St Gaston", "Ste Eujainie", "Ste Jacqueline", "Ste Apolline", "St Arnaud", "Notre dame de Lourdes", "St Failix", "Ste Baiatrice", "St Valentin", "St Claude", "Ste Julienne", "St Alexis", "Ste Bernadette", "St Gabin", "Ste Aimaie", "St Damien", "Ste Isabelle", "St Lazare", "St Modeste", "St Romaio", "St Nestor", "Ste Honorine", "St Romain", "St Auguste", "St Aubin", "St Jaouen", "St Gwainola", "St Casimir", "St Olive", "Ste Colette", "Ste Failicitez", "St Jean de Dieu", "Ste Franssoise", "St Vivien", "Ste Rosine", "Ste Justine", "St Rodrigue", "Ste Mathilde", "Ste Louise", "Ste Bainaidicte", "St Patrick", "St Cyrille", "St Joseph", "St Herbert", "Ste Claimence", "Ste Laia", "St Victorien", "Ste Karine", "Annonciation", "Ste Lara", "St Habib", "St Gontran", "Ste Gwladys", "St Amaidez", "St Benjamin", "St Hugues", "Ste Sandrine", "St Richard", "St Isidore", "Ste Iraine", "St Marcellin", "St Jean-Baptiste", "Ste Julie", "St Gautier", "St Fulbert", "St Stanislasse", "St Jules", "Ste Ida", "St Maxime", "St Paterne", "St Benoît-Joseph", "St Anicet", "St Parfait", "Ste Aimma", "Ste Odette", "St Anselme", "St Alexandre", "St Georges", "St Fidaile", "St Marc", "Ste Alida", "Ste Zita", "Ste Valairie", "Ste Catherine", "St Robert", "St Jairaimie", "St Boris", "St Philippe", "St Sylvain", "Ste Judith", "Ste Prudence", "Ste Gisaile", "St Daisirai", "Ste Pacome", "Ste Solange", "Ste Aistelle", "St Achille", "Ste Rolande", "St Matthias", "Ste Denise", "St Honorai", "St Pascal", "St Airic", "St Yves", "St Bernardin", "St Constantin", "St Aimile", "St Didier", "St Donatien", "Ste Sophie", "St Bairenger", "St Augustin", "St Germain", "St Aymard", "St Ferdinand", "Ste Perrette", "St Justin", "Ste Blandine", "St Kevin", "Ste Clotilde", "St Igor", "St Norbert", "St Gilbert", "St Maidard", "Ste Diane", "Ste Trinitai", "St Barnabai", "St Guy", "St Antoine", "St Ailisaie", "Ste Germaine", "St Raigis", "St Hervai", "St Laionce", "St Romuald", "St Silvaire", "St Rodolphe", "St Alban", "Ste Audrey", "St Yann", "St Prosper", "St Anthelme", "St Fernand", "St Irainaie", "St Pierre/St Paul", "St Martial", "St Thierry", "St Martinien", "St Thomas", "St Florent", "St Antoine", "Ste Mariette", "St Ailiane", "St Thibaud", "Ste Amandine", "St Ulric", "St Benoît", "St Olivier", "St Henri/St Joël", "St Camille/Fête Nationale", "St Donald", "Ste Carmen", "Ste Charlotte", "St Fraidairic", "St Arsaine", "Ste Marina", "St Victor", "Ste Marie-Madeleine", "Ste Brigitte", "Ste Christine", "St Jacques", "Ste Anne", "Ste Nathalie", "St Samson", "Ste Marthe", "Ste Juliette", "St Ignace", "St Alphonse", "St Julien", "Ste Lydie", "St Jean-Marie", "St Abel", "St Octavien", "St Gaaitan", "St Dominique", "St Amour", "St Laurent", "Ste Claire", "Ste Clarisse", "St Hippolyte", "St Aivrard", "Ste Marie/Assomption", "St Armel", "St Hyacinthe", "Ste Hailaine", "St Jean-Eudes", "St Bernard", "St Christophe", "St Fabrice", "Ste Rose", "St Barthailaimy", "St Louis", "Ste Natacha", "Ste Monique", "St Augustin", "Ste Sabine", "St Fiacre", "St Aristide", "St Gilles", "Ste Ingrid", "St Graigoire", "Ste Rosalie", "Ste Raïssa", "St Bertrand", "Ste Reine", "St Adrien", "St Alain", "Ste Inais", "St Adelphe", "St Apollinaire", "St Aimai", "St Materne", "St Roland", "Ste Aidith", "St Renaud", "Ste Nadaige", "Ste Aimilie", "St Davy", "St Matthieu", "St Maurice", "St Constant", "Ste Thaicle", "St Hermann", "St Come/St Damien", "St Vincent de Paul", "St Venceslas", "Sts Michel", "St Jairome", "Ste Thairaise", "St Laiger", "St Gairard", "St Franssois", "Ste Fleur", "St Bruno", "St Serge", "Ste Pailagie", "St Denis", "St Ghislain", "St Firmin", "St Wilfrid", "St Gairaud", "St Juste", "Ste Thairaise", "Ste Aidwige", "St Baudouin", "St Luc", "St Renai Goupil", "Ste Adeline", "Ste Cailine", "Ste Ailodie", "St Jean de Capistran", "St Florentin", "St Craipin", "St Dimitri", "Ste Aimeline", "St Simon", "St Narcisse", "Ste Bienvenue", "St Quentin", "Toussaint", "Daifunts", "St Hubert", "St Charles", "Ste Sylvie", "Ste Bertille", "Ste Carine", "St Geoffroy", "St Thaiodore", "St Laion", "St Martin", "St Christian", "St Brice", "St Sidoine", "St Albert", "Ste Marguerite", "Ste Ailisabeth", "Ste Aude", "St Tanguy", "St Aidmond", "Praisentation de Marie", "Ste Caicile", "St Claiment", "Ste Flora", "Ste Catherine", "Ste Delphine", "St Saiverin", "St Jacques de la Marche", "St Saturnin", "St Andrai", "Ste Florence", "Ste Viviane", "St Xavier", "Ste Barbara", "St Gairald", "St Nicolas", "St Ambroise", "Ste Frida", "St Pierre Fourier", "St Romaric", "St Daniel", "Ste Chantal", "St Lucie", "Ste Odile", "Ste Ninon", "Ste Alice", "St Gaël", "St Gatien", "St Urbain", "St Thaiophile", "St Pierre Canisius", "Ste Franssoise-Xaviaire", "St Armand", "Ste Adaile", "Noail", "St Aitienne", "St Jean", "St Gaspard", "St David", "St Roger", "St Sylvestre");
var bisex = new Array(0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335);
var nobisex = new Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334);
var jour_en_clair = new Array("dimanche ", "lundi ", "mardi ", "mercredi ", "jeudi ", "vendredi ", "samedi ", "dimanche", "lundi ");
var jour_en_clair0, jour_en_clair1, jour_en_clair2;

var enleve_balise = function(mon_html) {
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
    var regex = '\\\\';
    mon_html = mon_html.replace(new RegExp(regex, 'gi'), '');

    return mon_html;
}

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }

    return true;
}


var pointvirgule = function(ma_chaine) {
    pos = ma_chaine.lastIndexOf(".", ma_chaine.length);
    //log('pos chaine ' + pos + ma_chaine);
    //j'isole la partie gauche
    temp_int = ma_chaine.substring(1, pos)
    log("temp int " + temp_int);
    if (pos > 0) { ma_chaine = ma_chaine.substring(0, pos) + " virgule " + ma_chaine.substring(pos + 1, ma_chaine.length) }
    if (pos == 2) { if (ma_chaine.substring(1, pos) == "1") { ma_chaine = 'un ' + ma_chaine.substring(pos + 1, ma_chaine.length) } } //il y a un guillemet en premier
    if (pos == 3) { if (ma_chaine.substring(1, pos) == "-1") { ma_chaine = 'moins un ' + ma_chaine.substring(pos + 1, ma_chaine.length) } } //il y a un guillemet en premier
    ma_chaine = ma_chaine.replace("-", " moins ");
    //ma_chaine.replace("\\.", " virgule ");
    ma_chaine = ma_chaine + " degrais.";
    return ma_chaine;
}

var fin_description = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    mon_xml = http.get("http://api.meteorologic.net/forecarss?p=" + ville + "&cn=" + pays);
    if (mon_xml.length < 300) { karotz.tts.start('daisolez mais je ne connais pas cette ville : merci de refaire le paramaitrage', "fr", fin_description); }
    else {//la ville existe
        // var saint_du_jour = http.get("http://fetedujour.fr/api/text");
        // var saint_du_jour = http.get("http://www.ephemeride-jour.fr/rss/rss_saints.php");
        //var citation_du_jour = http.get("http://www.proverbes.net/citajoursanspicto.js");
        var ma_citation_du_jour = new XMLDoc(http.get("http://www.dicocitations.com/xml-rss2.php"));

        var pos_deb_temp = mon_xml.lastIndexOf('<meteo:weather', 500000);
        var pos_fin = mon_xml.lastIndexOf('/>', 500000);
        var mon_item2 = mon_xml.substring(pos_deb_temp, pos_fin);
        log('item2 ' + mon_item2);
        //if (mon_item2 == "") { karotz.tts.start('<prosody rate="' + rate + '" pitch="' + pitch + '">' + 'daisolez mais je ne connais pas cette ville : merci de refaire le paramaitrage' + '</prosody>', "fr", fin_description); }
        mon_xml = mon_xml.substring(0, pos_deb_temp);
        pos_fin = pos_deb_temp
        var pos_deb_temp = mon_xml.lastIndexOf('<meteo:weather', 500000);
        var mon_item1 = mon_xml.substring(pos_deb_temp, pos_fin);
        log('item1 ' + mon_item1);
        mon_xml = mon_xml.substring(0, pos_deb_temp);
        pos_fin = pos_deb_temp
        var pos_deb_temp = mon_xml.lastIndexOf('<meteo:weather', 500000);
        var mon_item0 = mon_xml.substring(pos_deb_temp, pos_fin);

        log("************************* item0 " + mon_item0); //j isole la partie item

        pos_deb_temp = mon_xml.lastIndexOf('<title>', 500000) + 7;
        pos_fin = mon_xml.lastIndexOf('</title>', 500000);
        villelue = mon_xml.substring(pos_deb_temp, pos_fin);
        log('ville lue ' + villelue);
		if (villealire !="") villelue = villealire;
        villelue = villelue + '.';

        //*******************************
        //pos_deb_temp = citation_du_jour.lastIndexOf('&laquo', 500000) + 6; pos_fin = citation_du_jour.lastIndexOf('&raquo', 500000); citation_du_jour = citation_du_jour.substring(pos_deb_temp, pos_fin);
        //pos_deb_temp = citation_du_jour.lastIndexOf('title=', 500000) + 6; pos_fin = citation_du_jour.lastIndexOf('target="_self">Citation', 500000); citation_du_jour = citation_du_jour.substring(pos_deb_temp, pos_fin);
        // citation_du_jour = enleve_balise(citation_du_jour);
        citation_du_jour = ma_citation_du_jour.docNode.selectNode("/channel/item[0]/description").getText();

        //*****************************************
        //  pos_deb_temp = saint_du_jour.lastIndexOf('<title><![CDATA[', 500000) + '<title><![CDATA['.length; pos_fin = saint_du_jour.lastIndexOf(']]></title>', 500000); saint_du_jour = saint_du_jour.substring(pos_deb_temp, pos_fin);

        pos_deb_temp = mon_item0.lastIndexOf('date=', 500000) + 5; pos_fin = mon_item0.lastIndexOf('link=', 500000); date = mon_item0.substring(pos_deb_temp, pos_fin);
        //****************** modif du 2 février
        if (date.substring(1, 2) == "0") date = date.substring(2, date.length - 1);
        if (date.substring(0, 1) == "1") date = 'premier ' + date.substring(2, date.length - 1);
        //*************** fin modif 2 février

        pos_deb_temp = mon_item1.lastIndexOf('date=', 500000) + 5; pos_fin = mon_item1.lastIndexOf('link=', 500000); date1 = mon_item1.substring(pos_deb_temp, pos_fin);
        pos_deb_temp = mon_item2.lastIndexOf('date=', 500000) + 5; pos_fin = mon_item2.lastIndexOf('link=', 500000); date2 = mon_item2.substring(pos_deb_temp, pos_fin);
        log('mes dates ' + date + date1 + date2);
        var d = new Date();
        hh = "" + d.getHours();
        var mm = d.getMinutes();
        if (mm < 10) { mm = "0" + mm; }
        hh = hh + mm;
        log("hh " + hh);
        var jour_j = d.getDate() - 1;
        var mois_m = d.getMonth();
        var an_a = d.getYear();//retourne année - 1900 soit 112 pour 2012
        log("num du jour " + d.getDay() + " an_a : " + an_a);
        jour_en_clair0 = jour_en_clair[d.getDay()]; jour_en_clair1 = jour_en_clair[1 + d.getDay()]; jour_en_clair2 = jour_en_clair[2 + d.getDay()];
        //log('jour mois annee ' + jour_j + mois_m + an_a + " " + a2012[0]);
        if ((an_a == 112) || (an_a == 116) || (an_a == 120) || (an_a == 124)) { saint_du_jour = saint_array[jour_j + bisex[mois_m]]; } else { saint_du_jour = saint_array[jour_j + nobisex[mois_m]]; }
        log(saint_du_jour);
        date = "Aujourd'hui nous sommes le " + jour_en_clair0 + " " + date;
        if (saint == "oui") { date = date + " et nous fetons les : " + saint_du_jour };
        if (citation == "oui") { date = date + ". : Voici la citation du jour : : : : : " + citation_du_jour };
        //ciel soir
        pos_deb_temp = mon_item0.lastIndexOf('namepictos_soir=', 500000) + 'namepictos_soir='.length; pos_fin = mon_item0.lastIndexOf('pictos_soir=', 500000); ciel_soir0 = mon_item0.substring(pos_deb_temp, pos_fin);
        pos_deb_temp = mon_item1.lastIndexOf('namepictos_soir=', 500000) + 'namepictos_soir='.length; pos_fin = mon_item1.lastIndexOf('pictos_soir=', 500000); ciel_soir1 = mon_item1.substring(pos_deb_temp, pos_fin);
        pos_deb_temp = mon_item2.lastIndexOf('namepictos_soir=', 500000) + 'namepictos_soir='.length; pos_fin = mon_item2.lastIndexOf('pictos_soir=', 500000); ciel_soir2 = mon_item2.substring(pos_deb_temp, pos_fin);

        //tempairature soir
        pos_deb_temp = mon_item0.lastIndexOf('tempe_soir=', 500000) + 'tempe_soir='.length; pos_fin = mon_item0.lastIndexOf('namepictos_soir=', 500000); a_traiter = mon_item0.substring(pos_deb_temp, pos_fin);
        temp_soir0 = pointvirgule(a_traiter);
        pos_deb_temp = mon_item1.lastIndexOf('tempe_soir=', 500000) + 'tempe_soir='.length; pos_fin = mon_item1.lastIndexOf('namepictos_soir=', 500000); a_traiter = mon_item1.substring(pos_deb_temp, pos_fin);
        temp_soir1 = pointvirgule(a_traiter);
        pos_deb_temp = mon_item2.lastIndexOf('tempe_soir=', 500000) + 'tempe_soir='.length; pos_fin = mon_item2.lastIndexOf('namepictos_soir=', 500000); a_traiter = mon_item2.substring(pos_deb_temp, pos_fin);
        temp_soir2 = pointvirgule(a_traiter);

        soir_texte0 = " : : : : Praivision de la soirez  : : : : : : " + ciel_soir0 + ". la tempairature sera de " + temp_soir0;
        soir_texte1 = " : :  la soirez  : : : : : : " + ciel_soir1 + ". la tempairature sera de " + temp_soir1;
        soir_texte2 = " : :  la soirez  : : : : : : " + ciel_soir2 + ". la tempairature sera de " + temp_soir2;


        //ciel matin
        matin_texte0 = "";
        if (+hh < 1100) {
            pos_deb_temp = mon_item0.lastIndexOf('namepictos_matin=', 500000) + 'namepictos_matin='.length; pos_fin = mon_item0.lastIndexOf('pictos_matin=', 500000); ciel_matin0 = mon_item0.substring(pos_deb_temp, pos_fin);
            pos_deb_temp = mon_item0.lastIndexOf('tempe_matin=', 500000) + 'tempe_matin='.length; pos_fin = mon_item0.lastIndexOf('namepictos_matin=', 500000); a_traiter = mon_item0.substring(pos_deb_temp, pos_fin);
            temp_matin0 = pointvirgule(a_traiter);
            //ici j'ai la tempairature (partie gauche dans temp_int) si commentaires demandais je peux m'amuser
            matin_texte0 = " : Voici les Praivisions de ce matin : : : : " + ciel_matin0 + ". la tempairature sera de " + temp_matin0;
        }
        //ciel matin
        pos_deb_temp = mon_item1.lastIndexOf('namepictos_matin=', 500000) + 'namepictos_matin='.length; pos_fin = mon_item1.lastIndexOf('pictos_matin=', 500000); ciel_matin1 = mon_item1.substring(pos_deb_temp, pos_fin);
        pos_deb_temp = mon_item2.lastIndexOf('namepictos_matin=', 500000) + 'namepictos_matin='.length; pos_fin = mon_item2.lastIndexOf('pictos_matin=', 500000); ciel_matin2 = mon_item2.substring(pos_deb_temp, pos_fin);

        //tempairature matin
        pos_deb_temp = mon_item1.lastIndexOf('tempe_matin=', 500000) + 'tempe_matin='.length; pos_fin = mon_item1.lastIndexOf('namepictos_matin=', 500000); a_traiter = mon_item1.substring(pos_deb_temp, pos_fin);
        temp_matin1 = pointvirgule(a_traiter);
        pos_deb_temp = mon_item2.lastIndexOf('tempe_matin=', 500000) + 'tempe_matin='.length; pos_fin = mon_item2.lastIndexOf('namepictos_matin=', 500000); a_traiter = mon_item2.substring(pos_deb_temp, pos_fin);
        temp_matin2 = pointvirgule(a_traiter);

        matin_texte1 = " : :  pour le matin : : : : " + ciel_matin1 + ". la tempairature sera de " + temp_matin1;
        matin_texte2 = " : :  pour le matin : : : : " + ciel_matin2 + ". la tempairature sera de " + temp_matin2;

        midi_texte0 = "";
        if (+hh < 1500) {
            pos_deb_temp = mon_item0.lastIndexOf('namepictos_midi=', 500000) + 'namepictos_midi='.length; pos_fin = mon_item0.lastIndexOf('pictos_midi=', 500000); ciel_midi0 = mon_item0.substring(pos_deb_temp, pos_fin);
            pos_deb_temp = mon_item0.lastIndexOf('tempe_midi=', 500000) + 'tempe_midi='.length; pos_fin = mon_item0.lastIndexOf('namepictos_midi=', 500000); a_traiter = mon_item0.substring(pos_deb_temp, pos_fin);
            temp_midi0 = pointvirgule(a_traiter);
            midi_texte0 = "  : : : : Praivision pour ce midi : : : : : : " + ciel_midi0 + ". la tempairature sera de " + temp_midi0;
        }
        pos_deb_temp = mon_item1.lastIndexOf('namepictos_midi=', 500000) + 'namepictos_midi='.length; pos_fin = mon_item1.lastIndexOf('pictos_midi=', 500000); ciel_midi1 = mon_item1.substring(pos_deb_temp, pos_fin);
        pos_deb_temp = mon_item2.lastIndexOf('namepictos_midi=', 500000) + 'namepictos_midi='.length; pos_fin = mon_item2.lastIndexOf('pictos_midi=', 500000); ciel_midi2 = mon_item2.substring(pos_deb_temp, pos_fin);

        //tempairature midi
        pos_deb_temp = mon_item1.lastIndexOf('tempe_midi=', 500000) + 'tempe_midi='.length; pos_fin = mon_item1.lastIndexOf('namepictos_midi=', 500000); a_traiter = mon_item1.substring(pos_deb_temp, pos_fin);
        temp_midi1 = pointvirgule(a_traiter);
        pos_deb_temp = mon_item2.lastIndexOf('tempe_midi=', 500000) + 'tempe_midi='.length; pos_fin = mon_item2.lastIndexOf('namepictos_midi=', 500000); a_traiter = mon_item2.substring(pos_deb_temp, pos_fin);
        temp_midi2 = pointvirgule(a_traiter);

        midi_texte1 = "  : :  pour le midi : : : : : : " + ciel_midi1 + ". la tempairature sera de " + temp_midi1;
        midi_texte2 = "  : :  pour le midi : : : : : : " + ciel_midi2 + ". la tempairature sera de " + temp_midi2;

        apmidi_texte0 = "";
        if (+hh < 1800) {
            pos_deb_temp = mon_item0.lastIndexOf('namepictos_apmidi=', 500000) + 'namepictos_apmidi='.length; pos_fin = mon_item0.lastIndexOf('pictos_apmidi=', 500000); ciel_apmidi0 = mon_item0.substring(pos_deb_temp, pos_fin);
            pos_deb_temp = mon_item0.lastIndexOf('tempe_apmidi=', 500000) + 'tempe_apmidi='.length; pos_fin = mon_item0.lastIndexOf('namepictos_apmidi=', 500000); a_traiter = mon_item0.substring(pos_deb_temp, pos_fin);
            temp_apmidi0 = pointvirgule(a_traiter);
            apmidi_texte0 = "  : : : : Praivision de 7 aprais midi  : : : : : :  " + ciel_apmidi0 + ". la tempairature sera de " + temp_apmidi0;
        }
        pos_deb_temp = mon_item1.lastIndexOf('namepictos_apmidi=', 500000) + 'namepictos_apmidi='.length; pos_fin = mon_item1.lastIndexOf('pictos_apmidi=', 500000); ciel_apmidi1 = mon_item1.substring(pos_deb_temp, pos_fin);
        pos_deb_temp = mon_item2.lastIndexOf('namepictos_apmidi=', 500000) + 'namepictos_apmidi='.length; pos_fin = mon_item2.lastIndexOf('pictos_apmidi=', 500000); ciel_apmidi2 = mon_item2.substring(pos_deb_temp, pos_fin);

        //tempairature apmidi
        pos_deb_temp = mon_item1.lastIndexOf('tempe_apmidi=', 500000) + 'tempe_apmidi='.length; pos_fin = mon_item1.lastIndexOf('namepictos_apmidi=', 500000); a_traiter = mon_item1.substring(pos_deb_temp, pos_fin);
        temp_apmidi1 = pointvirgule(a_traiter);
        pos_deb_temp = mon_item2.lastIndexOf('tempe_apmidi=', 500000) + 'tempe_apmidi='.length; pos_fin = mon_item2.lastIndexOf('namepictos_apmidi=', 500000); a_traiter = mon_item2.substring(pos_deb_temp, pos_fin);
        temp_apmidi2 = pointvirgule(a_traiter);


        apmidi_texte1 = "  : :  pour l'aprais midi  : : : : : :  " + ciel_apmidi1 + ". la tempairature sera de " + temp_apmidi1;
        apmidi_texte2 = "  : :  pour l'aprais midi  : : : : : :  " + ciel_apmidi2 + ". la tempairature sera de " + temp_apmidi2;

        var lire1 = date + ". : : Voici les Praivisions metaiorologiques pour " + villelue + matin_texte0 + midi_texte0 + apmidi_texte0 + soir_texte0;
        var lire2 = "";
        var lire3 = "";

        if (+jour >= 2) { lire2 = " : : : : Praivisions pour demain " + jour_en_clair1 + matin_texte1 + midi_texte1 + apmidi_texte1 + soir_texte1; }
        if (+jour == 3) { lire3 = " : : : : Praivisions pour " + jour_en_clair2 + matin_texte2 + midi_texte2 + apmidi_texte2 + soir_texte2; }

        var lire = lire1 + lire2 + lire3;
        karotz.tts.start('<prosody rate="' + rate + '" pitch="' + pitch + '">' + lire + '</prosody>', "fr", fin_description);
        //var tts = http.get("http://translate.google.com/translate_tts?ie=UTF-8&q=bonjour=fr");
        //date1 = date1.replace(" ", "+");
        //karotz.multimedia.play("http://translate.google.com/translate_tts?tl=fr&q=" + date1 + "+:+:+:+", fin_description);
    } //fin de la ville existe
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
