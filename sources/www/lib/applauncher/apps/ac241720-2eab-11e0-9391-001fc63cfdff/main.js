appspath = "/usr/karotz/apps/a5f3b9ae-3da7-11e0-9229-001fc63cfdff/"
appspath = "/usr/karotz/apps/ac241720-2eab-11e0-9391-001fc63cfdff/"

include("karotz-chain.js") 
var BLACK = "000000"
var BLUE  = "0000FF"
var CYAN  = "00FF9F"
var GREEN  = "00FF00"
var ORANGE  = "FFA500"
var PINK  = "FFCFAF"
var PURPLE  = "9F00FF"
var RED  = "FF0000"
var YELLOW  = "75FF00"
var WHITE  = "4FFF68"

karotz.connectAndStart = function(host, port, callback, data){  
    try{
        karotz.connect(host, port);
        log("connected");
        karotz.start(callback, data);
    }catch(err){
        log(err);
    }
};

var earsMove = function(){
karotz.ears.moveRelative(16,-16)
}

var ledRed = function(){
karotz.led.light(RED)
karotz.led.pulse("",1500, 7000)
}

var ledGreen = function(){
karotz.led.light(GREEN)
karotz.led.pulse("",1500, 7000)
}

var ledCyan = function(){
karotz.led.light(CYAN)
karotz.led.pulse("",800, 7000)
}

var ledOrange = function(){
karotz.led.light(ORANGE)
karotz.led.pulse("",800, 7000)
}

var ledOrangeFix = function(){
karotz.led.fade(ORANGE,200)

}

var ledGreenFix = function(){
karotz.led.fade(GREEN,200)

}

var ledWhite = function(){
karotz.led.light(WHITE)
}

var ledColor = function(){
karotz.led.fade("FFFF00",800)

}

var onKarotzConnect = function(data){
   log("pop")
   karotz.button.addListener(buttonListener);

karotz.chain.play2("SFX_bonjour").direct(earsMove).play2("3").play2("SFX_Inter").play2("5").play2("SFX_Inter").play2("7").play2("SFX_Inter").play2("9").play2("SFX_Inter").play2("11").play2("SFX_ICanDo").play2("13").play2("SFX_Musicfade").play2("SFX_Inter").direct(earsMove).play2("15").direct(ledColor).play2("16").direct(ledRed).play2("17").play2("SFX_Red_Led").direct(ledGreen).play2("19").play2("SFX_Green_Led").direct(ledCyan).play2("21").play2("SFX_Cyan_Led").direct(ledOrange).play2("23").play2("SFX_Orange_Led").direct(ledWhite).play2("25").play2("SFX_White_Led").direct(ledOrangeFix).play2("28").direct(ledGreen).play2("SFX_Inter").direct(ledWhite).play2("30").play2("SFX_Inter").play2("32").play2("SFX_Photo").play2("38").play2("SFX_Camera").play2("40").play2("SFX_Fin").direct(ledGreen).exec(function(){exit()})

}
if (typeof(my_ip_) == 'undefined') my_ip_ = "localhost"
karotz.connectAndStart(my_ip_, 9123, onKarotzConnect, {});

var buttonListener = function(event)
{
    if(event == "SIMPLE")
    {
       log("STOP")
       karotz.multimedia.stop()
    }
    if(event == "DOUBLE")
    {
       exit();
    }
    return true;
}

