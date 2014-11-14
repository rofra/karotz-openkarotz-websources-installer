karotz.connectAndStart = function(host, port, callback, data) {	
    try {
        karotz.connect(host, port); log('Connected');
    	karotz.start(callback, data);
    } catch(err) { log(err); }
}

function pause(ms) {
var date = new Date();
var curDate = null;
	do { curDate = new Date(); } while(curDate-date < ms);
}

function trim(s) {
	return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}