var lang = 'fr'

var sayToday = function()
{
  var ret = "<prosody rate='.85'>Météo " + data.city + ". ";
  ret += "Aujourd'hui, " + getDescription( data.weathercode, data.weatherdesc ) + ". ";
  ret += "Il fait actuellement " + data.tempCurrent + " degrés. ";
  ret += "Les températures iront de " + data.tempMin + " jusqu'à " + data.tempMax + " degrés.</prosody>";
  return ret
}

var sayTomorrow = function()
{
  var ret = "<prosody rate='.85'>Demain, " + getDescription( data.weather2code, data.weather2desc ) + ". ";
  ret += "Il fera " + data.temp2Min  + " degrés le matin et " + data.temp2Max  + " degrés l'après midi.</prosody>";
  return ret;
}

function getDescription( i_code, i_desc )
{
    if ( lang == "en" )
        return i_desc;

    switch ( i_code * 1 )   // * 1 to force integer value instead of string
    {
        case 392 : 
        case 395 : return "chutes de neige avec orage";

        case 389 : return "temps pluvieux avec orage";
        case 385 : return "risque de pluie avec orage";

        case 350 :
        case 374 :
        case 377 : return "chutes de grêle";

        case 326 :
        case 329 :
        case 332 :
        case 335 :
        case 338 :
        case 368 :
        case 371 : return "chutes de neige";

        case 266 :
        case 296 :
        case 299 :
        case 302 :
        case 305 :
        case 308 :
        case 311 :
        case 314 :
        case 317 :
        case 320 :
        case 353 :
        case 356 :
        case 359 :
        case 362 :
        case 365 : return "temps pluvieux";

        case 179 :
        case 323 : return "risques de neige";

        case 263 :
        case 293 : return "risques de pluie";

        case 182 : 
        case 185 : 
        case 185 : 
        case 281 : 
        case 284 : return "pluie verglaçante";

        case 260 : return "brouillard givrant";

        case 143 : 
        case 248 : return "brouillard";

        case 227 : 
        case 230 : return "tempêtes de neige";

        case 200 : return "orages";

        case 176 : return "averses éparses";

        case 119 : 
        case 122 : return "temps couvert dans l'ensemble";

        case 116 : return "temps partiellement nuageux";

        case 113 : return "temps clair et ensoleillé";
    }
    log( "Code non trouvé : " + i_code );
    return i_desc;
}

function getAnim( i_code )
{
    switch ( i_code * 1 )   // * 1 to force integer value instead of string
    {    
        case 395 :
        case 392 : 
        case 389 : 
        case 386 : 
        case 371 : 
        case 368 : 
        case 338 :
        case 335 : 
        case 332 : 
        case 329 :
        case 326 :
        case 323 :
        case 230 : 
        case 227 :
        case 179 : return "snow";

        case 377 :
        case 374 :
        case 350 :
        case 185 :
        case 182 : return "flurries";

        case 365 :
        case 362 :
        case 359 :
        case 356 :
        case 353 :
        case 320 :
        case 317 :
        case 314 :
        case 311 :
        case 308 :
        case 305 :
        case 302 :
        case 299 :
        case 296 :
        case 293 :
        case 284 :
        case 281 :
        case 266 :
        case 263 :
        case 176 : return "rain";

        case 260 :
        case 248 :
        case 143 : return "fog";

        case 200 : return "storm";

        case 122 :
        case 119 : return "cloudy";

        case 116 : 
        case 113 : return "sunny";
    }
    return "unknown";
}
