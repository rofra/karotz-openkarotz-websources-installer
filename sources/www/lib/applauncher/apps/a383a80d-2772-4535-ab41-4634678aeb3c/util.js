karotz.connectAndStart = function(host, port, callback, data){
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var waitTerminated = function(event){
	log("Event "+ event);
	if (event == "TERMINATED" || event == "CANCELLED"){
		return true;
    }else if (event == "ERROR"){
    	log("Erreur : fermeture de l'application");
    	exit();
    }
	return false;
};