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

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.led.light("0000FF");
	var data = http.get("http://feeds.feedburner.com/FrenchWord?format=xml");
	
	var objDom = new XMLDoc(data);
	var domTree = objDom.docNode;
	var mots=domTree.selectNode("channel/item[0]/title[0]").getText();
	
	var regexp=new RegExp("[:]", "g");
	var match=mots.split(regexp);
	
	var fr = match[0];
	var en = match[1];
	/*
	var description=domTree.selectNode("channel/item[0]/description[0]").getText();
	regexp1=new RegExp("[<>]", "g");
	match1=description.split(regexp1);
	
	var desc = match1[42];
	*/
	karotz.tts.start("Mot Anglais du jour : ", "fr",function(event) {
		if (event == "TERMINATED") {
			karotz.tts.start(fr+" : : : : : : se traduit par", "fr",function(event) {
				if (event == "TERMINATED") {
					karotz.tts.start(en, "en", exitFunction);
				}
			});
		}
	});
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
