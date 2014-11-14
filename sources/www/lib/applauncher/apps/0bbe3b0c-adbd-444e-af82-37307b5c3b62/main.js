include("util.js");

var DEV_MODE = false;
var karotz_ip, url, data;

karotz_ip="localhost";
if (DEV_MODE) { karotz_ip="192.168.1.13"};

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.tts.start(tts_chaine, "fr", exitFunction);
}

var normalize = function(data) {
	if (typeof(data) != 'undefined') {
		data = data.toLowerCase();
		data = myreplace(data, "&gt;", "");
		data = myreplace(data, "&nbsp;", "");
		data = myreplace(data, "^[ ]*", "");
		data = myreplace(data, "-", " ");
		data = myreplace(data, "'", " ");
		data = myreplace(data, "^st ", "saint ");
		data = myreplace(data, " st ", " saint ");
		data = myreplace(data, "^pte ", "porte ");
		data = myreplace(data, " pte ", " porte ");
		data = myreplace(data, "^d ", "d");
		data = myreplace(data, " d ", " d");
		data = myreplace(data, "^l ", "l");
		data = myreplace(data, " l ", " l");
		data = myreplace(data, "^1 mn$", "une mn");
		data = myreplace(data, "^(.*[2-68])1 mn$", "$10 et une mn");
		data = myreplace(data, "termine", "terminé");      
		data = myreplace(data, "retarde", "retardé");
		data = myreplace(data, "commence", "commencé");
		data = myreplace(data, "tgv", "tégévé");
		data = myreplace(data, "montparnasse", "monparnasse");
		data = myreplace(data, "RER", "R E R ");
		data = myreplace(data, "RATP", "R A T P");
		data = myreplace(data, "&eacute;", "é");
		data = myreplace(data, "&egrave;", "è");
	}
    return data;
}


var semblable = function(data1, data2) {
	data1 = myreplace(data1, " ", "");
	data2 = myreplace(data2, " ", "");
	var cmp1 = myreplace(data1, data2, "");
	var cmp2 = myreplace(data2, data1, "");
	if ((cmp1.length < 5) || (cmp2.length < 5))
		return true;
	else
		return false;
}

if (DEV_MODE) {
	url = "http://wap.ratp.fr/siv/perturbation?cause=alerte";
	// url = "http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B91&stationid=91_16_35";
	//url = "http://wap.ratp.fr/siv/schedule?service=next&reseau=tram&lineid=BT2&directionsens=A&stationid=T2_1092_1098";
	//url = "http://wap.ratp.fr/siv/schedule?service=next&reseau=noctilien&lineid=BN21&stationid=N21_21477_21544";
	instanceName = "Bus 91";
} else {
	url = params[instanceName].url;
}

if (mycontains(url, "perturbation")) {
	// Perturbations
	data = http.get(url);
	data = concatener(data);
	data = myreplace(data, "^.*Etat du trafic", "Etat du trafic");
	data = suppr_balises(data);
	data = myreplace(data, "Actualiser.*$", "");
	data = myreplace(data, "[^ ]* [^ ]* [^ ]* 20.. \\(..:..\\)", "");
	data = myreplace(data, ", pour plus d'infos, cliquer [^\\.]*\\.", ".");
	data = myreplace(data, "le point sur les transports en commun", "");
	data = myreplace(data, "Prochain point [^\\.]*\\.", "");
	data = myreplace(data, "Transilien", "Transsilien");
	data = normalize(data);
	//log(data);

} else if (mycontains(url, "schedule")) {
	// Prochains passages

	// Constitution du header (pour les cookies)
	var header = {};
	header["User-Agent"] = "Mozilla/5.0 (X11; Linux i686; rv:5.0) Gecko/20100101 Firefox/5.0";
	
	// Appel de la page d'accueil pour récupérer un JSESSIONID
	var ret = http.get2("http://wap.ratp.fr/siv/", header);
	//log("header :" + ret.header);
	
	var cookies = getCookies(ret.header);
	var jsessionid = cookies["JSESSIONID"];
	//log("JSESSIONID = " + jsessionid);
	
	// Ajout du JSESSIONID dans les headers
	header["Cookie"] = "JSESSIONID=" + jsessionid + "; Path=/siv";
	
	// Appel de la page
	ret = http.get2(url, header);
	var data = ret.content;
	//log("data : " + data);

	// Suppression des en-tetes et pieds de page
	data = concatener(data);
	data = myreplace(data, "^.*<body>", "");
	//data = suppr_balises(data);
	data = myreplace(data, "Actualiser.*$", "");
	data = myreplace(data, "<b>", "");
	data = myreplace(data, "</b>", "");

	var htmlData = data;
	// log(htmlData);
	
	// Autre méthode
	var vRet2 = {};
	var tabData = htmlData.split("<b class=\"bwhite\">");
	
	if (tabData.length < 4) {
		// Erreur : on ne retrouve pas l'arret ou une direction
		data = suppr_balises(htmlData);
		data = myreplace(data, "Prochains passages en temps .*[^ ]* [^ ]* [^ ]* 20.. \\(..:..\\)", "");
		
	} else {
		
		// Arret
		tabData[2].match(new RegExp("^([^<]*)<", "gi"));
		vRet2['Arret'] = normalize(RegExp.$1);
		data = "A l'arrè " + vRet2['Arret']  + " , " ;
		
		// Pour chaque direction
		for (i=3;i<tabData.length;i++) {
			tabData[i].match(new RegExp("^([^<]*)<", "gi"));
			vRet2['Dir'+eval(i-2)] = normalize(RegExp.$1);
			data += " prochain passage en direction de " + vRet2['Dir'+eval(i-2)] + " " 
			
			// Pour chaque prochain depart
			var tabDeparts = tabData[i].split(new RegExp("<div class=\"bg[13]\">", "gi"));
			
			for (j=1;j<tabDeparts.length;j++) {
				// Terminus
				if (tabDeparts[j].match(new RegExp("^([^<]*)<", "gi")))
					vRet2['Term'+eval(i-2)+'_'+eval(j)] = normalize(RegExp.$1);
				// Temps
				if (tabDeparts[j].match(new RegExp("<div class=\"schmsg.\">([^<]*)<", "gi"))) {
					vRet2['Temps'+eval(i-2)+'_'+eval(j)] = normalize(RegExp.$1);
					if (j != 1) {
						// Cas autre que premier depart pour cette destination
						data += ". Le suivant ";
					}
					if (vRet2['Temps'+eval(i-2)+'_'+eval(j)].match(new RegExp(" mn$", "gi"))) {
						// Cas où horaire dans xxx minutes
						data += " dans ";
					}
					data += " : " + vRet2['Temps'+eval(i-2)+'_'+eval(j)];
					if (!semblable(vRet2['Dir'+eval(i-2)], vRet2['Term'+eval(i-2)+'_'+eval(j)])) {
						// Cas où le terminus est different de la direction
						data += " ; il sera terminus " + vRet2['Term'+eval(i-2)+'_'+eval(j)];
					}
				} else {
					// Cas special (service non commence, termine, etc...)
					data += " : " + vRet2['Term'+eval(i-2)+'_'+eval(j)] + " ";
				}
			}
			data += ". ";
		}
			
	}
	
	// log(print_r(vRet2));
	// log (data);
	
}

tts_chaine = "RATP " + instanceName + ". " + data;

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

