include("util.js");
include("fonctions.js");
include("tinyxmldom.js");

var nume;
var kill=0;
var mode;
var heure;
var domTree;
var date_du_jour;

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
	if (event == "START_RIGHT") {
		kill=1;
		karotz.tts.stop(function(event){});
		if(nume>0){automate(nume-1);}
		else{automate(nume);}
	}
	else if (event == "START_LEFT") {
		kill=1;
		karotz.tts.stop(function(event){});
		automate(nume+1);
	}
	return true;
}

function automate(i)
{
	setTimeout(1000, function(){kill=0;});
	nume=i;
	var strDate = domTree.selectNode("/channel/item["+i+"]/pubDate").getText();
	var day = strDate.substring(5,7);
	var month = strDate.substring(8,11);
	month = mois(month);
	var year = strDate.substring(12,16);
	var hours = strDate.substring(17,19);
	var minutes = strDate.substring(20,22);
	d = new Date(year,month,day);
	d.setHours(hours);
	d.setMinutes(minutes);
	
	lire = d.getTime()+heure*3600000-date_du_jour.getTime();
	log("#################### LIRE = "+lire+" ###################");
	if((i==0)&&(lire<0))
	{
		karotz.tts.start("Aucune actualité ! A plus tard", "fr", function(event)
		{
			if (event=="TERMINATED"){exit();}
		});
	}
	else if((lire<0)||(i>20))
	{
		karotz.tts.start("Fin des actualités ! A plus tard", "fr", function(event)
		{
			if (event=="TERMINATED"){exit();}
		});
	}
	else
	{
		var lire = domTree.selectNode("/channel/item["+i+"]/title").getText();
		if(mode=="1")
			lire = lire + " : : : : : : : " + domTree.selectNode("/channel/item["+i+"]/content:encoded").getText().replace(/<(?:.|\n)*?>/gm, '');
		speakAndGoto(lire, i+1, 800);
	}
}

function mois(month){
	if(month=="Jan"){month="01"}
	else if(month=="Feb"){month="02";}
	else if(month=="Mar"){month="03";}
	else if(month=="Apr"){month="04";}
	else if(month=="May"){month="05";}
	else if(month=="Jun"){month="06";}
	else if(month=="Jul"){month="07";}
	else if(month=="Aug"){month="08";}
	else if(month=="Sep"){month="09";}
	else if(month=="Oct"){month="10";}
	else if(month=="Nov"){month="11";}
	else if(month=="Dec"){month="12";}
	
	return month;
}

var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);

	var data = http.get("http://feeds.feedburner.com/blogcrazymac");
	var objDom = new XMLDoc(data);
	domTree = objDom.docNode;
	var strDate = domTree.selectNode("/channel/lastBuildDate").getText();
	var day = strDate.substring(5,7);
	var month = strDate.substring(8,11);
	month = mois(month);
	var year = strDate.substring(12,16);
	var hours = strDate.substring(17,19);
	var minutes = strDate.substring(20,22);
	date_du_jour = new Date(year,month,day);
	date_du_jour.setHours(hours);
	date_du_jour.setMinutes(minutes);

	mode=params[instanceName].mode;
	heure=params[instanceName].heure;

	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	speakAndGoto("Crazy Mac", 0, 500);
}
karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
