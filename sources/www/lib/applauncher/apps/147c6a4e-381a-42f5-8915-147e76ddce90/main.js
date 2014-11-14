include("util.js");
include("tinyxmldom.js");

var status=1;

var buttonListener = function(event) {
    if (event == "SIMPLE") {
	karotz.led.light("000000");
	if (status==1) {
		karotz.led.pulse("0000FF", 500, -1);
        	karotz.multimedia.pause();
		status=0;
	}
	else {
		karotz.led.pulse("0000FF", 1500, -1);
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

var onKarotzConnect = function(data)
{
	setTimeout(300000, function(){ log("ping"); ping(); return true; });
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);

	var bfm=params[instanceName].bfm;
	if (bfm=="d") {
		var url = "http://direct-radio.fr/files/bfm.m3u";
	}
	if (bfm=="p") {
		var id=params[instanceName].podcast;
		var data = http.get("http://podcast.bfmradio.fr/channel" + id + "/BFMchannel" + id + ".xml");
		var objDom = new XMLDoc(data);
		var domTree = objDom.docNode;
		var url = domTree.selectNode("/channel/item[0]/enclosure").getAttribute("url");
	}

	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(url);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
