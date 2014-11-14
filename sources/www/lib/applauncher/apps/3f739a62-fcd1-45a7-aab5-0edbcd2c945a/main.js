include("util.js");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var random = function(){
	return (Math.floor((Math.random()*169))+1);
}

var onKarotzConnect = function(data){
    var path = "http://la-libellule.fr/karotz/southpark/" + random() + ".MP3" ;
	karotz.led.pulse('FF00FF', 1000, -1);
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});