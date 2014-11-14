include("util.js");

var karotz_ip = "localhost";
//var karotz_ip = "192.168.1.34";

var usbStick = "/mnt/usbkey/";

var bRandom = "Y";
var bRepeat = "N";
var bTimeout = "";

var color = "0000FF";

var pauseAudio = false;

var buttonListener = function(event) {
	// “SIMPLE” ; “DOUBLE”, “TRIPLE”, “MULTIPLE”; “LONG_START”; “LONG_STOP”;
	log("buttonListener: " + event);
	if (event == "DOUBLE") {
		karotz.multimedia.stop(); 
	    exit();
	}
	else if ((event == "SIMPLE")&& (!pauseAudio)) { 
        pauseAudio = true;
        karotz.led.pulse("000000" , 1000, -1);
        karotz.multimedia.pause(); 
	} 
	else if ((event == "SIMPLE")&& (pauseAudio)) { 
        karotz.led.light(color);
		karotz.multimedia.resume();
		pauseAudio = false; 
	}
	return true;
};

var earsListener = function(event, step, length) {
	log("earsListener (event/step/length): " + event + "/" + step + "/" + length);
	if (event == "START_LEFT"){
		karotz.multimedia.next(noEvent);	
	}
	else if (event == "START_RIGHT"){
		karotz.multimedia.previous(noEvent);
	}
	else { // "STOP_LEFT"; "STOP_RIGHT"; "BLOCKED_LEFT"; "BLOCKED_RIGHT";
		return true;
	}
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
var waitPlay = function(event) {
	log("waitEnd: " + event);
	if ((event == "CANCELLED") ||
		(event == "TERMINATED")) {
		karotz.multimedia.stop(); 
	    exit();
		return true;
	} else if ((event == "ERROR")) {
		karotz.tts.start("erreur !!!", "fr", exitAtEnd);
	}
	setTimeout(10, aef);
	return true;
};

var step = 0;

var timeout = 0;
var timeoutCounter = 0;

function aef() {

	if ((step % 20) == 0) {
		if (!pauseAudio) {
			color = getRandomColor();
			karotz.led.fade(color, 10000);
		}
		else {
//			karotz.ping();
		}
	}

	switch (step) {

	case 0:
		step++;
		karotz.multimedia.play("lock::no");
		//break;

	case 1:
		step++;
		var random = (bRandom == "Y") ? "random" : "normal";
		karotz.multimedia.play("mode::" + random);
		//break;

	case 2:
		step++;
		var repeat = (bRepeat == "Y") ? "repeat" : "norepeat";
		karotz.multimedia.play("mode::" + repeat);
		//break;

	case 3:
		step++;
		karotz.multimedia.play("allsong::", waitPlay);
		break;

	case 4:
		step++;
		if (timeout > 0) {
			timeoutCounter = timeout;
		}
	case 5:
		if (timeout > 0) {
			if (timeoutCounter > 0) {
				timeoutCounter--;
				setTimeout(1000, aef);
				break;
			}
			else {
				karotz.multimedia.stop(); 
			    exit();
			}
		}

	default:
		step++;
		setTimeout(1000, aef);
	}
}


var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);
	
	try {
		bRandom = params[instanceName].brandom;
	} catch (Exception) {
		if (bRandom == "") {
			karotz.tts.start("Erreur paramaitre random.", "fr", exitAtEnd);
			return;
		}
	}

	try {
		bRepeat = params[instanceName].brepeat;
	} catch (Exception) {
		if (bRepeat == "") {
			karotz.tts.start("Erreur paramaitre repeat.", "fr", exitAtEnd);
			return;
		}
	}

	try {
		bTimeout = params[instanceName].timeout;
	} catch (Exception) {
	}
	try {
		if (bTimeout != "") {
			timeout = parseInt(bTimeout);
		}
	} catch (Exception) {
		karotz.tts.start("Erreur paramaitre durer.", "fr", exitAtEnd);
		return;
	}

	aef();
};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
