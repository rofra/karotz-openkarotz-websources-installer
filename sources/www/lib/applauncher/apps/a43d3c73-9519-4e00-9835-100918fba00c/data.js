function getIcon( i_code )
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
