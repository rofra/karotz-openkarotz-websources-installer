include("util.js");
include("tinyxmldom.js");

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

var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);

	var data = http.get("http://www.lapenseedujour.net/penseeweb.php");

	var regexp=new RegExp("[><]", "g");

	var match=data.split(regexp);

	var phrase = match[14];
	var phrase2= match[22];
	
	phrase=phrase.replace("\\","");
	phrase2=phrase2.replace("\\","");

	karotz.button.addListener(buttonListener);
	karotz.tts.start("La pensée du jour <break time='700ms'/>" + phrase + "<break time='700ms'/>" + phrase2, "fr", exitFunction);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});





