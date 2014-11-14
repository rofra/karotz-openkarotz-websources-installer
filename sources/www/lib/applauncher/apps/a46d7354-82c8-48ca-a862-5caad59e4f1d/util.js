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


/**
 * Format time hh:mm to be read correctly by Karotz
 */
function readTime(time)
{
    // Check format
    var regex = new RegExp("([0-2][0-9]):([0-5][0-9])");
    var result = regex.exec(time);
    if (result != null && result.length == 3)
    {
        var hour = result[1];
        var minute = result[2];
        var shour = "";
        var sminute = "";
        if (hour == "00")
        {
            shour = "minuit"
        }
        else if (hour == "01")
        {
            shour = "une heure"
        }
        else if (hour == "12")
        {
            shour = "midi";
        }
        else if (hour.charAt(0) == '0')
        {
            shour = hour.charAt(1) + " heure"
        }
        else
        {
            shour = hour + " heure";
        }
        
        if (minute == "01")
        {
            sminute = "une";
        }
        else if (minute != "00")
        {
            if (minute.charAt(0) == '0')
            {
                sminute = minute.charAt(1);
            }
            else
            {
                sminute = minute;
            }
        }
        
        if (sminute != "")
        {
            return shour+" "+sminute;
        }
        else
        {
            return shour;
        }
    }
    
    return time;
}


function testReadTime()
{
    var times = [ "00:00", "00:01", "01:01", "07:07", "12:12", "15:00", "23:59", "24:89" ];
    var time;
    var stime;
    
    var n = times.length;
    for (var i=0 ; i<n ; i++)
    {
        time = times[i];
        stime = readTime(time);
        log(time+" => "+stime);
    }
    
}
