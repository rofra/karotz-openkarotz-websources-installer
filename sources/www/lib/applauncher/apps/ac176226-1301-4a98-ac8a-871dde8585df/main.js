include("util.js");

function strip_tags(html)
{
	return html.replace(/<\/?(?!\!)[^>]*>/gi, '');
}

var buttonListener = function(event) {
    if ((event == "SIMPLE")||(event == "DOUBLE")) {
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

function couleur()
{
	var color=Math.round(0xffffff * Math.random()).toString(16);
	karotz.led.fade(color,1000);
	execAction(1000);
}
function execAction(delay){setTimeout(delay, function(){couleur();});}

var onKarotzConnect = function(data)
{
	karotz.button.addListener(buttonListener);
	var news = http.get("http://www.ephemeride-jour.fr/nabaztag/T_google_news_lapinKA.php");
	couleur();
	news=strip_tags(news);
	karotz.tts.start(news, "fr", exitFunction);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
