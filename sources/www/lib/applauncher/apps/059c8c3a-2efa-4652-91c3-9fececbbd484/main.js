include("util.js");

var karotz_ip = "localhost";
var grammar_language = "fr-FR";
var isPause = false;

var pause = true;

var ASRListener = function(asrResult) {
	karotz.led.light("0000FF");
	var found = true;
	var radio = "";
	switch (asrResult.text + "") {
	case "Fun":
		radio = "http://streaming.radio.funradio.fr:80/fun-1-44-128?.wma";
		break;
	case "NRJ":
		radio = "http://mp3.live.tv-radio.com/nrj/all/nrj_113225.mp3 ";
		break;
	case "FG":
		radio = "http://fg.impek.com:80";
		break;
	case "Skyrock":
		radio = "http://95.81.146.6/4603/sky_120728.mp3"; // "http://player.skyrock.fr/V4/skyrock/skyrock.m3u";
		break;
	case "RTL2":
		radio = "http://streaming.radio.rtl2.fr:80/rtl2-1-44-96?.wma";
		break;
	default:
		found = false;
		karotz.led.light("FF0000");
		karotz.tts.start("Quelle radio ecouter ?", "FR", ttsListener);
		break;
	}
	if (found) {
		karotz.led.light("00FF00");
		karotz.tts.start("Lecture de " + asrResult.text, "FR", function(event) {
			if ((event == "TERMINATED") || (event == "CANCELLED"))
				play(radio);
		});
	}
}

var play = function(radio) {
	karotz.multimedia.play(radio);
}

var ttsListener = function(event) {
	if (event == "TERMINATED") {
		karotz.led.light("FFA500");
		grammar = "Fun | FG | NRJ | Skyrock | RTL2";
		karotz.asr.string(grammar, grammar_language, ASRListener);
	}
	return true;
}

var awake = function(event) {
	ping();
	setTimeout(600000, function() {
		awake();
		return true;
	});

}

var buttonListener = function(event) {
	if (event == "DOUBLE") {
		karotz.multimedia.stop();
		exit();
	}
	if (event == "SIMPLE") {
		if (isPause == false) {
			karotz.multimedia.pause();
			karotz.led.pulse("000000", 500, -1);
			isPause = true;
		} else {
			karotz.multimedia.resume();
			karotz.led.light("00FF00");
			isPause = false;
		}
	}
	if (event == "LONG_START") {
		karotz.multimedia.stop();
		isPause = false;
		karotz.tts.start("Quelle radio ecouter ?", "FR", ttsListener);
	}
	return true;
}

var onKarotzConnect = function(data){ 
  karotz.button.addListener(buttonListener);
  awake();
  karotz.tts.start("Quelle radio ecouter", "FR", ttsListener);
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});