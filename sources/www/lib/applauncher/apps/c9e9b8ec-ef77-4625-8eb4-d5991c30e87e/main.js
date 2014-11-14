include("util.js");
include("tinyxmldom.js");

var karotz_ip="localhost";
//var karotz_ip="192.168.0.40";

var station=params[instanceName].station;﻿  //numéro de la station
//var station=130
//log("station : "+station);

var XmlData = http.get("https://abo-nantes.cyclocity.fr/service/stationdetails/"+station); // On récupère les infos en xml de la station
//log("XmlData : "+XmlData);
var objDom = new XMLDoc(XmlData);
var domTree = objDom.docNode;
//log("domTree : "+domTree);

var libre = (domTree.getElements("available")[0].getText()); //On prend le nombre de bicloo libre
//log(" bicloo libre : "+libre);

var prix = (domTree.getElements("free")[0].getText()); //On prend le nombre de bicloo pris
//log("bicloo pris : "+prix);

var total = (domTree.getElements("total")[0].getText()); //On prend le total de bicloo.
//log("total bicloo : "+total);

var ticket = (domTree.getElements("ticket")[0].getText()); //On regarde si l'on peut payer par CB
//log("ticket autorisé : "+ticket);


var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
  if(event == "CANCELLED" || event == "TERMINATED")  {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
﻿  karotz.button.addListener(buttonListener);
  if (ticket==1) {var CB = " la location par cartes bancaire est autorisé";} // On indique à karotz quoi dire si on peut payer CB
  else {var CB = " la location par cartes bancaire n'est pas autorisé";}
﻿  karotz.tts.start("Il y a " + libre + " bicloo disponible à cette station. "+CB, "fr", exitFunction); // on a fini notre conclusion donc on quitte
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
