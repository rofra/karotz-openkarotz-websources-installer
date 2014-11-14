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
	if(i>limit)
	{
		karotz.tts.start("Fin du flux RSS", "fr", function(event)
						{
							if (event=="TERMINATED")
							{
								exit();
							}
		                    		});
	}
	else
	{
		var mot = domTree.selectNode("/channel/item["+i+"]/title").getText();
		var regexp=new RegExp("[(]", "g");
		mot=mot.split(regexp);
		mot=mot[0];
		var def = domTree.selectNode("/channel/item["+i+"]/description").getText();
		speakAndGoto(" <break time='700ms'/>"+mot+"<break time='300ms'/>"+def, i+1, 500);
	}
}



var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);

	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	limit = params[instanceName].limit;

	var data = http.get("http://www.wikipourri.com/rss/");

	var objDom = new XMLDoc(data);
	domTree = objDom.docNode;
	speakAndGoto("Wiki pourri", 1, 0);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
