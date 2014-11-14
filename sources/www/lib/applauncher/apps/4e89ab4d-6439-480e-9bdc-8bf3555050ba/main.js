include("util.js");
include("fonctions.js");
include("tinyxmldom.js");

var kill=0;
var heure;
var num;
var lire;
var data = http.get("http://feeds.feedburner.com/viedemerde?format=xml");
var objDom = new XMLDoc(data);
var domTree = objDom.docNode;

 var strDate = domTree.selectNode("/updated").getText();
 var day = strDate.substring(8,10);
 var month = strDate.substring(5,7);
 var year = strDate.substring(0,4);
 var hours = strDate.substring(11,13);
 var minutes = strDate.substring(14,16);
 date_du_jour = new Date(year,month,day);
 date_du_jour.setHours(hours);
 date_du_jour.setMinutes(minutes);

var buttonListener = function(event) {
	if (event == "SIMPLE") {
		kill=1;
		karotz.tts.stop(function(event){});
		automate(num);
	}
	if (event == "DOUBLE") {
		exit();
	}
	return true;
}

var earsListener = function(event,step) {
	if ((event == "START_RIGHT")&&(lire >= 0)) {
		kill=1;
		karotz.tts.stop(function(event){});
		if(num>0){automate(num-1);}
		else{automate(num);}
	}
	if ((event == "START_LEFT")&&(lire >= 0)) {
		kill=1;
		karotz.tts.stop(function(event){});
		automate(num+1);
	}
	return true;
}

function automate(i)
{
	setTimeout(1000, function()
			  {
                          	kill=0;
			  });
	num=i;
	var date_article = domTree.selectNode("/entry["+i+"]/updated").getText();
	var day = date_article.substring(8,10);
	var month = date_article.substring(5,7);
	var year = date_article.substring(0,4);
	var hours = date_article.substring(11,13);
	var minutes = date_article.substring(14,16);
	d = new Date(year,month,day);
	d.setHours(hours);
	d.setMinutes(minutes);
	lire = d.getTime()+heure*3600000-date_du_jour.getTime();
	if(lire<0)
	{
		karotz.tts.start("Fin du flux RSS VDM", "fr", function(event)
						{
							if (event=="TERMINATED")
							{
								exit();
							}
		                    		});
	}
	var vdm = domTree.selectNode("/entry["+i+"]/content").getText();
	speakAndGoto(vdm, i+1, 2);
}
 


var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);

	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	heure = params[instanceName].heure;

	execAction(0,0);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
