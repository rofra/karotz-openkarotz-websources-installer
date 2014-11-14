karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var xgits = ["0", "1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
function hexb(x) {
	var msb = 0 + (x >> 4) & 0xF;
	var lsb = 0 + x & 0xF;
	return "" + xgits[msb] + xgits[lsb];
};

function getRandomColor() {
	return  hexb(Math.floor(Math.random() * 256)) +
		hexb(Math.floor(Math.random() * 256)) + 
		hexb(Math.floor(Math.random() * 256));
}