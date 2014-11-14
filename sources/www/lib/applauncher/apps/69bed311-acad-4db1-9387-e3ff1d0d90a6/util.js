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


var SOUND_INTRO = live_url+"sound/ligue1.mp3";
var SOUND_SIFFLET1 = live_url+"sound/sifflet1.mp3";
var SOUND_SIFFLET2 = live_url+"sound/sifflet2.mp3";
var SOUND_SIFFLET3 = live_url+"sound/sifflet3.mp3";
var SOUND_GOAL = "http://www.universal-soundbank.com/mp3/sounds/990.mp3";
var SOUND_RED_CARD = "http://www.universal-soundbank.com/mp3/sounds/920.mp3";
var SOUND_COMMAND = "http://www.universal-soundbank.com/mp3/sounds/10785.mp3";

var COLOR_WAIT = WHITE;
var COLOR_CONNECT = BLUE;
var COLOR_SPEAK = YELLOW;
var COLOR_ERROR = RED;
var COLOR_WARNING = ORANGE;
var COLOR_INTRO = GREEN;

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


function blink(color, period)
{
    karotz.led.light(color);
    karotz.led.pulse(BLACK, period, -1);
}

function parseDate(date)
{
    if (date.length == 19)
    {
        var year = parseInt(date.substring(0, 4));
        var month = parseInt(date.substring(5, 7));
        var day = parseInt(date.substring(8, 10));
        var hour = parseInt(date.substring(11, 13));
        var minute = parseInt(date.substring(14, 16));
        var second = parseInt(date.substring(17, 19));
        
        return new Date(year, month - 1, day, hour, minute, second);
    }
    
    return null;
}


function logNow(text)
{
    var now = new Date();
    log(formatDatetime(now)+" "+text);
}


function formatDatetime(time)
{
    var day = time.getDate()
    var month = time.getMonth() + 1;
    var year = time.getFullYear();
    var hour = time.getHours();
    var minute = time.getMinutes();;
    var second = time.getSeconds();
    
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
}

