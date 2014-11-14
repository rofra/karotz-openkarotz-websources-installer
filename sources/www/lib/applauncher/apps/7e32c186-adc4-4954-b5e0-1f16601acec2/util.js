karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};


String.prototype.replaceAll = function(stringToFind,stringToReplace)
{

    var temp = this;

    var index = temp.indexOf(stringToFind);

    while(index != -1){

        temp = temp.replace(stringToFind,stringToReplace);

        index = temp.indexOf(stringToFind);

    }

    return temp;

}


Array.prototype.contains = function(obj)
{ 
  var i = this.length; 
  while (i--) { 
    if (this[i] == obj) { 
      return true; 
    } 
  } 
  return false; 
} 


function alert(message)
{
    log("ALERT "+message);
}
