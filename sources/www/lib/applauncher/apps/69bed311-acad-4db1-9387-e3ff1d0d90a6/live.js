var id;
var acceptCommand = false;
var processingCommand = false;
var waitingForUpdates = false;

function startLive(sound, footParams)
{
    var live = footParams.live;
    var foot = footParams.filter;
    var terminated = footParams.startupTerminated;
    var playing = footParams.startupPlaying;
    var scheduled = footParams.startupScheduled;
    
    
    log("startLive("+live+","+foot+","+sound+")");
    var url;
    
    if (foot)
    {
        url = live_url+"start.php?foot="+foot;
    }
    else
    {
        url = live_url+"start.php?foot=all";
    }
    
    log("GET "+url);
    
    blink(COLOR_CONNECT, 500);
    
    var data = http.get(url);
    
    if (data)
    {
        log(data);
        var json = JSON.parse(data);
        
        if (json && json.code)
        {
            id = json.code;
            log("Identifiant : "+id);
            
            karotz.button.addListener(function(event){
                if (event == "LONG_START")
                {
                    if (acceptCommand)
                    {
                        processingCommand = true;
                        acceptCommand = false;
                        launchCommandRecognition();
                    }
                    else
                    {
                        log("Command not available");
                    }
                }
                else if (event == "DOUBLE")
                {
                    log("Stop reading");
                    footReader.clear();
                    karotz.tts.stop();
                }
                return true;
            });
            
            if (sound)
            {
                karotz.led.light(COLOR_INTRO);
                karotz.chain.play(SOUND_INTRO).exec(function () {readFootSchedule(id, true, terminated, playing, scheduled, live);});
            }
            else
            {
                readFootSchedule(id, false, terminated, playing, scheduled, live);
            }
        }
        else
        {
            error("Identification impossible");
        }
    }
    else
    {
        error("Connexion impossible");
    }
}


function launchCommandRecognition()
{
    log("Command recognition");
    var lang = "fr-FR";
    var grammar = "score { $='score'} | résultat { $='result'} | programme { $='schedule'}";
    
    karotz.asr.string(grammar, lang, commandCallback);
    
    /*
    karotz.asr.string(grammar, lang, function(asrResult)
    {
        karotz.chain.play(SOUND_COMMAND).exec(function()
        {
            commandCallback(asrResult);
        });
    });
    */
}


function commandCallback(asrResult)
{
    var confident = asrResult.confident; // 0-100 (it’s not a linear variable. more than 30 can be considered as a acceptable result.
    var text = asrResult.text; // recognized text
    var semantic = asrResult.semantic; // contain the semantic interpretation

    log("Command : "+text+" / "+semantic+" ("+confident+"%)");

    if (semantic == "No result before the no-input timeout")
    {
        // Rien n'a été dit pendant l'intervalle
    }
    else if (semantic == "The grammar source compilation failed")
    {
        // La grammaire utilisée n'est pas conforme
        log("ERROR: The grammar source compilation failed");
    }
    else if (text == "<nomatch>" || semantic == "")
    { 
        // Rien de ce qu'il y avait dans la grammaire n'a été entendu

    } 
    else
    {
        switch (semantic)
        {
            case "score":
                readScores();
                return;
            case "result":
                readResults();
                return;
            case "schedule":
                readSchedule();
                return;
        }
    }
    
    processingCommand = false;
    waitForUpdates()
}


function readScores()
{
    readFootScoresPlaying(id);
}


function readResults()
{
    readFootScoresTerminated(id);
}


function readSchedule()
{
    readFootScoresScheduled(id);
}


function waitForUpdates()
{
    blink(COLOR_WAIT, 2000);
    acceptCommand = true;
    if (!waitingForUpdates)
    {
        logNow("Wait for updates");
        waitingForUpdates = true;
        // Wait for 1 minute
        timeout = setTimeout(60000, function()
        {   
            waitingForUpdates = false;
            // Check if update process has been interrupted by command recognition
            if (!processingCommand)
            {
                acceptCommand = false;
                readFootUpdates(id);
            }
        });
    }
    else
    {
        logNow("Ignore new update processing loop");
    }
}




function error(message)
{
    log("ERREUR: "+message);
    karotz.led.light(COLOR_ERROR);
    karotz.tts.start(message, "fr", exitFunction);
}


function MatchCount()
{
   this.total = 0;
   this.terminated = 0;
   this.playing = 0;
   this.scheduled = 0;
   this.read = 0;
}
