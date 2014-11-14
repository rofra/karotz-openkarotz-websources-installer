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
	var flux=params[instanceName].flux;
	setTimeout(300000, function(){ log("ping"); ping(); return true; });
	karotz.button.addListener(buttonListener);
	couleur();

	if(flux==128)
	{
		karotz.multimedia.play("http://broadcast.infomaniak.ch/hitwest-high.mp3");
	}
	else
	{
		karotz.multimedia.play("http://broadcast.infomaniak.ch/hitwest-low.mp3");
	}
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
