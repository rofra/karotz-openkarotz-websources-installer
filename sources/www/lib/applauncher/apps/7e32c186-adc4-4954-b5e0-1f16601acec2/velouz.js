var correction = new ReadCorrection();

function loadStation(id, callback)
{
    var station = parseStation(id);
    if (station)
    {
        var read = stationToRead(station);
        var color;
        if (station["bikes"] > 0)
        {
            color = "00FF00";
        }
        else
        {
            color = "FF0000";
        }
        karotz.led.light(color);
        karotz.tts.start(read, "fr", callback);
    }
    else
    {
        karotz.tts.start("Station numéro "+id+" inconnue", "fr", callback);
    }
}


function stationToRead(station)
{
    var read = "Station ";
    
    var name;
    if (station["name"] && station["name"] != "")
    {
        name = station["name"];
    }
    else
    {
        name = station["id"]
    }
    
    
    if (params[instanceName].read == "ADDRESS" && station["address"] && station["address"] != "")
    {
        read += station["address"]+", ";
    }
    else if (params[instanceName].read == "ALL" && station["address"] && station["address"] != "")
    {
        read += name+", " + station["address"]+", ";
    }
    else
    {
        read += name+", ";
    }
    
    if (station["bikes"] > 0)
    {
        read += station["bikes"];
    }
    else
    {
        read += "aucun";
    }

    read += " vélo, ";
    
    if (station["places"] > 0)
    {
        read += station["places"];
    }
    else
    {
        read += "aucune";
    }
    
    read += " place disponible.";
    
    return correction.process(read);
}



function parseStation(id)
{
    if (json && json.stations && json.stations[id])
    {
        var station = new Array();
        
        station["id"] = id;
        if (json.stations[id].name)
        {
            station["name"] = json.stations[id].name;
        }
        if (json.stations[id].address)
        {
            station["address"] = json.stations[id].address;
        }
        station["bikes"] = json.stations[id].bikes;
        station["places"] = json.stations[id].places;
        return station;
    }
    
    return null;
}



function ReadCorrection()
{
    this.names = new Array();
    
    this.process = function(name)
    {
        var text = name.toLowerCase();
        
        for (var key in this.names)
        {
            text = text.replaceAll(key, this.names[key]);
        }
        
        return text;
    }
    
    this.names["161/163"] = "161-163";
    this.names["/"] = " ";
    this.names[" pr "] = " professeur ";
    this.names[" st "] = " saint ";
    this.names[" ste "] = " sainte ";
    this.names[" leopold "] = " léopold ";
    this.names["leduc"] = "leuduc";
    this.names[" av "] = " avenue ";
    this.names[" all "] = " allée ";
    this.names[" allee "] = " allée ";
    this.names[" iv"] = " 4";
    this.names[" vi"] = " 6";
    this.names[" g. arnoult"] = " arnou";
    this.names["republique"] = "république";
    this.names[" a. bernard"] = " arnaud bernard";
    this.names["sejourne"] = "séjourné";
    this.names["lascrosses-"] = "lascrosses";
    this.names["3b "] = "3 bis ";
    this.names["billiere"] = "billière";
    this.names["capt "] = "capitainerie ";
    this.names["bonnefoy"] = "bonne foi";
    this.names[" l eglise"] = " l'église";
    this.names["champetre"] = "champêtre";
    this.names[" int "] = " intérieure ";
    this.names["interieure"] = "intérieure";
    this.names["saint cyp."] = "saint cyprien";
    this.names[" esp "] = " esplanade ";
    this.names[" l embouchure"] = " l'embouchure";
    this.names[" honre serres"] = " honoré serres";
    this.names[" d oie"] = " d'oie";
    this.names[" d aquin"] = " d'aquin";
    this.names[" rte "] = " route ";
    this.names[" ch "] = " chemin ";
    this.names[" l urss"] = " l'URSS";
    this.names[" urss"] = " URSS";
    this.names["u.r.s.s"] = "URSS";
    this.names["peyrouset"] = "pérouset";
    this.names[" ups"] = " UPS";
    this.names["d' italie"] = "d'italie";
    this.names[" fb "] = " faubourg ";
    this.names["lemaitre"] = "lemètre";
    this.names["courrege"] = "courrège";
    this.names["saint ex."] = "saint exupéry";
    this.names[" che "] = " chemin ";
    this.names["barriere"] = "barrière";
    this.names["centre co."] = "centre commercial";
    this.names["-rieux"] = " rilleux";
    this.names[" d albi"] = " d'albi";
    this.names[" avt "] = " avant ";
    this.names["rangueil"] = "ran gueuye";
    this.names["wagner"] = "vag-nère";
    this.names[" ang "] = " angle ";
    this.names["l'abbe "] = "l'abbé ";
    this.names[" iut "] = " IUT ";
    this.names["enac"] = "énac";
    this.names["e. rostand"] = "edmond rostand";
    this.names["creps"] = "crèpse";
    
}