include("util.js");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var onKarotzConnect = function(data){
	karotz.led.pulse('FF00FF', 1500, -1);
    var path = "http://internet-des-objets.info/karotz/brutal/hard_wake-up.mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});