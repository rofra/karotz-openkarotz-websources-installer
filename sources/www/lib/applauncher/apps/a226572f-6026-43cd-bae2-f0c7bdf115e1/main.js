include("util.js");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var random = function(){
	return Math.round(Math.random()*100);
}

var onKarotzConnect = function(data){
    var path = "http://internet-des-objets.info/karotz/germaine/" + random() + ".mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.led.pulse('FF00FF', 1000, -1);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});