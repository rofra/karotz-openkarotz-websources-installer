include("util.js");
var karotz_ip = "localhost"; 
var buttonListener = function(event) {
if (event == "TRIPLE") {
karotz.tts.stop();
exit();
}
return true;
}

var monping = function(event) {
karotz.ping();
log("ping");
setTimeout(600000, function() { monping(); return true; });

}


var bougeoreille = function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
monping();
}
return true;

}
var exitFunction = function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
karotz.ears.move(5, 5, bougeoreille);

}
return true;
}

var onKarotzConnect = function(data) {
karotz.button.addListener(buttonListener);
karotz.led.light("000000");
karotz.tts.start("Je vais dormir. Apui troi foi sur mon bouton pour me relancer", "fr", exitFunction);

}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});