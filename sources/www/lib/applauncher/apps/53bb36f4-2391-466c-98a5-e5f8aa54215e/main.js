karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var buttonListener = function(event)
{
    log("in buttonListener");
    if (event == "DOUBLE")
    {
        // quit, whatever we're doing
        karotz.tts.stop();
        exit();
    }
    return true;
}

var onKarotzConnect = function(data){
    log("add buttonListener");
    karotz.button.addListener(buttonListener);
    
    log("connected to Karotz");
    setTimeout(500, function(){
        var path = "http://dev1.karotz.com/test/classe/" + (Math.floor(Math.random()*18)) + ".mp3";
        log(path);
        karotz.multimedia.play(path ,function(event){if(event == "TERMINATED")exit();});
    });
    
    
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});

