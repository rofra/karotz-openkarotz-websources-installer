include("util.js");

var karotz_ip="localhost";
var veraAdress= params[instanceName].veraAdress;
var numSceneModule= params[instanceName].numSceneModule;
var typeAction= params[instanceName].typeAction;
var message= params[instanceName].message;


/*var karotz_ip="192.168.0.5";
var veraAdress= "192.168.0.4";
var numSceneModule= "9";
var typeAction= "Scene";
var message= "il fait {temp} degré";*/


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


var getAdressAction = function(){
    switch(typeAction)
    {
    case "Scene":
        return "id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum=" + numSceneModule;
	case "SecuritySensorOn":
        return "id=variableset&DeviceNum=" + numSceneModule + "&serviceId=urn:micasaverde-com:serviceId:SecuritySensor1&Variable=Armed&Value=1";
	case "SecuritySensorOff":
        return "id=variableset&DeviceNum=" + numSceneModule + "&serviceId=urn:micasaverde-com:serviceId:SecuritySensor1&Variable=Armed&Value=0";
    case "TemperatureSensor":
        return "id=variableget&DeviceNum=" + numSceneModule + "&serviceId=urn:upnp-org:serviceId:TemperatureSensor1&Variable=CurrentTemperature"
    default:
        return "id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum=" + numSceneModule;
    }
}


var onKarotzConnect = function(data) {
    var adressAction=getAdressAction();
    var retour = http.get("http://" + veraAdress + ":3480/data_request?" + adressAction );
    if (message!="")
	{
		if (typeAction=="TemperatureSensor")
		{
			var msgFormat=message.format({ temp:  retour});
			karotz.tts.start(msgFormat,"FR", exitFunction);
		}
		else
		{
			karotz.tts.start(message,"FR", exitFunction);
		}
	}
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
