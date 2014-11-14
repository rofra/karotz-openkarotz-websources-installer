function KarotzMessage(text, color)
{
    this.text = text;
    this.color = color;
}

function read(trafic, station, maxtimes, line)
{
    log("maxtimes "+maxtimes);
    
    var msgTrafic;
    var msgStation;
    if (trafic)
    {
        msgTrafic = getTraficInfo();
    }
    
    if (station)
    {
        msgStation = getSchedule(station, maxtimes, line);
    }
    
    if (msgTrafic != null)
    {
        karotz.led.light(msgTrafic.color);
        if (msgStation != null)
        {
            karotz.chain.tts(msgTrafic.text, 'fr').tts(msgStation.text, 'fr').exec(exit);
        }
        else
        {
            karotz.tts.start(msgTrafic.text, "fr", exitFunction);
        }
    }
    else if (msgStation != null)
    {
        karotz.tts.start(msgStation.text, "fr", exitFunction);
    }
    else
    {
        log("Nothing to say !");
    }
}


// Return KarotzMessage with trafic info
function getTraficInfo()
{
    
    var url = URL_TISSEOZ;
    log("Get trafic info from "+url);
    var json = http.get(url);
    log(json);
    try
    {
        var data = JSON.parse(json);
        
        if (data && data.trafic && data.trafic.status && data.trafic.message)
        {
            if (data.trafic.status == "NORMAL")
            {
                return new KarotzMessage("Trafic tisséo : "+data.trafic.message, GREEN);
            }
            else
            {
                return new KarotzMessage("Trafic tisséo : "+data.trafic.message, ORANGE);
            }
        }
        else if (data && data.error)
        {
            log("Erreur : "+data.trafic.message);
            return new KarotzMessage(data.error, RED);
        }
    }
    catch (err)
    {
        alert(err);
    }
    
    log("Informations trafic non disponibles");
    return new KarotzMessage("Informations trafic non disponibles.", RED);
}


// Return KarotzMessage with station schedule
function getSchedule(station, maxtimes, line)
{
    var url = URL_TISSEOZ+"?station="+station;
    if (line)
    {
        url += '&line='+line;
    }
    log("Get schedule from "+url);
    var json = http.get(url);
    log(json);
    try
    {
        var data = JSON.parse(json);
        
        if (data && data.schedule)
        {
            var msg;
            var nbLines = data.schedule.length;
            if (nbLines > 0)
            {
                msg = "Prochain passage à l'arrêt "+data.station+". ";

                var currentLine;
                var nb;
                var current;
                var delay;
                var prefix;
                for (var i=0 ; i < nbLines ; i++)
                {
                    if (i > 0)
                    {
                        msg += ". ";
                    }

                    currentLine = data.schedule[i];

                    msg += "Ligne "+currentLine.line+", direction "+currentLine.destination+" : ";

                    nb = currentLine.next.length;
                    for (var j=0 ; j < nb && j < maxtimes ; j++)
                    {
                        if (j > 0)
                        {
                            msg += "; ";
                        }

                        current = currentLine.next[j];

                        if (current.approximate)
                        {
                            prefix = "d'ici ";
                        }
                        else
                        {
                            prefix = "dans ";
                        }

                        if (current.delay > 59)
                        {
                            if (current.delay == 60)
                            {
                                delay = prefix+"une heure";
                            }
                            else
                            {
                                var hour = Math.floor(current.delay / 60);
                                var min = current.delay - hour * 60;
                                delay = prefix+hour+" heure";
                                if (min > 0)
                                {
                                    delay += " "+min;
                                }
                            }
                        }
                        else if (current.delay > 0)
                        {
                            delay = prefix+current.delay+" minute";
                        }
                        else
                        {
                            delay = "immédiatement";
                        }

                        if (current.approximate)
                        {
                            msg += delay+", vers "+readTime(current.time);
                        }
                        else
                        {
                            msg += delay+", à "+readTime(current.time);
                        }
                    }
                }
                
                var st = readTime(current.time);
                log(current.time+" => "+st);
                
                return new KarotzMessage(msg, GREEN);
            }
            else
            {
                msg = "L'arrêt "+data.station+" n'est pas desservi";
                
                if (line)
                {
                    msg += " par la ligne "+line;
                }
                
                msg += ".";
                
                return new KarotzMessage(msg, ORANGE);
            }
        }
        else if (data && data.error)
        {
            return new KarotzMessage(data.error, RED);
        }
    }
    catch (err)
    {
        alert(err);
    }
    
    return new KarotzMessage("Horaires non disponibles.", RED);
}