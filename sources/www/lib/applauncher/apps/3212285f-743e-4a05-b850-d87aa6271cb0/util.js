karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(karotz_ip, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

