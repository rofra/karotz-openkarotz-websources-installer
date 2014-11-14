include("util.js");
include("vcub.js");

var karotz_ip="localhost"

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

var getStationKey = function(){
    var stationKey = 22;
    if(typeof(params) != "undefined" && typeof(instanceName) != "undefined"){
      stationKey = params[instanceName].station;
    }
    return stationKey;
}

var getInfoKey = function(){
    var infoKey = "both";
    if(typeof(params) != "undefined" && typeof(instanceName) != "undefined"){
      infoKey = params[instanceName].info;
    }
    return infoKey;
}

var onKarotzConnect = function(data) {
  karotz.button.addListener(buttonListener);
	karotz.led.light("FFFFFF");
	
	var remainingBikes;
	var availableSlots;
	var station
	var stationTitle;
	var isOnline;

  //récupération du flux Vcub
	var data = http.get2("http://www.vcub.fr/stations/feed/json");
	var response = JSON.parse(data.content);

	
	//Look for selected station
	for(var i= 0; i < response.items.length; i++)
	{
		var item = response.items[i];
		if(item["bikes:station-id"] == getStationKey()) {
			remainingBikes = item["bikes:available-vehicules"] ;
			availableSlots = item["bikes:available-slots"] ;
			isOnline = item["bikes:station-online"] ;
			stationTitle = stations[item.title] ;
		}
	}
  

  var announce = buildAnnounceAndSetLed(getInfoKey(), stationTitle, isOnline, remainingBikes, availableSlots);
  karotz.tts.start(announce, "fr", exitFunction);
}

var buildAnnounceAndSetLed = function(info, stationTitle, isOnline, remainingBikes, remainingSlots) {
  var announce;
  var colorLed;
  
  //La station est online
  if (isOnline == 1) {
    switch(info)
    {
      //On ne s'intéresse qu'aux vélos
      case "bikes":
            if (remainingBikes > 0) {
              	 if (remainingBikes > 2){
              	     announce = "Il reste " + remainingBikes + " vélos";
              	     colorLed = "00CC00";  //Vert
                 }else {
              		 announce = "Il ne reste que " + remainingBikes + " vélos";
              		 colorLed = "FF8C00";  //Orange
              	 }
            } else {
              	announce = "Il ne reste aucun vélo";
              	colorLed = "FF0000"; //Rouge
            }
            break;
    
    //On ne s'intéresse qu'aux bornes
      case "slots":
            if (remainingSlots > 0) {
              	 if (remainingSlots > 2){
              	     announce = "Il reste " + remainingSlots + " emplacement";
              	     colorLed = "00CC00";  //Vert
                 }else {
              		 announce = "Il ne reste que " + remainingSlots + " emplacement";
              		 colorLed = "FF8C00";  //Orange
              	 }
            } else {
              	announce = "Il ne reste aucun emplacement";
              	colorLed = "FF0000"; //Rouge
            }
            break;
      
      //On s'intéresse à la fois aux bornes et aux vélos
      case "both":
            if (remainingBikes > 0 && remainingSlots > 0) {
               announce = "Il reste " + remainingBikes + " vélos et "+ remainingSlots + " emplacement";
               
               if (remainingBikes < 3 || remainingSlots < 3){
                  colorLed = "FF8C00"; //Orange
               }else {
                  colorLed = "00CC00";  //Vert
               }
               
            } else {
                colorLed = "FF8C00"; //Orange
                if (remainingBikes > 0) {
                   announce = "Il y a " + remainingBikes + " vélos mais aucun emplacement n'est disponible"; 
                } else {
                   announce = "Il y a " + remainingSlots + " emplacement mais aucun vélo n'est disponible"; 
                }
            }
    }
  	announce += " à la station " + stationTitle;

  //La station est Ko 
	}  else {
      announce = "La station " + stationTitle + " est en maintenance";
  }
  
  //On allume la led
  karotz.led.light(colorLed);
  
  return announce;
}


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
