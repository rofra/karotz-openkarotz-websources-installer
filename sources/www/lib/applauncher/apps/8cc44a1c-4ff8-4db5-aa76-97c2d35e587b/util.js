karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

speak = function(id, realName){
	var parkingsAsFile= file.read("parkings.json");
	var parkingsAsString = parkingsAsFile.text;
  	
  	if(parkingsAsString==null) {return realName;}
		
    var json = JSON.parse(parkingsAsString);
    	
    for (var i = 0; i < json.data.length; i++) {
       	if(json.data[i].id==id) {
       		log("speak="+json.data[i].speak + " / realName=" + realName);
    		return json.data[i].speak;
    	}
    }
    	  	
	return realName;
};





       