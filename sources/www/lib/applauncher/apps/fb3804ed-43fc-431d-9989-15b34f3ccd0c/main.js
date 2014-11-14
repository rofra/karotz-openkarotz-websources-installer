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
	karotz.led.pulse('ff00ff', 1000, -1);
    var path = "http://streaming201.radionomy.com:80/Ambiance-Groove" ;
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});