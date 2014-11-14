include("util.js");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var onKarotzConnect = function(data){
    var path = "http://internet-des-objets.info/karotz/calendrier/audio.mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.led.light('00FF00');
	karotz.led.pulse('FF0000', 4000, -1);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});