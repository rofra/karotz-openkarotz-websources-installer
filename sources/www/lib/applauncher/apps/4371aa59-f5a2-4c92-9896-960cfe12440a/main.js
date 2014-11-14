include("util.js");

var buttonListener = function(event) {
	if ((event == "DOUBLE")||(event == "SIMPLE")) {
		exit();
	}
}

function boucle()
{
	karotz.multimedia.play("http://karotz.sylvainmenu.com/antimoustique/son.mp3", function(event)
		{
			if (event=="TERMINATED")
			{
				boucle();
			}
			return true;
		});
}

var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.button.addListener(buttonListener);
	boucle();
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
