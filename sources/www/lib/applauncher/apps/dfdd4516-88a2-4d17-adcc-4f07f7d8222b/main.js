include('util.js');
include('tinyxmldom.js');

var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop();
		exit();
	}
	return true;
}

var fincloche=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")) {
exit();
}
return true;
}

var aftertts=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")) {
	karotz.multimedia.play("/usr/karotz/apps/dfdd4516-88a2-4d17-adcc-4f07f7d8222b/Cloche.mp3",fincloche);
}
return true;
}

var tts_say=function(event) {
if ((event=="TERMINATED")||(event=="CANCELED")){
karotz.tts.start("Extrait de la Traduction Liturgique de la Bible - copyright A E L F, Paris, Service offert par l'Evangile au Quotidien","fr",aftertts);
}
return true;
}


var onKarotzConnect = function(data) {
	karotz.led.fade('ff00FF', 6000);
	karotz.button.addListener(buttonListener);

	var nodeid=0;
	var Evangile={};
	//GUID 2012-03-11 - EVANGELIUM
	var currentTime = new Date(); 
    var month = currentTime.getMonth() + 1; 
    var day = currentTime.getDate(); 
    var year = currentTime.getFullYear(); 
    if (day < 10) day = '0'+day; 
    if (month < 10) month = '0'+month;
	log("Searching:"+year+"-"+month+"-"+day+" - EVANGELIUM");
	
	var XmlEvangile = http.get("http://evangelizo.org/rss/evangelizo_rss-fr.xml");
	var EvangileDom=new XMLDoc(XmlEvangile);
	for (i=0; i<EvangileDom.selectNode("channel").getElements("item").length; i++){ 
	 	if (EvangileDom.selectNode("channel/item["+i+"]/guid").getText()==""+year+"-"+month+"-"+day+" - EVANGELIUM") {nodeid=i;}
		}
	Evangile.titre=EvangileDom.selectNode("channel/item["+nodeid+"]/title").getText();
	Evangile.description=EvangileDom.selectNode("channel/item["+nodeid+"]/description").getText();
	karotz.tts.start(Evangile.description,"fr",tts_say);
  
}

var karotz_ip = 'localhost';
if(typeof(instanceName)=='undefined'){ include("../vm.js");}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});