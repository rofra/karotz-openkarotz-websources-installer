var footReader;
var currentFootId;


/**
 * Read foot scores (playing matches)
 * @param code to use as identifier with server
 */
function readFootScoresPlaying(code)
{
    var nb = getFootScores(code, footReader, false, true, false, false);
    
    log("Foot scores playing : "+nb);
    
    if (nb.read > 0)
    {
        currentFootId = footReader.readNext(readCallback);
    }
    else
    {
        footReader.clear();
        karotz.led.light(COLOR_WARNING);
        karotz.tts.start("Football : aucun match en cours.", "fr", readCallback);
    }
}


/**
 * Read foot scores (scheduled matches)
 * @param code to use as identifier with server
 */
function readFootScoresScheduled(code)
{
    var nb = getFootScores(code, footReader, false, false, true, false);
    
    if (nb.read > 0)
    {
        currentFootId = footReader.readNext(readCallback);
    }
    else
    {
        footReader.clear();
        karotz.led.light(COLOR_WARNING);
        karotz.tts.start("Football : aucun match à venir.", "fr", readCallback);
    }
}


/**
 * Read foot scores (terminated matches)
 * @param code to use as identifier with server
 */
function readFootScoresTerminated(code)
{
    var nb = getFootScores(code, footReader, true, false, false, false);
    
    if (nb.read > 0)
    {
        currentFootId = footReader.readNext(readCallback);
    }
    else
    {
        footReader.clear();
        karotz.led.light(COLOR_WARNING);
        karotz.tts.start("Football : aucun match terminé.", "fr", readCallback);
    }
}



/**
 * Read foot updates
 * @param code to use as identifier with server
 */
function readFootUpdates(code)
{
    var nb = getFootUpdates(code, footReader);
    if (nb > 0)
    {
        currentFootId = footReader.readNext(readCallback);
    }
    else
    {
        /*
        karotz.tts.start("Aucune mise à jour","fr",function(event){
            if (event == "TERMINATED" || event == "CANCELLED")
            {
                waitForUpdates();
            }
        });
        */

        log("No update -> ping");
        ping();
        waitForUpdates();
    }
}


/**
 * Read foot schedule (playing and incoming matches)
 * @param code to use as identifier with server
 * @param sound whether to play sounds
 * @param terminated whether to include scores of terminated matches
 * @param playing whether to include scores of matches in progress
 * @param scheduled whether to schedule of coming matches
 * @param live whether to start live
 */
function readFootSchedule(code, sound, terminated, playing, scheduled, live)
{
    log("read foot schedule "+code+" / "+sound+" / "+terminated+" / "+playing+" / "+scheduled+" / "+live);
    if (footReader == null)
    {
        log("create new reader");
        footReader = new Reader(WHITE, sound);        
    }
    
    var nb = getFootScores(code, footReader, terminated, playing, scheduled, live);
    log(nb+" matches");
    
    if (live)
    {
        var nbLive = nb.scheduled + nb.playing;
        if (nbLive > 0)
        {
            // Live after schedule
            log("Live after schedule");
            if (nb.read == 0)
            {
                var message = "Football";
                if (nb.playing > 0)
                {
                    message += ", "+nb.playing+" match en cours";
                }
                if (nb.scheduled > 0)
                {
                    message += ", "+nb.scheduled+" match à venir";
                }
                message += ".";
                footReader.add(message, null, COLOR_SPEAK);
            }
            
            currentFootId = footReader.readNext(readCallback);
        }
        else
        {
            karotz.led.light(COLOR_WARNING);
            karotz.tts.start("Football : pas de match aujourd'hui.", "fr", exitFunction);
        }
    }
    else
    {
        if (nb.read > 0)
        {
            // Exit after schedule
            log("Exit after schedule");
            currentFootId = footReader.readNext(readExitCallback);
        }
        else
        {
            karotz.led.light(COLOR_WARNING);
            karotz.tts.start("Football : pas de match aujourd'hui.", "fr", exitFunction);
        }
    }
    
}



/**
 * Add foot score messages to reader
 * @param code to use as identifier with server
 * @param reader
 * @param terminated whether terminated matches shall be read
 * @param playing whether playing matches shall be read
 * @param scheduled whether scheduled matches shall be read
 * @param withCount whether count of matches shall be read
 * @return MatchCount number of matches
 */
function getFootScores(code, reader, terminated, playing, scheduled, withCount)
{
    var result = new MatchCount();
    var url = live_url+"foot.php?id="+code+"&request=scores";
    if (!terminated)
    {
        url += "&terminated=false";
    }
    if (!playing)
    {
        url += "&playing=false";
    }
    if (!scheduled)
    {
        url += "&scheduled=false";
    }
    log("GET "+url);
    blink(COLOR_CONNECT,500);
    var data = http.get(url);
    if (data)
    {
        var json = JSON.parse(data);
        logNow("Scores :");
        log(data);
        
        result.total = json.matches.total;
        result.scheduled = json.matches.scheduled;
        result.playing = json.matches.playing;
        result.terminated = json.matches.terminated;
        
        var message = "";
        
        var nCompetitions = json.competitions.length;
        if (nCompetitions > 0)
        {
            message = "Football"
            if (terminated && json.matches.terminated > 0)
            {
                result.read += json.matches.terminated;
                if (withCount)
                {
                    message += ", "+json.matches.terminated+" match terminé";
                }
            }
            if (playing && json.matches.playing > 0)
            {
                result.read += json.matches.playing;
                if (withCount)
                {
                    message += ", "+json.matches.playing+" match en cours";
                }
            }
            if (scheduled && json.matches.scheduled > 0)
            {
                result.read += json.matches.scheduled;
                if (withCount)
                {
                    message += ", "+json.matches.scheduled+" match à venir";
                }
            }
            message += ".";
            reader.add(message, null, COLOR_SPEAK);
            
            var competition = null;
            message = "";
            var nMatches;

            for (var ic = 0 ; ic < nCompetitions ; ic++)
            {
                competition = json.competitions[ic];

                message = "";
                if (competition.country)
                {
                    message = competition.country+", ";
                }

                message += competition.name+"."

                reader.add(message, competition.id, COLOR_SPEAK);

                nMatches = competition.matches.length;
                for (var im = 0 ; im < nMatches ; im++)
                {
                    addFootScore(competition.matches[im], reader);  
                }
            }
        }        
    }
    
    return result;
}



/**
 * Add foot score messages to reader
 * @param code to use as identifier with server
 * @param reader
 * @return int number of updates
 */
function getFootUpdates(code, reader)
{
    var url = live_url+"foot.php?id="+code+"&request=updates";
    log("GET "+url);
    
    blink(COLOR_CONNECT,500);
    var data = http.get(url);
    if (data)
    {
        var json = JSON.parse(data);
        logNow("Updates :");
        log(data);
        
        var nUpdates = json.updates.length;
        if (nUpdates > 0)
        {
            for (var i = 0 ; i < nUpdates ; i++)
            {
                addFootUpdate(json.updates[i], reader);
            }
        }
        else
        {
            // Check if matches remain
            if (json.matches.playing == 0 && json.matches.scheduled == 0)
            {
                karotz.led.light(COLOR_WARNING);
                karotz.tts.start("Il n'y a plus de match aujourd'hui.", "fr", exitFunction);
            }
        }
    }
    
    return nUpdates;
}


/**
 * Format match score to be read
 */
function readFootMatchScore(match)
{
    var read;
    if (match.penalty != null && match.penalty.home != null && match.penalty.away != null)
    {
        read = "tir au but : ";
        read += match.team.home+", "+match.penalty.home;
        read += ", "+match.team.away+", "+match.penalty.away;
    }
    else
    {
        read = match.team.home;
    
        if (match.score != null && match.score.home != null)
        {
            read += ", "+match.score.home;
        }

        read += ", "+match.team.away;

        if (match.score != null && match.score.away != null)
        {
            read += ", "+match.score.away;
        }
    }
    
    if (match.redCards != null)
    {
        if (match.redCards.home != null && match.redCards.home > 0)
        {
            read += ", "+match.team.home+" réduit à "+(11-match.redCards.home);
        }
        
        if (match.redCards.away != null && match.redCards.away > 0)
        {
            read += ", "+match.team.away+" réduit à "+(11-match.redCards.away);
        }
    }
    
    return read;
}


/**
 * Add score to read
 */
function addFootScore(match, reader)
{
    var id = match.id;
    var color;
    var read = readFootMatchScore(match);
    
    read += ", ";
    
    if (match.state == "SCHEDULED")
    {
        if (match.startTime)
        {
            var time = parseDate(match.startTime);
            
            if (time)
            {
                var now = new Date();
                if (time.getDate() == now.getDate() && time.getMonth() == now.getMonth() && time.getYear() == now.getYear())
                {
                    // Match is today
                    read += "prévu à "+time.getHours()+"h"+time.getMinutes();
                }
                else
                {
                    // Match is another day
                    read += "prévu le " + readDate(time);
                }
            }
            else
            {
                read += "à venir";
            }
        }
        else
        {
            read += "à venir";
        }
        color = CYAN;
    }
    else if (match.state == "HALF_TIME")
    {
        read += "mi-temps";
        color = YELLOW;
    }
    else if (match.state == "END_TIME")
    {
        read += "prolongation";
        color = YELLOW;
    }
    else if (match.state == "HALF_PROL")
    {
        read += "mi-temps de la prolongation";
        color = YELLOW;
    }
    else if (match.state == "PENALTY")
    {
        read += "tir au but";
        color = GREEN;
    }
    else if (match.state == "TERMINATED")
    {
        read += "terminé";
        color = BLUE;
    }
    else if (match.state == "STOPPED")
    {
        read += "match interrompu";
        color = RED;
    }
    else if (match.state == "CANCELLED")
    {
        read += "match annulé";
        color = RED;
    }
    else
    {
        color = GREEN;
        
        if (match.playingTime && match.playingTime > 0)
        {
            read += readMinute(match.playingTime);
        }
        else if (match.state == "FIRST_HALF")
        {
            read += "1ère mi-temps";
        }
        else if (match.state == "SECOND_HALF")
        {
            read += "2ème mi-temps";
        }
        else if (match.state == "FIRST_PROL")
        {
            read += "1ère mi-temps de la prolongation";
        }
        else if (match.state == "SECOND_PROL")
        {
            read += "2ème mi-temps de la prolongation";
        }
    }
    
    read += ".";
    
    reader.add(read, id, COLOR_SPEAK);
}



/**
 * Add update to read
 */
function addFootUpdate(update, reader)
{
    var id = update.match.id;
    var color = "";
    var sound = "";
    var read = "";
    
    if (update.type == "NEW_STATE")
    {
        var withScore = true;
        
        switch (update.match.state)
        {
            case "FIRST_HALF":
                read = "Début du match";
                color = GREEN;
                sound = SOUND_SIFFLET1;
                withScore = false;
                break;
            case "HALF_TIME":
                read = "Mi-temps";
                color = YELLOW;
                sound = SOUND_SIFFLET2;
                break;
            case "SECOND_HALF":
                read = "Début de la deuxième mi-temps";
                color = GREEN;
                sound = SOUND_SIFFLET1;
                break;
            case "END_TIME":
                read = "Fin du temps règlementaire";
                color = YELLOW;
                sound = SOUND_SIFFLET2;
                break;
            case "FIRST_PROL":
                read = "Début de la prolongation";
                color = GREEN;
                sound = SOUND_SIFFLET1;
                break;
            case "HALF_PROL":
                read = "Mi-temps de la prolongation";
                color = YELLOW;
                sound = SOUND_SIFFLET2;
                break;
            case "SECOND_PROL":
                read = "Début de la deuxième prolongation";
                color = GREEN;
                sound = SOUND_SIFFLET1;
                break;
            case "PENALTY":
                read = "Tir au but";
                sound = SOUND_SIFFLET2;
                color = GREEN;
                break;
            case "TERMINATED":
                read = "Fin du match";
                sound = SOUND_SIFFLET3;
                color = BLUE;
                break;
            case "STOPPED":
                read = "Match interrompu";
                sound = SOUND_SIFFLET3;
                color = RED;
                break;
            case "CANCELLED":
                read = "Match annulé";
                sound = SOUND_SIFFLET3;
                color = RED;
                break;
        }
        
        if (withScore)
        {
            read += ", " + readFootMatchScore(update.match);
        }
        else
        {
            read += ", "+update.match.team.home+", "+update.match.team.away;
        }
    }
    else if (update.type == "GOAL")
    {
        if (update.team)
        {
            read = "But pour "+update.team;
        }
        
        if (update.goal)
        {
            read += ", marqué";
            if (update.goal.player)
            {
                read += " par "+update.goal.player;
            }
            if (update.goal.ownGoal)
            {
                read += " contre son camp";
            }
            if (update.goal.penalty)
            {
                read += " sur pénalty";
            }
            if (update.goal.minute)
            {
                read += " à la "+readMinute(update.goal.minute);
            }
        }
        
        read += ", " + readFootMatchScore(update.match);
        
        sound = SOUND_GOAL;
        color = GREEN;
    }
    else if (update.type == "RED_CARD")
    {
        if (update.team)
        {
            read = "Carton rouge pour "+update.team;
        }
        sound = SOUND_RED_CARD;
        color = RED;
    }
    
    if (read != "")
    {
        reader.add(read, id, color, sound);
    }
}



function readDate(date)
{
    var read = date.getDate() + " ";
    
    switch (date.getMonth())
    {
        case 0:read += "janvier";break;
        case 1:read += "février";break;
        case 2:read += "mars";break;
        case 3:read += "avril";break;
        case 4:read += "mai";break;
        case 5:read += "juin";break;
        case 6:read += "juillet";break;
        case 7:read += "août";break;
        case 8:read += "septembre";break;
        case 9:read += "octobre";break;
        case 10:read += "novembre";break;
        case 11:read += "décembre";break;
    }
    
    return read;
}


function readMinute(minute)
{
    if (minute == 1)
    {
        return "1ère minute";
    }
    else
    {
        return minute+"ème minute";
    }
}


function readCallback(event)
{
    if (event == "TERMINATED" || event == "CANCELLED")
    {
        currentFootId = footReader.readNext(readCallback);
        if (currentFootId == null)
        {
            // Nothing to read next
            processingCommand = false;
            waitForUpdates();
        }
    }
}


function readExitCallback(event)
{
    if (event == "TERMINATED" || event == "CANCELLED")
    {
        currentFootId = footReader.readNext(readExitCallback);
        if (currentFootId == null)
        {
            log("Stopping application");
            exit();
        }
    }
}

