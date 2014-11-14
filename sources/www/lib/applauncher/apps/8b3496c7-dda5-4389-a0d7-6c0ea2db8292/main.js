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
	if(i>=limit)
	{
		karotz.tts.start("A demain pour de nouvelles anecdotes !", "fr", function(event)
			{
				if (event=="TERMINATED"){exit();}
		    });
	}
	else
	{
		var scmb = http.get(domTree.selectNode("/channel/item["+i+"]/guid").getText());
		var regexp=new RegExp("<meta name=\"description\" content=\"", "g");
		scmb=scmb.split(regexp);
		scmb=scmb[1];
		var regexp=new RegExp("\" />", "g");
		scmb=scmb.split(regexp);
		scmb=scmb[0];
		
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
		scmb=scmb.replace(" (voir la vidéo)","");
		speakAndGoto(scmb, i+1, 700);
	}
}



var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);

	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	limit = params[instanceName].limit;
	var category = params[instanceName].category;
	//limit=5;var category="anecdotes";
	//var data = http.get("http://www.secouchermoinsbete.fr/webservices/getAnecdotesList.php?check=jghDRhes5695ggfs9868&type=default&limit="+limit+"&offset=0&category="+category+"&hash=691B24A1368C0A5409E762184BE1F728");
	var data = http.get("http://www.secouchermoinsbete.fr/rss/"+category+".rss.xml");

	var objDom = new XMLDoc(data);
	domTree = objDom.docNode;
	speakAndGoto("Se coucher moins bête", 0, 500);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
