karotz.connectAndStart = function(host, port, callback, data) {	
    try {
        karotz.connect(host, port); log('Connected.');
    	karotz.start(callback, data);
    } catch(err) { log(err); }
}