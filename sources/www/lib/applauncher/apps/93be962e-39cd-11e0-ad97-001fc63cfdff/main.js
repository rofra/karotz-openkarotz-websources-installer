include("util.js");
include("data.js");

var cmdline_split;
var spirit_found = 0;

var gramType="";
var gramList="";
var gram="";

var restGenListCount = 0;
var artistList;
var folderList
var genreList;
var playlistList;
var songList;

var lastPlayerCmd = "";
var playerStatus = "stop";
var randomPlay = false;
var runningAsr = false;
var enableTimeout = false;
var repeat = false;

var duration = 0;

var correspSemantic = new Array();

var regSuppr=new RegExp("[/()-*?!,;:.'\"`&|]", "g");

log("Karotz player: START");    

var castCmdLine = function(){
	log("cmdline : " + cmdline);                                     
                              
	var reg=new RegExp(" ", "g");                                        
	cmdline_split=cmdline.split(reg);                                                                                      
}

var setLedIdle = function()
{
    karotz.led.light("0000FF");
}
 
var setLedPlay = function()
{
    karotz.led.light("000000");
    karotz.led.pulse("0000FF", 800, -1);
}

var setLedPause = function()
{
    karotz.led.light("000000");
    karotz.led.pulse("0000FF", 400, -1);
}

var setLedRfid = function()
{
    karotz.led.pulse( "FFA500", 100, 500);
}

var asrTimeout = function()
{
    log("asrTimeout ########");
    if(enableTimeout) runningAsr = false;
    return false;
}

var buttonListener = function(event)
{
    log("############################################");
    log("buttonListener : " + event);

    if(runningAsr == true)
    {
	return true;
    }

    if(event == "LONG_START")
    {
        log("gram : " + gram);
        karotz.multimedia.pause();
        setLedIdle();
        runningAsr = true;
        karotz.asr.string(gram, lang,  asrCallback);
        enableTimeout = true;
        setTimeout(14000, asrTimeout);
    }
    else if(event == "DOUBLE")
    {
        //QUIT
        karotz.multimedia.play("lock::yes");
	    karotz.multimedia.stop(exit);
    }
    else if(event == "SIMPLE")
    {
       togglePause(); 
    }
    return true;
}

var togglePause = function()
{
        if(playerStatus == "pause")
        {
    	    karotz.multimedia.resume();
        }
        else if (playerStatus == "play")
        {
    	    karotz.multimedia.pause();
        }
        else if (playerStatus == "stop")
        {
	    if(lastPlayerCmd == "") return;
    	    karotz.multimedia.play(lastPlayerCmd);
        }
}

var ttsCallback = function(event)
{
    if(event == "TERMINATED")
    {
	    runningAsr = false;
	    enableTimeout = false;
	    return false;
    }
    return true;
}

var toggleRandom = function(tts)
{
        if(randomPlay)
        {
    	    karotz.multimedia.play("mode::normal");
            randomPlay = false;
            if(tts)
            {
                karotz.tts.start(aleatoireOff, lang, ttsCallback);
            }
        }
        else
        {
    	    karotz.multimedia.play("mode::random");
            randomPlay = true;
            if(tts)
            {
                karotz.tts.start(aleatoireOn, lang, ttsCallback);
            }
        }
}

var toggleRepeat = function(tts)
{
        if(repeat)
        {
    	    karotz.multimedia.play("mode::norepeat");
            repeat = false;
            if(tts)
            {
                karotz.tts.start(repeatOff, lang, ttsCallback);
            }
        }
        else
        {
    	    karotz.multimedia.play("mode::repeat");
            repeat = true;
            if(tts)
            {
                karotz.tts.start(repeatOn, lang, ttsCallback);
            }
        }
}

var multimediaListener = function(action)
{
    log("multi callback. action : " + action);

    switch (action)
    {
        case "PLAY":
            setLedPlay();
            playerStatus = "play";
            break;
        case "PAUSE":
            if(runningAsr == false) setLedPause();
            playerStatus = "pause";
            break;
        case "STOP":
            setLedIdle();
            playerStatus = "stop";
            break;
        case "MUSIC_UPDATE":
            log("multi MUSIC_UPDATE");
	    updateLocalDB();
            break;
        default:
            break;
    }

    return true;
}

var addVocalCmd = function()
{
    gramType += phrases["play"] + " {$.type='allsong'; $.param=''}";
    gramType += " | " + phrases["random"] + " {$.type='asrVocalCmd'; $.param='random'}";
    gramType += " | " + phrases["repeat"] + " {$.type='asrVocalCmd'; $.param='repeat'}";
    gramType += " | " + phrases["next"] + " {$.type='asrVocalCmd'; $.param='next'}";
    gramType += " | " + phrases["previous"] + " {$.type='asrVocalCmd'; $.param='previous'}";
}

var addListToGram = function(type, typeSemantic, list)
{
    var tmpParam = "";
    var precedent = 0;
    if(list == undefined)
    {
    	log("undefined");
    	return;
    }
    if((list.length < 2) && (list[0].length < 1))
    {
    	log("list < 2 && list[0].length < 1");
    	return;
    }
    
    if(gramType.length > 10)
    {
    	gramType += " | ";
    }

    gramType += type + " {$.type='" + typeSemantic + "'} ";
    gramType += "$param_" + type + " {$.param=$param_" + type + "}";
    
    tmpParam += "$param_" + type + " = ";
    var listReplace = "";
    for (var i=0; i<list.length; i++) {
        if(list[i].length > 0)
        {
            if(precedent>0)
            {
                tmpParam += " | ";
            }
    
            log("list[i] before : " + list[i]);
            listReplace = list[i].replace("&", phrases["and"]).replace("+", phrases["plus"]).replace("[", "").replace("]", "").replace(regSuppr, "");
            log("listReplace    : " + listReplace);
            correspSemantic[listReplace] = list[i];
            tmpParam += listReplace + " {$.text='" + listReplace + "'}"; // + "';$.index=" + i + ";}";
            precedent++;
        }
    }
    if(gramList.length > 0)
    {
        gramList += ";\r\n";
    }
    gramList += tmpParam;
    log("tmpParam:: " + tmpParam);
    log("gramList:: " + gramList);
    log("gramType:: " + gramType);
}

var genGram = function()
{
    var precedent = 0;
    log("genGram");
    addVocalCmd();
    log("addVocalCmd done");
    if( typeof(artistList) != undefined )
    {
	addListToGram(phrases["artist"], "artist", artistList);    	
    }
    log("artist done");
    if( typeof(genreList) != undefined )              
    {                                                  
        addListToGram(phrases["genre"], "genre", genreList);
    }
    log("genre done");
    if( typeof(folderList) != undefined )              
    {                                                  
        addListToGram(phrases["folder"], "dir", folderList);
    }
    log("folder done");
    
    if( typeof(playlistList) != undefined )              
    {                                                  
        addListToGram(phrases["playlist"], "playlist", playlistList);
    }
    log("playlist done");
    
    if( typeof(songList) != undefined )              
    {                                                  
        addListToGram(phrases["title"], "title", songList);
    }
    log("song done");

    gram += gramType;
    if(gramList.length > 0)
    {
        gram += ";\r\n";

        gramList += "\r\n";
        gram += gramList;
    }

    log("gram : " + gram);
}

var castList = function(list){
	var reg=new RegExp(":", "g");
	list_split=list.split(reg);
	return list_split;
}

var startPlayAllSong = function()
{
    karotz.multimedia.play("allsong::");
    lastPlayerCmd = "allsong::";
}

var genListCheck = function()
{
    if(restGenListCount != 0)                                                                            
    {                                                                                                    
        log("genListCheck : list gen not finished");
        return true;                                                                               
    }
    else
    {
        log("genListCheck : list gen finished");
    	genGram();

        setLedIdle();
        startPlayAllSong();        
	    return false;    
    }
}

var artistListCallback = function(list){
    log("artistListCallback");
    artistList = castList(list);
    restGenListCount--;
}
var folderListCallback = function(list){
    log("folderListCallback");
    folderList = castList(list);
    restGenListCount--;
}
var genreListCallback = function(list){
    log("genreListCallback");
    genreList = castList(list);
    restGenListCount--;
}

var playlistListCallback = function(list){
    log("playlistListCallback");
    playlistList = castList(list);
    restGenListCount--;
}

var songListCallback = function(list){
    log("songListCallback");
    songList = castList(list);
    restGenListCount--;
}

var asrCallback = function(asrResult){
    log("asrCallback");
	
    setLedIdle();
    if(asrResult.confident > 20)
    {
        log("asrCallback text: " + asrResult.text);
	    log("asrCallback confident: " + asrResult.confident);
	    log("asrCallback semantic type: " + asrResult.semantic.type);
    	log("asrCallback semantic param.text!!: " + asrResult.semantic.param.text);
	
        if(asrResult.semantic.type == "asrVocalCmd")
        {
            switch (asrResult.semantic.param)
            {
                case "random":
                    toggleRandom(true);           
                    break;
                case "repeat":
                    toggleRepeat(true);            
                    break;
                case "next":
                    karotz.multimedia.next();
                    break;
                case "previous":
                    karotz.multimedia.previous();
                    break;
                default:
                    break;
            }
        }
        else
        {
            var cmdPlay = asrResult.semantic.type + "::";
            if(asrResult.semantic.param.text != undefined)
            {
		        log("asrCallback semantic typeof != undefined");
                var tmpTxt = asrResult.semantic.param.text;
		        log("asrCallback tmpTxt : " + tmpTxt);
		        log("asrCallback correspSemantic[tmpTxt] : " + correspSemantic[tmpTxt]);

                cmdPlay += correspSemantic[tmpTxt];
            }
 	        if(asrResult.semantic.param.text != "undefined")
            {
  	 	        log("asrCallback semantic != undefined");
            }
	        log("asrCallback semantic multi: " + cmdPlay);
	        karotz.multimedia.stop();
            karotz.multimedia.play(cmdPlay);
            lastPlayerCmd = cmdPlay;
        }

	    runningAsr = false;
	    enableTimeout = false;
    }
    else
    {
        log("asrCallback UNKNOWN");
        karotz.tts.start(pasCompris, lang, ttsCallback);
        setLedIdle();
    }
}

var ledCallback = function(data)
{
    log("led callback");
}

var updateLocalDB = function(data)
{
    karotz.led.light("00FFFF");   
    karotz.led.pulse("0000FF", 800, -1);
    gramType="";
    gramList="";
    gram="";
    restGenListCount = 5;
    karotz.multimedia.artist(artistListCallback);
    karotz.multimedia.folder(folderListCallback);
    karotz.multimedia.playlist(playlistListCallback);
    karotz.multimedia.genre(genreListCallback);
    karotz.multimedia.song(songListCallback);
    setTimeout(500, genListCheck);
}

var onKarotzConnect = function(data){
    karotz.button.addListener(buttonListener);
    karotz.multimedia.addListener(multimediaListener);

    updateLocalDB();

    karotz.multimedia.play("lock::no");

    setTimeout(60000, function(){ log("ping"); ping(); return true; });

    if(duration > 0)
    {
        setTimeout(duration * 60000,  function(){ log("exit"); exit(); return false; });
    }
}

//duration = params[instanceName].duration;
log("duration : " + duration);

var data = {};
karotz.connectAndStart(host, port, onKarotzConnect, data);
