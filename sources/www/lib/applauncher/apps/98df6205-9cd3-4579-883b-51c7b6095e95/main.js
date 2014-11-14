include("util.js");

var karotz_ip="localhost" //"192.168.1.106" //   
var result =""
var ip=params[instanceName].ip //"192.168.1.102" // 
var port=params[instanceName].port //"40405" //  
var address=params[instanceName].address //"G2:CHACON" //  
var techno=params[instanceName].techno //"zibase" //  
var acttyp=params[instanceName].acttyp //"switch" // 
var nom=instanceName //"Cuisine" //
var action=""

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


var req = function()
{

	if (acttyp=="switch" || acttyp=="temperature") {
		//Recherche Id device en fonction de l'adresse
		url="http://" + ip + ":" + port + "/base/device/list";

		result=http.get(url);
		//log(result);
		var donnees=eval('(' + result + ')');
		for (var k in donnees.device){
			if (donnees.device[k].address == address){
				var id=donnees.device[k].id;
			}
		}

		if (acttyp=="switch") {
			var clef="command";
		}
		else {
			var clef="temperature";
		}

		//Recherche dernière état actionneur
		url="http://" + ip + ":" + port + "/stats/" + id + "/" + clef + "/latest";

		result=http.get(url);
		//log(result);
		donnees=eval('(' + result + ')');

		var etat=donnees.stats[0].value;
		etat=etat.replace("+","");

		//Switch
		if (acttyp=="switch") {
			if (etat=="on") {
				action="off";
			}
			else {
				action="on";
			}
		}
		else {
			karotz.tts.start("Tempairature " + nom + " " + etat + " degrais", "fr", exitFunction);
		}
	}
	if (acttyp=="on") {
		action="on";
	}
	if (acttyp=="off") {
		action="off";
	}

	if (action=="on") {
		var texte="onne";
	}
	else {
		var texte ="off";
	}

	if (acttyp!="temperature") {
		//envoi de la commande
		url="http://" + ip + ":" + port + "/command/" + techno + "/" + address + "/" + action;	

		result=http.get(url);

        	karotz.tts.start(nom + " " + texte, "fr", exitFunction);
	}

}

karotz.connectAndStart(karotz_ip, 9123, req, {});


