(function() {
  var exports, led;
  exports = this;
  led = {};
  led.idle = function() {
    log("led.idle");
    if (!isConnected) return false;
        
    karotz.led.fade("0000FF", 300, function(event){
        if(event=="TERMINATED")
            karotz.led.pulse("00FFFF", 1000, -1);
    });
    return true
  };
  led.work = function() {
    log("led.work");
    if (!isConnected) return false;
    
    karotz.led.light("000000");
    karotz.led.pulse("4444FF", 300, -1);
    return true
  };
  led.waitUser = function() {
    log("led.waitUser");
    if (!isConnected) return false;
        
    karotz.led.light("4444FF");
    return true
  };
  led.readTwitter = function() {
    log("led.readTwitter");
    if (!isConnected) return false;
        
    karotz.led.light("00FFFF");
    return true
  };
  led.readFacebook = function() {
    log("led.readFacebook");
    if (!isConnected) return false;
        
    karotz.led.light("0000FF");
    return true
  };
  exports.led = led;
}).call(this);
