include("util.js");
var karotz_ip = "localhost"; // ip do coelho
var random = function(){
	return (Math.floor((Math.random()*1000)) % 35 +10);
}
// COLORS OF LEDS
var light = new Array("FF0000", "00FF00", "FFA500");
var color = 0;
var buttonListener = function(event) {
	if (event == "SIMPLE") exit();
	if (event == "DOUBLE") exit();
    return true;
}
var go_light = function() {
    color += 1; if (color == 3) color = 0;
    karotz.led.fade(light[color], 2000, function(event) {
        if ((event == 'CANCELLED') || (event == 'TERMINATED')) {
        go_light();
        }
    });
}
var onKarotzConnect = function(data){
	var path = "http://www.digas.net/contos/ContodeDia20120" + random() + "_64.mp3";
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
    karotz.led.light(light[color]);
    go_light();
		if( event == "TERMINATED"){
			MyLogErase();
			MyLog("Passou no final do evento");
			exit();
		}
	});
}
karotz.connectAndStart( karotz_ip , 9123, onKarotzConnect, {});
