include("util.js");

var karotz_ip = 'localhost';
var debugvm = false;
if(instanceName=="undefined_not_known"){ include("vm.js");}

var toread_checkins={};
var unread=1;
var now = new Date();
var file_timestamp = "foursquare.js";

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
	log("Exit event="+event);
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

// read the first (newest) checkin, then remove it from the tab
var tts = function(event) {
	// The event == "TERMINATED" is necessary because it's a callback function, we also check that there is still something to read
	if(event == "TERMINATED" && toread_checkins.length>0) {
		log("Length before :"+toread_checkins.length);
		// assign the first checkin in the array to the variable txt
		var txt=toread_checkins[0];
		// then we remove it from the tab
		toread_checkins.shift();
		log("Length after :"+toread_checkins.length);
		
		var checkin=txt.user.firstName + " "+ txt.user.lastName + " a fait un checking";
		
		
		
		// Basic checkin read, I suppose each venue should have a name
		if(txt.venue.name != "" && txt.venue.name != null && txt.createdAt!=null && txt.createdAt !=""){
			checkin+=" de "+ txt.venue.name+" ";
			var createdAt=new Date(txt.createdAt*1000);
			var diff_date = new Date(now - createdAt);
			
			log("Checkin created on "+createdAt.toString());
			
			var remainingDays= Math.floor(diff_date.getTime()/1000/60/60/24);
			var remainingHours= Math.floor(diff_date.getTime()/1000/60/60)%24;
			var remainingMinutes= Math.floor(diff_date.getTime()/1000/60)%6;
			
			
			log("It was "+remainingDays + " jours "+ remainingHours + " heures " + remainingMinutes +" minutes ago");
			
			if(remainingMinutes>0 || remainingDays>0 || remainingHours>0){
				checkin+=" il y a  ";
			}
			
			if(remainingDays>0){
				checkin+=remainingDays+ " jours  ";
			}
			
			if(remainingHours>0){
				checkin+=remainingHours+" heures  ";
			}
			log(remainingMinutes);
			if(remainingMinutes>0){
				checkin+=remainingMinutes+" minutes  ";
			}
			checkin+=". ";
			// city is defined
			if(txt.venue.location.city!="" && txt.venue.location.city != null){
				checkin+="  Cet endroit se trouve à "+txt.venue.location.city+". ";
				// to use in case I would like to add the exact address txt.venue.location.address
			}
			
			// the distance is provided
			if(txt.venue.location.distance!="" && txt.venue.location.distance != null){
				var dist=Math.round(txt.venue.location.distance/1000);
				if(dist<20){
					checkin+="  C'est seulement à  "+ dist +" kilomètres de chez toi. ";
				}else{
					checkin+="  C'est à  "+ dist +" kilomètres de chez toi. ";
				}
			}
			
			// your friends let a comment following his checkin
			if(txt.shout!="" && txt.shout!=null){
				checkin+=".   Il a laissé un commentaire: "+txt.shout+" .";
			}
				
			// Log the full checkin test
			log(checkin);
			// There is still a checkin to process, so we speak and we call recursively the same function (using the call back)
			if(toread_checkins.length>0){
				karotz.tts.start(checkin,"fr-FR", tts);
			}else{
			// no other unread checkins after this one. So we read it and exit
				karotz.tts.start(checkin,"fr-FR", exitFunction);
			}
		} else {
			karotz.tts.start("Un des checkins ne possède pas de nom, je ne gère pas ce type de checkins mal formattés","fr-FR", tts);
		}
	}else if(toread_checkins.length==0){
		// This case should never be reached
		exit();
	}
}

// TODO
// Quand on fait un déclenchement par le tag, il faut quand même que ça update le timestamp

var onKarotzConnect = function(data){
	// add the button listener
	karotz.button.addListener(buttonListener); 
	karotz.led.light("0080FF");
	// get to foursquare
	var fsqr_answer = http.get("https://api.foursquare.com/v2/checkins/recent?oauth_token="+params[instanceName].token_foursquare+"&limit="+params[instanceName].max_read+"&ll="+params[instanceName].latitude+","+params[instanceName].longitude+"&v=20120415");
	// parse the JSON answer
	var result = JSON.parse(fsqr_answer);
	
	// There is at leat one checkin in the answer
	if(result['response'].recent != null && result['response'].recent.length>0){
		size=result['response'].recent.length;
		log("size: "+size);
		if(launchType.name != null && launchType.name == "SCHEDULER"){
			// how many items are unread?
			var lastRead = file.read(file_timestamp);
			
			log("Last read :" + lastRead.text);
			log("CreatedAt : "+result['response'].recent[0].createdAt+ " "+ params[instanceName].max_read);
			var i=0;
			while((i < params[instanceName].max_read) && (lastRead.text < result['response'].recent[i].createdAt)){
				i++;
			}
			unread = i;
			var newLastRead=""+result['response'].recent[0].createdAt;
			file.write(file_timestamp,newLastRead);
			// start to read the unread messages
			allUnread(result);
		}else{
			all(result);	
		}
		
	}else{
	// No checkin, I quit
		karotz.tts.start("Ton compte doit être nouveau, je ne vois pas un seul checkin de tes amis...","fr-FR", exitFunction);
	}
}

var allUnread = function(result){
	if(unread>0){
		toread_checkins=result['response'].recent.slice(0,unread);
		tts("TERMINATED");
	}else{
		exit();
	}
}

var all = function(result){
	toread_checkins=result['response'].recent;
	tts("TERMINATED");
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});