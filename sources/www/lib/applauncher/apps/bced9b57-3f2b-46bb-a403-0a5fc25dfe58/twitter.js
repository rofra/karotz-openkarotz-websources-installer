include("txtTTS.js");
include("lib_twitter.js");
include("lib_googleasr.js");

//current data. refer to twitterDataName
var currentDataId = -1;
var twitterCurrentResults;
var isReading = false;

//max message read
var twitterDataName = new Array("directMessages_url", "mentions_url", "homeTimeline_url" );

var twitter_url = new Array();
twitter_url[twitterDataName[0]] = "https://api.twitter.com/1.1/direct_messages.json";
twitter_url[twitterDataName[1]] = "https://api.twitter.com/1.1/statuses/mentions_timeline.json";
twitter_url[twitterDataName[2]] = "https://api.twitter.com/1.1/statuses/home_timeline.json";

var twitterDatatxt = new Array();
twitterDatatxt[0] = { 'fr':" nouveaux messages",'en':" new messages" };
twitterDatatxt[1] = { 'fr':" nouvelles mentions",'en':" new mentions" };
twitterDatatxt[2] = { 'fr':" nouveaux thouite",'en':" new tweets" };

txtMessage_none = {'fr':"<prosody rate='slow'>Pas de nouveaux messages</prosody>",
            'en':"No new messages"};

txtMessage_end = {'fr':"Fin des messages",
            'en':"End of messages"};

txtMessage_error = {'fr':"Erreur de lecture",
            'en':"Error while reading"};

var twitter_readFunc = new Array();
var readFunc_homeTimeline = function(tweet){
	log("readFunc_homeTimeline");
    var rtnArray = new Array();
    var langTwit = g_lang; // getLang(tweet.text);

	rtnArray["lang"] = langTwit;

    txt = social.twitter.cleanText(tweet.text);
	txt = social.twitter.replaceLink(txt, langTwit);
	rtnArray["txt"] = homeTimelineTTS[langTwit] + tweet.user.screen_name + ", " + txt;
	return rtnArray;
}

var readFunc_directMessages = function(tweet){
	log("readFunc_directMessages");
	var rtnArray = new Array();
    var langTwit = g_lang; // getLang(tweet.text);

	rtnArray["lang"] = langTwit;

	txt = social.twitter.replaceLink(tweet.text, langTwit);

	rtnArray["txt"] = directMessagesTTS[langTwit] + tweet.sender.screen_name + ", " + txt;
	return rtnArray;
}

var readFunc_mentions = function(tweet){
	log("readFunc_mentions");
	var rtnArray = new Array();
    var langTwit = g_lang; // getLang(tweet.text);

	rtnArray["lang"] = langTwit;

	txt = social.twitter.replaceLink(tweet.text, langTwit);

	rtnArray["txt"] = mentionsTTS[langTwit] + tweet.user.screen_name + ", " + txt;
	return rtnArray;
}
twitter_readFunc[twitterDataName[0]] = readFunc_directMessages;
twitter_readFunc[twitterDataName[1]] = readFunc_mentions;
twitter_readFunc[twitterDataName[2]] = readFunc_homeTimeline;

var returnAndSaveTwitter = function(){
   log( "Entering returnAndSaveTwitter" );
  launchType.name = "NOPE";
  checkStartup = 0;
  isReading = false;
  karotz.tts.stop();
  returnAndSave = nothingFunc;
  simpleClicEvent = nothingFunc;
  longClicEvent = global_dblClic;
  mainColor();
}

var g_noMessages = true;
var startAutoRead = function(){
    log("############### startAutoRead");
	currentDataId ++;
    returnAndSave = returnAndSaveTwitter; //function(){ isReading = false; karotz.tts.stop(); startAutoRead();};

	log("startAutoRead currentDataId : " + currentDataId);
	if((currentDataId < twitterDataName.length) && (currentDataId <= contentOption))
	{
        log("startAutoRead name of data : " + twitterDataName[currentDataId]);
        if ( checkTweets() > 0)
        {
            log("checkTweets results");
            g_noMessages = false;
            isReading = false;
            checkConnected(runReadTweets);
        }
        else
        {
            log("checkTweets no results");
            startAutoRead();    // loop
        }
		return;
	}
	log("exit AutoRead TWITTER");
    if(launchType.name == "SCHEDULER") exit();

    if ( g_noMessages )
    {
        tts(txtMessage_none,
            function(event){
                if ((event == "CANCELLED") || (event == "TERMINATED")) 
                {
                    returnAndSave();
                    log("exit AutoRead TWITTER 2");
                    exit();
                }
            }
        );
    }
    else
    {
        returnAndSave();
        log("exit AutoRead TWITTER 3");
        exit();
    }
}

var startRead = function(){
    log("############### startRead");
    returnAndSave = returnAndSaveTwitter;

	if (checkTweets() > 0)
    {
        log("checkTweets results");

        isReading = false;
        runReadTweets();
    }
    else
    {
        log("checkTweets no results");
        tts({'fr':"pas de" + transTxt(twitterDatatxt[currentDataId]),'en':"no" + transTxt(twitterDatatxt[currentDataId])}, function(event){if(event != 'OK') returnAndSaveTwitter(); })
    }
}

var twitterTooLate = function(){
    log("TOOLATE");
    if (isReading) return false;

    if(launchType.name == "SCHEDULER" || checkStartup) startAutoRead();
    else returnAndSaveTwitter();

    return false; 
}

var runReadTweets = function(){
    log("runReadTweets");
    workingColor();

    if ( msgread == "buttonread" )
    {
        //5 sec to validate and say message

        var sTextPressFr = ( twitterCurrentResults.length == 1 ) ? "<prosody rate='slow'> Appuie sur mon bouton pour l'écouter</prosody>" : "<prosody rate='slow'> Appuie sur mon bouton pour les écouter</prosody>";
        var sTextPressEn = ( twitterCurrentResults.length == 1 ) ? "<prosody rate='slow'> Press on my button to ear it</prosody>" : "<prosody rate='slow'> Press on my button to ear them</prosody>";

        tts( { 'fr': ( ( ( twitterCurrentResults.length == 1 ) && ( currentDataId == 1 ) ) ? "une" : ""  + twitterCurrentResults.length ) + transTxt(twitterDatatxt[currentDataId]) + "." + sTextPressFr,'en':twitterCurrentResults.length + transTxt(twitterDatatxt[currentDataId])  + "." + sTextPressEn}, function(event){if(event != 'OK') setTimeout(5000, twitterTooLate); } );
        
        simpleClicEvent = function(){simpleClicEvent = karotz.tts.stop; isReading = true; readTweets(twitterCurrentResults, twitterCurrentResults.length -1); };
    }
    else // assuming "autoread"
    {
        tts( { 'fr': ( ( ( twitterCurrentResults.length == 1 ) && ( currentDataId == 1 ) ) ? "une" : ""  + twitterCurrentResults.length ) + transTxt(twitterDatatxt[currentDataId]) + "." ,'en':twitterCurrentResults.length + transTxt(twitterDatatxt[currentDataId])  + "." }, function(event){ if(event != 'OK') { isReading = true; readTweets(twitterCurrentResults, twitterCurrentResults.length -1); } } );
    }
}

var checkTweets = function(){
	log("checkTweets");
    if(connected) downloadingColor();
	var currentUrl = twitter_url[twitterDataName[currentDataId]];
    log( "currentUrl : " + currentUrl );
    var sinceId;

	//params
	var params = {};
	try {
	  sinceId = lastTwitterId[twitterDataName[currentDataId]];
	  if((sinceId != undefined) && (sinceId != -1)) 
            params["since_id"] = sinceId;
//      log( "DEBUG !!!!!!" );  params["since_id"] = -1;
	  log("params['since_id' ] : " + params["since_id"]);
	  params["count"] = nbCountMax;
	}
	catch(e)
	{
	  log("no sinceid");
        sinceId = undefined;
	}

	var data = social.twitter.sendSign("GET", currentUrl,  params);
	// var data = social.twitter.sendSign("POST", currentUrl,  params);
    for (var i =0; i< data.length; i+=150)
	{
        log("data:" + data.substr(i, i+150));
                if(i> 300) break;
    }
    log("JSON.parse(data) before");
    var twitterJson = JSON.parse(data);
    log("JSON.parse(data) done");

    if(twitterJson.length != undefined)
    {
        log("Nb of message : " + twitterJson.length);
        twitterCurrentResults = twitterJson;
        return twitterJson.length;
    }
    else
    {
        return -1;
    }
}

var readNextTweets = function(currentTweetId, twitterResults, tweetIdx){
    saveTwitterId(twitterDataName[currentDataId], currentTweetId);
	readTweets(twitterResults, tweetIdx-1);
}

var readTweets = function(twitterResults, tweetIdx){
    log("readTweets : " + (tweetIdx + 1) + "/" + twitterResults.length);

    if (tweetIdx >= 0 && isReading){
	    var currentTweetId = "" + twitterResults[tweetIdx].id_str;

        log("tweet id: " + currentTweetId);

	    var currentTweet = twitterResults[tweetIdx];
           
	    var rtnArray = new Array();
	    var rtnArray = (twitter_readFunc[twitterDataName[currentDataId]])(currentTweet);

	    log("txt : "  + rtnArray["txt"]);
	    log("lang : "  + rtnArray["lang"]);

	    if(rtnArray["txt"]){
		    log("currentTweet txt OK");

		    karotz.tts.start( "<prosody rate='slow'>" + rtnArray["txt"] + "</prosody>", rtnArray["lang"],
			    function(event){
                    if(event == "CANCELLED" || event == "ERROR"){
                        tts(txtMessage_error,
			                function(event){
                                log("################## event " + event);
                                if(event != "OK"){
                                    log("##################event != OK");
					                readNextTweets(currentTweetId, twitterResults, tweetIdx);
					                return false;
				                }
                                return true;
			                }
		                );
				    }
                    else if(event != "OK"){
					    readNextTweets(currentTweetId, twitterResults, tweetIdx);
					    return false;
				    }
                    return true;
			    }
		    );
		    return;
        }
        else{
            log("currentTweet txt NOT OK");
            readTweets(twitterResults, tweetIdx-1);
        }
    }
    else{
        //ADD TTS fin des message
        if(isReading) tts(txtMessage_end, function(event){log("tts EVENT " + event); if(event == 'OK') {return true;} if(launchType.name == "SCHEDULER" || checkStartup){startAutoRead();}else{returnAndSave()} return false;} );
    }
}


function cleanupTweet( i_sTweet )
{
	var sTweet = i_sTweet;
	// detect the pattern #WORD #WORD
	var reDoubleTag = /#\S+ #/;
	var result;
	while ( result = reDoubleTag.exec( sTweet ) )
	{	
		result = "" + result;	// make sure it is a string
//		log( "Found double # : " + result );
		sTweet = sTweet.replace( result, result.substring( 1, result.length - 2 ) + ", #" );
//		log( "-- after : " + sTweet );
	}

	sTweet = sTweet.replace( /#/g, " " );
//	log( "simple : " + sTweet );
	
	sTweet = sTweet.replace( /@/g, " " );
//	log( "@ : " + sTweet );
	
	var ararSpecialTerms = ( lang=="fr" )
                           ? [ [ "RT", " , aire thé, " ],
						     [ "DM", " , dé aime, " ],
						     [ "TT", " , thé thé, " ],
						     [ "FF", " , aife aife, " ],
						     [ "TL", " , thé elle, " ],
						     [ "OH", " , au hache, " ],
						     [ "HT", " , hache thé, " ],
						     [ "MT", " , aime thé, " ],
						     [ "PRT", " , pé aire thé, " ],
						     [ "CC", " , cé cé, " ],
						     [ "LT", " , elle thé, " ] ]
                           : [ [ "RT", " , are tea, " ],
						     [ "DM", " , dee em, " ],
						     [ "TT", " , tea tea, " ],
						     [ "FF", " , eff eff, " ],
						     [ "TL", " , tea elle, " ],
						     [ "OH", " , oh aitch, " ],
						     [ "HT", " , aitch tea, " ],
						     [ "MT", " , emm tea, " ],
						     [ "PRT", " , pea are tea, " ],
						     [ "CC", " , sea sea, " ],
						     [ "LT", " , elle tea, " ] ];

	for ( var i = 0; i < ararSpecialTerms.length; i++ )
	{
//		log( "replace " + ararSpecialTerms[ i ][ 0 ] + " with " + ararSpecialTerms[ i ][ 1 ] );
		
		var reMiddle = new RegExp( "\\W" + ararSpecialTerms[ i ][ 0 ] + "\\W");
		while ( result = reMiddle.exec( sTweet ) )
		{
			result = "" + result;
			sTweet = sTweet.replace( result.substr( 0, 1 ) + ararSpecialTerms[ i ][ 0 ] + result.substr( result.length - 1, 1 ), 
								     result.substr( 0, 1 ) + ararSpecialTerms[ i ][ 1 ] + result.substr( result.length - 1, 1 ) );
//			log( "-- test Middle : " + sTweet );
		}
		
		var reStart = new RegExp( "^" + ararSpecialTerms[ i ][ 0 ] + "\\W" );
		if ( result = reStart.exec( sTweet ) )
		{
			result = "" + result;
			sTweet = ararSpecialTerms[ i ][ 1 ] + sTweet.substring( ararSpecialTerms[ i ][ 0 ].length, sTweet.length );
//			log( "-- test start : " + sTweet );
		}
		
		var reEnd = new RegExp( "\\W" + ararSpecialTerms[ i ][ 0 ] + "$" );
		if ( result = reEnd.exec( sTweet ) )
		{
			result = "" + result;
			sTweet = sTweet.substring( 0, sTweet.length - ararSpecialTerms[ i ][ 0 ].length ) + ararSpecialTerms[ i ][ 1 ];
//			log( "-- test end  : " + sTweet );
		}
	}
	
	return sTweet;
}

