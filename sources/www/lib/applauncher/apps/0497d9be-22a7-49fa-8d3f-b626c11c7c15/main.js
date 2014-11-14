include("util.js");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var onKarotzConnect = function(data){
	karotz.led.light('00FF00');
	karotz.led.pulse('FF0000', 2000, -1);
    var path = "http://internet-des-objets.info/karotz/pn/message.mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});