include("util.js");
include("fonctions.js");
include("tinyxmldom.js");

var domTree;
var limit;
var nume;
var kill=0;

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
		if(nume>1){automate(nume-1);}
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
	setTimeout(1000, function()
			  {
                          	kill=0;
			  });
	nume=i;
	if(i<=limit)
	{
		var scmb = domTree.selectNode("/channel/item["+i+"]/description").getText();
		scmb=scmb.replace("0 0","00");
		scmb=scmb.replace("1 0","10");
		scmb=scmb.replace("2 0","20");
		scmb=scmb.replace("3 0","30");
		scmb=scmb.replace("4 0","40");
		scmb=scmb.replace("5 0","50");
		scmb=scmb.replace("6 0","60");
		scmb=scmb.replace("7 0","70");
		scmb=scmb.replace("8 0","80");
		scmb=scmb.replace("9 0","90");
		speakAndGoto(scmb, i+1, 500);
	}
	else
	{
		karotz.tts.start("Fin du flux RSS", "fr", function(event)
						{
							if (event=="TERMINATED")
							{
								exit();
							}
		                    		});
	}
}



var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);

	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	limit = params[instanceName].limit;

	var data = http.get("http://feeds.feedburner.com/Savoir-inutilecom-ToutCeQuiNeSertRienPourBrillerEnSocit?format=xml");

	var objDom = new XMLDoc(data);
	domTree = objDom.docNode;
	speakAndGoto("Savoir Inutile", 1, 500);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
