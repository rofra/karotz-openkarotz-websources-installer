include("util.js");

setTimeout(300000, function(){ log("ping"); ping(); return true; });
var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var onKarotzConnect = function(data){
	karotz.led.pulse('00FFFF', 2000, -1);
    var path = "http://internet-des-objets.info/karotz/podcast/podcast.mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});