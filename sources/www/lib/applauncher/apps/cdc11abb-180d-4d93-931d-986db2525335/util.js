var BLACK       ="000000";
var BLUE        ="0000FF";
var CYAN        ="00FF9F";
var GREEN       ="00FF00";
var ORANGE      ="FFA500";
var PINK        ="FFCFAF";
var PURPLE      ="9F00FF";
var RED         ="FF0000";
var YELLOW      ="75FF00";
var WHITE       ="4FFF68"; 



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


function rgb2hex(r,g,b)
{
    var hexVal = function(n)
    {
        var data = "0123456789ABCDEF";
        if (n==null) return "00";
        n=parseInt(n); 
        if (n==0 || isNaN(n)) return "00";
        n=Math.round(Math.min(Math.max(0,n),255));
        return data.charAt((n-n%16)/16) + data.charAt(n%16);
    }
    return hexVal(0.3 * r)+hexVal(g)+hexVal(0.4 * b);
}
