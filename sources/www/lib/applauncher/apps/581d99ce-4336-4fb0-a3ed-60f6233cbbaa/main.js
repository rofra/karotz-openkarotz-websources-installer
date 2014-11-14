include("util.js");

// For the VM
var karotz_ip = 'localhost';
var debugvm = false;
if(instanceName=="undefined"){ include("vm.js");}

// Compute the time until tomorrow
var tomorrowDate = function(hours, minutes){
	var now = new Date();
	var target_date;
	
	// si on a passé l'heure c'est que ça doit être demain
	if(now.getHours()>hours){
		target_date=new Date(now.getTime() + 86400000);
	}else{
		// si on est dans l'heure mais plus tard, c'est que ça doit être demain
		if(now.getHours()==hours & now.getMinutes()>minutes){
			target_date=new Date(now.getTime() + 86400000);
		}else{
		// sinon, c'est aujourd'hui
			target_date=now;
		}
	}
	target_date.setHours(hours);
	target_date.setMinutes(minutes);
	target_date.setSeconds(0);
	return target_date;
}

// Exit on double click
var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

// time from now till the specified "end_date"
var remainingTime = function(end_date){
	diff= new Date(end_date.getTime()-new Date);
	return 	diff;
}

// exit function
var exitFunction = function(event) {
	log("Exit event="+event);
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

// parse the ASR result
var parseHour=function(asrProcess){
	log(asrProcess.semantic);
	if(asrProcess.semantic=="déjeuner"){
		var splittime=params[instanceName].dejeuner.split(":");
		heures=splittime[0];
		minutes=splittime[1];
	}else if(asrProcess.semantic=="diner"){
		var splittime=params[instanceName].diner.split(":");
		heures=splittime[0];
		minutes=splittime[1];
	}else if(asrProcess.semantic=="souper"){
		var splittime=params[instanceName].souper.split(":");
		heures=splittime[0];
		minutes=splittime[1];
	}else if(asrProcess.semantic=="petit-déjeuner"){
		var splittime=params[instanceName].petit_dejeuner.split(":");
		heures=splittime[0];
		minutes=splittime[1];
	}else if(asrProcess.semantic=="défaut"){
		var splittime=params[instanceName].defaut.split(":");
		heures=splittime[0];
		minutes=splittime[1];
	}else if(asrProcess.semantic=="perso"){
		var splittime=params[instanceName].perso.split(":");
		heures=splittime[0];
		minutes=splittime[1];
	}else{
		log("No hour specified. Defaut value is petit-déjeuner");
		var splittime=params[instanceName].defaut.split(":");
		heures=splittime[0];
		minutes=splittime[1];;	
	}
	var remain=remainingTime(tomorrowDate(heures,minutes));
	karotz.tts.start("J'ai compris "+Math.round(heures)+" heures et "+Math.round(minutes)+" minutes. Il faut donc programmer "+Math.floor(remain.getTime()/1000/60/60)%24+" heures et "+Math.floor(remain.getTime()/1000/60)%60+" minutes", "fr-FR", exitFunction);
}

// Define the ASR function
var getHour=function(event){
	if(event == "TERMINATED"){
			karotz.asr.string("(petit-déjeuner|déjeuner|diner|souper|défaut|perso)", "fr-FR", parseHour);
		}
}

// Main function
var onKarotzConnect = function(data){
	log(params[instanceName].souper);
	karotz.button.addListener(buttonListener);
	karotz.tts.start("Pour quel repas voulez vous votre pain ?", "fr-FR",getHour);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});