var toRead = new Array();
var toColor = new Array();
var mainColor;
var currentRead = 0;

function parseMeteo(id)
{
    var url = "http://www.yproust.net/meteopluie/rain.php?id="+id;
    var json = http.get(url);
    //log("Received: "+json);
    try
    {
        var data = JSON.parse(json);
        
        if (data && data.location)
        {
            getForecasts(data.forecast);
            readAllForecasts(data.location);
        }
        else if (data && data.error)
        {
            karotz.led.light(RED);
            karotz.tts.start(data.error, "fr", exitFunction);
        }
        else
        {
            karotz.led.light(RED);
            karotz.tts.start("Donnée indisponible pour le code "+id+".", "fr", exitFunction);
        }
        
        //karotz.tts.start("Prévision pour "+data.location+".", "fr", ttsCallback);
    }
    catch (err)
    {
        alert(err);
    }
}


function readAllForecasts(location)
{
    var nb = toRead.length;
    var read = "Prévision pour "+location+" : ";
    
    for (var i=0 ; i<nb ; i++)
    {
        read += toRead[i];
        read += " ";
    }
    
    karotz.led.light(mainColor);
    karotz.tts.start(read, "fr", exitFunction);
}


function readNextForecast()
{
    var read = toRead[currentRead];
    var color = toColor[currentRead];
    currentRead ++;
    
    if (currentRead < toRead.length && currentRead < toColor.length)
    {
        readForecast(read, color, ttsCallback);
    }
    else
    {
        readForecast(read, color, exitFunction);
    }
}


function ttsCallback(event)
{
    if (event == "TERMINATED")
    {
        readNextForecast();
    }
    else if (event == "CANCELLED")
    {
        exit();
    }
}


function readForecast(text, color, callback)
{
    karotz.led.light(color);
    log("Couleur : "+color);
    karotz.tts.start(text, "fr", callback);
}


function getColor(rain)
{
    if (rain == "LIGHT")
    {
        return rgb2hex(55, 64, 173);
    }
    else if (rain == "MEDIUM")
    {
        return CYAN;
    }
    else if (rain == "HEAVY")
    {
        return BLUE;
    }
    else if (rain == "NONE")
    {
        return rgb2hex(255, 255, 0);
    }
    else
    {
        return RED;
    }
}


function getForecasts(forecast)
{
    var nb = forecast.length;
    var startTime = forecast[0].start;
    var endTime = forecast[nb-1].end;
    
    var raining = new Array();
    
    var current = null;
    
    for (var i=0 ; i < nb ; i++)
    {
        current = forecast[i];
        
        if (current.rain == "LIGHT" || current.rain == "MEDIUM" || current.rain == "HEAVY")
        {
            raining.push(current);
        }
    }
    
    nb = raining.length;
    if (nb > 0)
    {
        // Raining
        mainColor = BLUE;
        current = null;
        var last = null;
        var next = null;
        var read;

        for (i=0 ; i < nb ; i++)
        {
            read = "";
            current = raining[i];
            
            if (i > 0)
            {
                last = raining[i-1];
            }
            else
            {
                last = null;
            }
            
            if (i < nb - 1)
            {
                next = raining[i+1];
            }
            else
            {
                next = null;
            }
            
            if (current.rain == "LIGHT")
            {
                read += "Pluie légère";
            }
            else if (current.rain == "MEDIUM")
            {
                read += "Pluie modérée";
            }
            else if (current.rain == "HEAVY")
            {
                read += "Pluie forte";
            }
            else
            {
                read += "Pluie";
            }
        
            read += ", ";
        
            if (last != null)
            {
                if (last.end == current.start)
                {
                    read += "à partir de "+current.start+". ";
                }
                else if (next != null)
                {
                    if (next.start == current.end)
                    {
                        read += "à partir de "+current.start+". ";
                    }
                    else
                    {
                        read += "entre "+current.start+" et "+current.end+". ";
                    }
                }
                else if (current.end == endTime)
                {
                    read += "à partir de "+current.start+". ";
                }
                else
                {
                    read += "entre "+current.start+" et "+current.end+". ";
                }
            }
            // TODO pluie en cours (start = startTime)
            else if (next != null)
            {
                if (next.start == current.end)
                {
                    read += "à partir de "+current.start+". ";
                }
                else
                {
                    read += "entre "+current.start+" et "+current.end+". ";
                }
            }
            else if (current.end == endTime)
            {
                read += "à partir de "+current.start+". ";
            }
            else
            {
                read += "entre "+current.start+" et "+current.end+". ";
            }
            
            toRead.push(read);
            toColor.push(getColor(current.rain));
        }
    }
    else
    {
        // Not raining
        var read;
        var rain;
        
        if (forecast.length > 1)
        {
            read = "Pas de pluie entre "+startTime+" et "+endTime+".";
            rain = "NONE";
        }
        else if (forecast[0].rain == "NONE")
        {
            read = "Pas de pluie entre "+startTime+" et "+endTime+".";
            rain = "NONE";
        }
        else
        {
            read = "Données indisponibles entre "+startTime+" et "+endTime+".";
            rain = "NOT_AVAILABLE";
        }
        
        mainColor = getColor(rain);
        toRead.push(read);
        toColor.push(getColor(rain));
    }
    
}