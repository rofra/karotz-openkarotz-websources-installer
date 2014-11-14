include("util.js");

var status=1;

var buttonListener = function(event) {
    if (event == "SIMPLE") {
	if (status==1) {
        	karotz.multimedia.pause();
		status=0;
	}
	else {
        	karotz.multimedia.resume();
		status=1;
	}
    }
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

function execAction(delay)
{
	setTimeout(delay, function()
			  {
                          	couleur();
			  });
}

function couleur()
{
	var color=Math.round(0xffffff * Math.random()).toString(16);
	karotz.led.light(color);
	execAction(500)
}

var onKarotzConnect = function(data)
{
	setTimeout(300000, function(){ log("ping"); ping(); return true; });
	karotz.button.addListener(buttonListener);
	couleur();
	karotz.multimedia.play("http://mp3.live.tv-radio.com/oceanefm/all/oceanefm.mp3");
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
