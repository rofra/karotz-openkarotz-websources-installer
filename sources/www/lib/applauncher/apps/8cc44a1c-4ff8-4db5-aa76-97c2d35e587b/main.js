include("util.js");

//var karotz_ip="192.168.0.13"
var karotz_ip='localhost'

var DATA_URL = "http://api.strasparky.com/data/strasbourg?device=karotz";
var STATUS_URL = "http://api.strasparky.com/status/strasbourg?device=karotz";

if (karotz_ip == 'localhost') { 
	var parkingId = params[instanceName].parking; }
else {
	var parkingId = "12";} 

var lang = "fr";

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
	log("begin...");
	
    karotz.button.addListener(buttonListener);
    
	karotz.led.light("0000FF");// couleur bleu
	
	var parkingInfo = getParkingInfo(parkingId)
    var parkingDetail = getParkingDetail(parkingId);
    
    karotz.tts.start(getText(parkingId, parkingInfo, parkingDetail, lang), lang, exitFunction);

    log("...end");
}

var getParkingDetail = function(id){
	try{
		var data = http.get2(STATUS_URL);
		if(data==null) {return null;}
		
    	var json = JSON.parse(data.content);
    	
    	for (var i = 0; i < json.data.length; i++) {
       		if(json.data[i].id==id) {
    			return json.data[i];
    		}
    	}
    	
    	return null;
    }catch(err){
    	return null;}
}

var getParkingInfo = function(id){
	try{
		var data = http.get2(DATA_URL);
    	
    	var json = JSON.parse(data.content);
    	
    	for (var i = 0; i < json.data.length; i++) {
    		if(json.data[i].id==id) {
    			return json.data[i];
    		}
    	}
    	
    	return null;
    }catch(err){
    	return null;}
}

var getText = function(id, info, detail, lang){
	if(lang=="fr"){
		return getFrText(id, info, detail);}
	else{
		return "Désolé mais StrasParky ne sait que parler français pour le moment";
	}
}

var getFrText = function(id, info, detail){
	var text = "";

	if(info==null || detail==null){
		text = text+ "Désolée une erreur a eu lieu lors de la récupération du nombre de places restantes.  Veuillez réessayer plus tard";
		return text;}
	
	if(detail.status=="OPEN"){
		if(detail.free==detail.total){
			text = text + "Toutes les places sont disponibles ";
		} else {
			text = text + "Il reste ";
			if(detail.free==1) {
				text = text + " une " ;}
			else {
				text = text + detail.free;}
			text = text + " places sur ";
			text = text + detail.total;
		}
		text = text + " dans le parking ";
		text = text + speak(id,info.name);
	}
	
	if(detail.status=="CLOSE"){
		text = text + "Le parking ";
		text = text + speak(id,info.name);
		text = text + " est actuellement fermé";
	}
	
	if(detail.status=="FULL"){
		text = text + "Le parking ";
		text = text + speak(id,info.name);
		text = text + " est actuellement complet";
	}
	
	if(detail.status=="UNKNOWN"){
		text = text + "Désolé votre karotz ne sait combien il reste de place dans le parking ";
		text = text + speak(id,info.name);
		text = text + ". Veuillez réessayer plus tard.";
	}
	
	return text;
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
