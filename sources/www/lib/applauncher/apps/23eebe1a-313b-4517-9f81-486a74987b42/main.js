include("util.js");
include("tinyxmldom.js");

var exitFunction = function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		exit();
	}
	return true;
}

var onKarotzConnect = function(data)
{
	var station = params[instanceName].station;
	var station2 = params[instanceName].station2;

	var data = http.get("http://data.keolis-rennes.com/xml/?version=1.0&key=CHJG505TOV24WME&cmd=getstation");
	var objDom = new XMLDoc(data);
	var domTree = objDom.docNode;

	var donnee_station1 = domTree.selectNode("/answer/data/station["+station+"]/name").getText();
	var donnee_station2 = domTree.selectNode("/answer/data/station["+station+"]/bikesavailable").getText();

	if(donnee_station2==0)
	{
		var donnee_station3 = domTree.selectNode("/answer/data/station["+station2+"]/name").getText();
		var donnee_station4 = domTree.selectNode("/answer/data/station["+station2+"]/bikesavailable").getText();
		karotz.tts.start(donnee_station1+" : "+donnee_station2+" vélos disponibles <break time='1000ms'/>"+donnee_station3+" : "+donnee_station4+" vélos disponibles.", "fr", exitFunction);
	}

	else
	{
		karotz.tts.start(donnee_station1+" : "+donnee_station2+" vélos disponibles.", "fr", exitFunction);
	}
}
karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
