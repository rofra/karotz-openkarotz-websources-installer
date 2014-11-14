include("util.js");
include("tinyxmldom.js");

//var karotz_ip="192.168.1.35";
var karotz_ip="localhost";

var buttonListener = function(event) 
{
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) 
{
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) 
{
    karotz.button.addListener(buttonListener);

    var data = http.get("http://api.viedemerde.fr/1.2/view/random?key=readonly");

    txt = "Aujourd'hui, mon karotz essaye d'acceder à VieDeMerde.fr, mais il n'y arrive pas !";
    
    if (data)
    {
    		var objDom = new XMLDoc(data);
    		var domTree = objDom.docNode;
    		var node = domTree.selectNode("/vdms/vdm[0]/texte");
    		var txt = node.getText();
    		txt = txt.replace(" VDM", "");
    }
    
    karotz.tts.start(txt, "fr", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
