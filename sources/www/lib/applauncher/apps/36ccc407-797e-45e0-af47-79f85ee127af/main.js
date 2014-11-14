include("util.js");
include("tinyxmldom.js");

var karotz_ip="localhost";

var buttonListener = function(event) {
    if (event == "SIMPLE") {
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
	
	var site=params[instanceName].site;
	var data;
	if(site=="fr")
		data = http.get("http://www.qoqa.fr/fr/feed/product");
	else
		data = http.get("http://www.qoqa.ch/fr/feed/product");
	var objDom = new XMLDoc(data);
	var domTree = objDom.docNode;
	
	var title = domTree.selectNode("/channel/item[0]/title").getText();
	var desc = domTree.selectNode("/channel/item[0]/description").getText();
	var reg=new RegExp("[☆€]+", "g");
	var tableau=title.split(reg);
	title = tableau[0];
	var prix = tableau[1];
	
	var lire;
	if(site=="fr")
		lire = "Coucou !! koka vous propose aujourd'hui un "+title+ "au prix de "+prix+" euros. : : : : : : : : : : : : " +desc+". A demain pour un nouveau produit !";
	else
		lire = "Coucou !! koka vous propose aujourd'hui un "+title+ "au prix de "+prix+" francs. : : : : : : : : : : : : " +desc+". A demain pour un nouveau produit !";

	karotz.tts.start(lire, "fr", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
