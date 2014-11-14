include("util.js");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
	exit();
    }
    return true;
}

var random = function(){
	return (Math.floor((Math.random()*302))+1);
}

var onKarotzConnect = function(data){
    var path = "http://internet-des-objets.info/randomsounds/" + random() + ".mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path, function(event){
        if(event == "TERMINATED"){
			exit();
        }
	});
}
 
karotz.connectAndStart("localhost" ,9123, onKarotzConnect, {});