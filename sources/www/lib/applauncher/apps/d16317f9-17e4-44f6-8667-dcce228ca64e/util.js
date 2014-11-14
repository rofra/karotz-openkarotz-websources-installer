karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var debuglog = function(string) {
	if(debug){
	/*	var d = new Date();
		var hh = "" + d.getHours();
		var mm = d.getMinutes();
		if (mm < 10) {
			mm = "0" + mm;
		}
		var ss = d.getSeconds();
		if (ss < 10) {
			ss = "0" + ss;
		}
		date = hh + 'h' + mm + ":"+ ss +" : ";
		string = string.replace(/[ÈÉÊËèéêë]/g,"e");
		string = string.replace(/[à]/g,"a");		
		if (karotz_ip == 'localhost') {
			karotz.serial.write(date + string + '\n\r');
		}
		else*/
			log(date + string);
	}
};