include("util.js");

var karotz_ip = "localhost";
//var karotz_ip = "192.168.1.33";

var DAYS = new Array("dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi");
var MONTHS = new Array("janvier","faivrier","mars","avril","mai","juin","juillet","ou-t","septembre","octobre","novembre","daicembre");

var bName = "";
var bDate = "";
var sexe = "";
var optSayAge = "";
var optHappyBirthday = "";


/*
var bName = "Sophie";
var bDate = "14/05/1981";
var sexe = "F";
var optSayAge = "Y";
var optHappyBirthday = "N";
*/

var hasAge = false;
var ageYears = 0;
var ageDays = 0;
var days = 0;

var step = 0;

var buttonListener = function(event) {
	// “SIMPLE”; “DOUBLE”, “TRIPLE”, “MULTIPLE”; “LONG_START”; “LONG_STOP”;
	log("buttonListener: " + event);
	if (event == "DOUBLE") {
		exit();
	}
	else if (event == "SIMPLE") {
	}
	return true;
};

var earsListener = function(event, step, length) {
	// "START_LEFT"; "START_RIGHT"; "STOP_LEFT"; "STOP_RIGHT"; "BLOCKED_LEFT"; "BLOCKED_RIGHT"
	log("earsListener (event/step/length): " + event + "/" + step + "/" + length);
	return true;
};

var noEvent = function(event) {
	return true;
};
var exitAtEnd = function(event) {
	if ((event == "CANCELLED") || (event == "TERMINATED")) {
		exit();
	}
	return true;
};
var waitStart = function(event) {
	log("waitStart: " + event);
	if (event == "ERROR") {
		karotz.tts.start("erreur !!!", "fr", exitAtEnd);
	}
	setTimeout(10, aef);
	return true;
};
var waitEnd = function(event) {
	log("waitEnd: " + event);
	if ((event == "CANCELLED") ||
		(event == "TERMINATED")) {
		setTimeout(10, aef);
	} else if ((event == "ERROR")) {
		karotz.tts.start("erreur !!!", "fr", exitAtEnd);
	}
	return true;
};

function sayDays() {
	if (days > 31) {
		return "dans " + Math.round(days/30) + " mois ";
	}
	else {
		if (days > 2) {
			return "dans " + days + " jours ";
		}
		else if (days > 1) {
			return "aprai demain ";
	}
		else if (days > 0) {
			return "demain ";
	}
		else {
			return "aujourd'hui ";
		}
	}
}

function sayAge() {
	var years = ageYears;
	var days = ageDays;
	
	if (days < 0) {
		years--;
		days += 365;
	}
		
	var s = "" + years + " ans";
	
	if (days > 31) {
		return s + " et " + Math.floor(days/30) + " mois";
	}
	
	if (days > 0) {
		return s + " et " + days + " jours";
	}

	return s + ".";
}

function sayFullDate(xdate) {
	var day = DAYS[xdate.getDay()];
	var monthday = xdate.getDate();
	var month = MONTHS[xdate.getMonth()];
	var year = xdate.getFullYear();
	
	if (monthday == 1)
		monthday = "premier";
	
	return day + " " + monthday + " " + month + ", de l'an " + year;
}
function sayMediumDate(xdate) {
	var day = DAYS[xdate.getDay()];
	var monthday = xdate.getDate();
	var month = MONTHS[xdate.getMonth()];
	
	if (monthday == 1)
		monthday = "premier";

	return day + " " + monthday + " " + month;
}
function sayShortDate(xdate) {
	var monthday = xdate.getDate();
	var month = MONTHS[xdate.getMonth()];
	
	if (monthday == 1)
		monthday = "premier";

	return  monthday + " " + month;
}

function isBorn() {
	return ageYears*365.25 + ageDays >= 0;
}

function aef() {

	var pron = "";
	if (sexe != "M") {
		pron = "elle";
	}
	else {
		pron = "il";
	}

	switch (step) {
	case 1:
		step++;
		//karotz.multimedia.play("http://downloads.bbc.co.uk/doctorwho/sounds/dalekchorus.mp3", waitEnd);
		//karotz.multimedia.play("http://downloads.bbc.co.uk/doctorwho/s2/s2_12/audio/s2_12_aud_01.mp3?playlist=/doctorwho/playlists/s2_12/audio/s2_12_aud_01.xml&audio=1&date=&summary=Dalek&promo=/doctorwho/medialibrary/s2/images/main-promo/s2_12_aud_01.jpg&info=&info2=&info3=&tag_file_id=s2_12_aud_01", waitEnd);
		karotz.ears.move(5,0,noEvent);
		karotz.led.light("FFAFAF", noEvent);
		if (optHappyBirthday == "Y") {
			try {
				karotz.multimedia.play("http://www.universal-soundbank.com/mp3/sounds/2754.mp3", noEvent);
			} catch(Exception) {}
			setTimeout(4200, aef);
		}
		else {
			setTimeout(10, aef);
		}
		break;

	case 2:
		step++;
		if (optHappyBirthday == "Y") {
			try {
				karotz.multimedia.stop(noEvent);
			} catch(Exception) {}
		}
		karotz.led.fade("00FF00", 10000, noEvent);
		setTimeout(1500, aef);
		break;

	case 3:
		step++;
		karotz.tts.start(" " + sayDays() + ": c'est l'anniversaire de " + bName + ".", "fr", waitEnd);
		break;

	case 4:
		step++;
		if (hasAge) {
			if (optSayAge == "Y") {
				karotz.tts.start(" " + pron + " est nai_, le " + sayFullDate(bDate) + ".", "fr", waitEnd);
			}
			else {
				karotz.tts.start(" " + pron + " est nai_, un " + sayMediumDate(bDate) + ".", "fr", waitEnd);
			}
		}
		else {
			karotz.tts.start(" " + pron + " est nai_, un " + sayShortDate(bDate) + ".", "fr", waitEnd);
		}
		break;

	case 5:
		step++;
		
		if (!isBorn()) {
			step = 20;
			setTimeout(10, aef);
		}
		else if (optSayAge == "Y") {
			if (hasAge) {
				karotz.tts.start(" " + pron + " a " + sayAge() + ".", "fr", waitEnd);
			} 
			else {
				setTimeout(10, aef);
			}
		}
		else {
			if (sexe != "M") {
				if (ageYears >= 25) {
					karotz.tts.start(" elle va sur ses 25 ans.", "fr", waitEnd);
				} 
				else {
					karotz.tts.start(" elle n'ose pas dire son age.", "fr", waitEnd);
				}
			}
			else {
				karotz.tts.start(" il est coquet, il ne veut pas dire son age.", "fr", waitEnd);
			}
		}
		break;

	case 6:
		exit();
		break;

	default:
		step++;
		setTimeout(10, aef);
	}
}

function computeDeltaDays(x, y) {
	var d = new Date(x.getTime());
	d.setFullYear(x.getFullYear(), y.getMonth(), y.getDate());
	
	var dms = d.getTime() - x.getTime();
	var days = Math.floor(dms / 1000 / 3600 / 24);

	return days;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	try {
		bName = params[instanceName].bname;
	} catch (Exception) {
		if (bName == "") {
			karotz.tts.start("Erreur paramaitre nom.", "fr", exitAtEnd);
			return;
		}
	}

	try {
		bDate = params[instanceName].bdate;
	} catch (Exception) {
		if (bDate == "") {
			karotz.tts.start("Erreur paramaitre date.", "fr", exitAtEnd);
			return;
		}
	}

	try {
		sexe = params[instanceName].sexe;
	} catch (Exception) {
		if (sexe == "") {
			karotz.tts.start("Erreur paramaitre sexe.", "fr", exitAtEnd);
			return;
		}
	}

	try {
		optSayAge = params[instanceName].sayAge;
	} catch (Exception) {
		if (optSayAge == "") {
			karotz.tts.start("Erreur paramaitre dire age.", "fr", exitAtEnd);
			return;
		}
	}

	try {
		optHappyBirthday = params[instanceName].happyBirthday;
	} catch (Exception) {
		if (optHappyBirthday == "") {
			karotz.tts.start("Erreur paramaitre Happy Birthday.", "fr", exitAtEnd);
			return;
		}
	}

	var iyear = 0;
	try {
		var xdate = bDate.split("/");
		if (xdate.length < 2) {
			karotz.tts.start("La date doit contenir au moins un jour et un mois.", "fr", exitAtEnd);
			return;
		}
		if (xdate.length > 2) {
			hasAge = true;
			iyear = xdate[2];
			if (iyear < 1) {
				karotz.tts.start("L'année doit être supérieure à 0.", "fr", exitAtEnd);
				return;
			}
			bDate = new Date();
			bDate.setFullYear(iyear, xdate[1]-1, xdate[0]);
		}
		else {
			bDate = new Date(2000, xdate[1]-1, xdate[0]);
		}
		
		log("bDate=" + bDate);
		if (bDate.toString() == "Invalid Date") {
			throw new Exception();
		}
		
	} catch (Exception) {
		karotz.tts.start("La date n'est pas valide.", "fr", exitAtEnd);
		return;
	}
	
	var today = new Date();
	today.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
	
	days = computeDeltaDays(today, bDate);
	if (days < 0) {
		days += 365;
	}

	if (iyear > 0) {
		var d1 = new Date();
		d1.setFullYear(bDate.getFullYear(), today.getMonth(), today.getDate());
		var d2 = new Date();
		d2.setFullYear(bDate.getFullYear(), bDate.getMonth(), bDate.getDate());
	
		ageYears = today.getFullYear() - iyear;
		ageDays = computeDeltaDays(d2, d1);
	}
	
	log("iyear = " + iyear);
	log("days = " + days);
	log("ageYears = " + ageYears);
	log("ageDays = " + ageDays);
	
	aef();
};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
