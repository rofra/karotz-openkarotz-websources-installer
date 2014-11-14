include("util.js");
include("tinyxmldom.js");

	
	var BLUE="0000FF";
	var XmlCantelou=http.get("http://www.europe1.fr/podcasts/revue-de-presque.xml");
	var StationDom=new XMLDoc(XmlCantelou);
	var maxpod=StationDom.selectNode("channel").getElements("item").length;
	var podid=0;
	var Podcast=StationDom.selectNode("channel/item["+podid+"]/enclosure").getAttribute("url");
	var playing=0;

var debuglog = function(string) {
   var d = new Date();
   var hh = "" + d.getHours();
   var mm = d.getMinutes();
   if (mm < 10) { mm = "0" + mm; }
   hh = hh + 'h' + mm + " : ";
   if (karotz_ip == 'localhost') {
       //karotz.serial.write(hh + string + '\n\r');
	   //log(hh + string);
   }
   else log(hh + string);
   return true;
}

var buttonListener = function(event) {
// if a button is clicked, exit application
debuglog("In buttonListener, event is:"+event);
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop();
		debuglog("Thats the end");
		exit();
	}
	return true;
}

var mediaListener=function(event) {
debuglog("In mediaListener, event is:"+event);
if (event=="TERMINATED"){
 if (playing==1) {playing=0} else {playnext();}
 }
 return true;
}

var playnext =function() {
	debuglog("Playing next podcast");
	podid=podid+1;
	if (podid==maxpod) { 
	debuglog("Last podcast is reached, go to first");
	podid=0 
	}
	Podcast=StationDom.selectNode("channel/item["+podid+"]/enclosure").getAttribute("url");
	playing=1;
	karotz.multimedia.stop();
	karotz.multimedia.play(Podcast,mediaListener); 
}

var earsListener = function(event,step,len) { 
// If an ear is touched, play previous podcast.
debuglog("in earsListener, event is "+event+".");	
 if (event.indexOf("START") >= 0)
    { 
		playnext();
    } 
	return true;
}	

var onKarotzConnect = function(data) {
	//Install Log Function
	//if (karotz_ip == 'localhost') {karotz.serial.open("/dev/ttyGS0", 9600);}
	debuglog("--------------------------------------");
	debuglog("| Welcome to Revue de Presque V 1.0.6 |");
	debuglog("|           Vote for my App !!        |");
	debuglog("|                                     |");
	debuglog("| thks to AL1 for Serial Debug        |");
	debuglog(" --------------------------------------");


	
	//Fade to blue (Europe1 color).
	debuglog("Fade to blue ...");
	karotz.led.fade(BLUE, 3000);
	//Add listeners
	debuglog("Add button listener");
	karotz.button.addListener(buttonListener);
	debuglog("Add ears listener");
	karotz.ears.addListener(earsListener);
	//play the first podcast
	debuglog("Playing first podcast");
	karotz.multimedia.play(Podcast,mediaListener);
	setTimeout(300000, function(){ ping(); return true; });
}

var karotz_ip = 'localhost';
if(typeof(instanceName)=='undefined'){ include("../vm.js");}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
