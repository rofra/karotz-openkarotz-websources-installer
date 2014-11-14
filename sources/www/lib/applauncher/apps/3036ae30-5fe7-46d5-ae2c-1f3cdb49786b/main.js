include("util.js");


var onKarotzConnect = function(data){
	var path = "http://str0.creacast.com:80/magnum";

	karotz.multimedia.play(path, function(event){
		if(event == "TERMINATED"){
			exit();
		}
	});

	karotz.button.addListener(function(event) {
		if(event == "SIMPLE"){
			exit();
		}
	});
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
