var isConnected = false

JSON.save = function (key, value) {
  var jsonText = JSON.stringify(value);
  file.write(key + ".js", jsonText);
}

JSON.load = function (key) {
  var filename = key + ".js";
  
  log("loading resource: " + filename);
  var rs = file.read(filename);
  
  log("resource content: " + rs.text);
  return eval('(' + rs.text + ')');
}

if (typeof (karotz.start2) == 'undefined') {
    log("redefinie karotz.start2")
    karotz.start2 = function(callback,data){
        isConnected = true; karotz.start(callback, data); 
    }
}

karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
        if (launchType.name == 'SCHEDULER')
            social.init(function(tmp){
            setTimeout(200, function(){ callback(); });
            }, {});
        else
            social.init(function(tmp){
            karotz.start2(callback, data);
            //setTimeout(200, function(){ isConnected = true; karotz.start(callback, data); });
            }, {});
        //karotz.start(callback, data); 
    	log("connected");
    }catch(err){
    	log(err);
    }
};
