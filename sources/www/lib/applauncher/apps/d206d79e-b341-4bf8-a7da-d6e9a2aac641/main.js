include("util.js");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var onKarotzConnect = function(data){
    var path = "http://internet-des-objets.info/karotz/medicine/medicament.mp3" ;
	karotz.led.light('00FF00');
	karotz.led.pulse('FF0000', 1500, -1);
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});