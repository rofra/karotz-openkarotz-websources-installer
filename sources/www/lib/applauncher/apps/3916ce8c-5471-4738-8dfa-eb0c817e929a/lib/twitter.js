//03/08/2011

if (!social.twitter)
    social.twitter = {}

//********* Regexp

var apostrophe=new RegExp("'", "g");
var soundcloudLink=new RegExp("snd.[^ ]*", "g");
var triplePoint=new RegExp("\\.\\.\\.", "g");
social.twitter.specSymb=new RegExp("@|#", "gi");
social.twitter.mentionRegExp=new RegExp("@\w+", "g");


social.twitter.specTerm = new Array();
social.twitter.specTerm["RT"] = ", R.T. ";
social.twitter.specTerm["DM"] = ", D.M. ";
social.twitter.specTerm["TT"] = ", T.T. ";
social.twitter.specTerm["FF"] = ", F.F. ";
social.twitter.specTerm["TL"] = ", T.L. ";
social.twitter.specTerm["OH"] = ", O.H. ";
social.twitter.specTerm["HT"] = ", H.T. ";
social.twitter.specTerm["MT"] = ", M.T. ";
social.twitter.specTerm["PRT"] = ", P.R.T. ";
social.twitter.specTerm["CC"] = ", C.C. ";

social.twitter.specTermRegExp = new Array();
social.twitter.specTermRegExp["RT"] = new RegExp("\\bRT\\b", "gi");
social.twitter.specTermRegExp["DM"] = new RegExp("\\bDM\\b", "gi");
social.twitter.specTermRegExp["TT"] = new RegExp("\\bTT\\b", "gi");
social.twitter.specTermRegExp["FF"] = new RegExp("\\bFF\\b", "gi");
social.twitter.specTermRegExp["TL"] = new RegExp("\\bTL\\b", "gi");
social.twitter.specTermRegExp["OH"] = new RegExp("\\bOH\\b", "gi");
social.twitter.specTermRegExp["HT"] = new RegExp("\\bHT\\b", "gi");
social.twitter.specTermRegExp["MT"] = new RegExp("\\bMT\\b", "gi");
social.twitter.specTermRegExp["PRT"] = new RegExp("\\bPRT\\b", "gi");
social.twitter.specTermRegExp["CC"] = new RegExp("\\bCC\\b", "gi");
//*********


social.twitter.saveLastTimeline = function(ts){
  JSON.save("LastTimeline",ts)
}

social.twitter.getLastTimeline = function(){
  try {return JSON.load("LastTimeline");}
  catch(e){}
  return "";
}

social.twitter.saveLastMention = function(ts){
  JSON.save("LastMention",ts)
}

social.twitter.getLastMention = function(){
  try {return JSON.load("LastMention");}
  catch(e){}
  return "";
}

social.twitter.saveLastMessage = function(ts){
  JSON.save("LastMessage",ts)
}

social.twitter.getLastMessage = function(){
  try {return JSON.load("LastMessage");}
  catch(e){}
  return "";
}

social.twitter.sendSign = function(method, url, params){
    log("social.twitter.sendSign START");
	var oauth_nonce = uuid();
	var oauth_timestamp = timestamp();
    var paramsTmp = {};

    var keys = [];
	for (key in params){ keys.push(key); }
	keys = keys.sort();

    if( method=="POST" ){
	    for (var i =0; i< keys.length; i++){ 
            log("keys[" + i + "]:" + keys[i] + "   params[keys[" + i + "]]:" + params[keys[i]]); 
            paramsTmp[keys[i]] = params[keys[i]];
            params[keys[i]] = encodeURIComponent(params[keys[i]]);
            params[keys[i]] = params[keys[i]].replace(apostrophe, "%27");
        }
        log("############ " + paramsTmp.status);
    }

	var data = method + "&";
	data += encodeURIComponent(url) + "&";

	params["oauth_nonce"] = oauth_nonce;
	params["oauth_signature_method"] = "HMAC-SHA1";
	params["oauth_timestamp"] = oauth_timestamp;
    params["oauth_consumer_key"] = social.twitter.oauth_consumer_key;
	params["oauth_token"] = social.twitter.oauth_token;
	params["oauth_version"] = "1.0";

    keys = [];
	for (key in params){ keys.push(key); }
	keys = keys.sort();
	
	for (var i =0; i< keys.length; i++){ 
        log("keys[i]:" + keys[i] + "   params[keys[i]]:" + params[keys[i]]); 
        data +=  encodeURIComponent(keys[i]) + "%3D" + encodeURIComponent(params[keys[i]]) + "%26";
    }
	data = data.substr(0, (data.length -3));

    for (var i =0; i< data.length; i+=150)
	{
        log("dataURL:" + data.substr(i, i+150));
    }
	
    var sign = social.twitter.sign(data);
    log("social.twitter.sendSign sign: " + sign);

	if( method=="GET" ){
	    var data2 = "";
	    for (var i =0; i< keys.length; i++)
	    {
	       	data2 +=  encodeURIComponent(keys[i]) + "=" + encodeURIComponent(params[keys[i]]) + "&";
	    }
	    data2 = data2.substr(0, (data2.length -1));
	
	    log("social.twitter.sendSign DONE");
	
		return http.get(url + "?" + data2 + "&oauth_signature=" + encodeURIComponent(sign), {});
	}

    var header = {};
    var headerTxt = "OAuth ";

    for (var i =0; i< keys.length; i++)
	{
        if("status" != keys[i])
        {
	        headerTxt += keys[i] + '="' + encodeURIComponent(params[keys[i]]) + '", ';
        }
	}
    headerTxt += 'oauth_signature="' + encodeURIComponent(sign) + '", ';

    log("headerTxt:" + headerTxt.substr(0, 150));
    log("headerTxt:" + headerTxt.substr(150, 300));

    header[encodeURIComponent("Authorization")] = headerTxt;

    var rtnPost = http.post(url , paramsTmp, header, false);
    log("rtnPost:" + rtnPost);
    for (var i =0; i< rtnPost.length; i+=150)
	{
        log("rtnPost:" + rtnPost.substr(i, i+150));
    }
	return rtnPost;
}

social.twitter.sendSignForm = function(method, url, params){
    log("social.twitter.sendSignForm START");
	var oauth_nonce = uuid();
	var oauth_timestamp = timestamp();
    var paramsTmp = params;
    params = {};
    var keys = [];
	for (key in params){ keys.push(key); }
	keys = keys.sort();

    if( method=="POST" ){
	    for (var i =0; i< keys.length; i++){ 
            log("keys[i]:" + keys[i] + "   params[keys[i]]:" + params[keys[i]]); 
            params[keys[i]] = encodeURIComponent(params[keys[i]]);
        }
        log("############ " + paramsTmp.status);
    }

	var data = method + "&";
	data += encodeURIComponent(url) + "&";

	params["oauth_nonce"] = oauth_nonce;
	params["oauth_signature_method"] = "HMAC-SHA1";
	params["oauth_timestamp"] = oauth_timestamp;
    params["oauth_consumer_key"] = social.twitter.oauth_consumer_key;
	params["oauth_token"] = social.twitter.oauth_token;
	params["oauth_version"] = "1.0";

    keys = [];
	for (key in params){ keys.push(key); }
	keys = keys.sort();
	
	for (var i =0; i< keys.length; i++){ 
        log("keys[i]:" + keys[i] + "   params[keys[i]]:" + params[keys[i]]); 
        data +=  encodeURIComponent(keys[i]) + "%3D" + encodeURIComponent(params[keys[i]]) + "%26";
    }
	data = data.substr(0, (data.length -3));

    for (var i =0; i< data.length; i+=150)
	{
        log("dataURL:" + data.substr(i, i+150));
    }
	
    var sign = social.twitter.sign(data);
    log("social.twitter.sendSignForm sign: " + sign);

	if( method=="GET" ){
	    var data2 = "";
	    for (var i =0; i< keys.length; i++)
	    {
	       	data2 +=  encodeURIComponent(keys[i]) + "=" + encodeURIComponent(params[keys[i]]) + "&";
	    }
	    data2 = data2.substr(0, (data2.length -1));
	
	    log("social.twitter.sendSignForm DONE");
	
		return http.get(url + "?" + data2 + "&oauth_signature=" + encodeURIComponent(sign), {});
	}

    var header = {};
    var headerTxt = "OAuth ";
    header["Expect"] = "";

    for (var i =0; i< keys.length; i++)
	{
        if("status" != keys[i])
        {
	        headerTxt += keys[i] + '="' + encodeURIComponent(params[keys[i]]) + '", ';
        }
	}
    headerTxt += 'oauth_signature="' + encodeURIComponent(sign) + '", ';

    log("headerTxt:" + headerTxt.substr(0, 150));
    log("headerTxt:" + headerTxt.substr(150, 300));

    header[encodeURIComponent("Authorization")] = headerTxt;

    var rtnPost = http.post(url , paramsTmp, header, true);
    log("rtnPost:" + rtnPost);
    for (var i =0; i< rtnPost.length; i+=150)
	{
        log("rtnPost:" + rtnPost.substr(i, i+150));
    }
	return rtnPost;
}

social.twitter.getHomeTimeline = function(nbMaxMessage, sinceId){
    var params = {};
    params.count = nbMaxMessage;
    params.include_entities=true;
    if((sinceId != undefined) && (sinceId > 0))
    {
        params.since_id = sinceId;
    }
    var result = social.twitter.sendSign("GET", "http://api.twitter.com/1/statuses/home_timeline.json", params);
    log("result:" + result);
    return JSON.parse(result);
}

social.twitter.getMentions = function(nbMaxMessage, sinceId){
    var params = {};
    params.count = nbMaxMessage;
    if((sinceId != undefined) && (sinceId > 0))
    {
        params.since_id = sinceId;
    }
    var result = social.twitter.sendSign("GET", "http://api.twitter.com/1/statuses/mentions.json", params);
    log("result:" + result);
    return JSON.parse(result);
}

social.twitter.getDirectMessages = function(nbMaxMessage, sinceId){
    var params = {};
    params.count = nbMaxMessage;
    if((sinceId != undefined) && (sinceId > 0))
    {
        params.since_id = sinceId;
    }
    var result = social.twitter.sendSign("GET", "http://api.twitter.com/1/direct_messages.json", params);

    return JSON.parse(result);
}

social.twitter.getSearch = function(query, sinceId){
    var params = {};
    params.q = query;
    if((sinceId != undefined) && (sinceId > 0))
    {
        params.since_id = sinceId;
    }
    var result = social.twitter.sendSign("GET", "http://search.twitter.com/search.json", params);
    return JSON.parse(result);
}

social.twitter.sendMsg = function(text){
    var params = {};
    params.status = text;
    var result = social.twitter.sendSign("POST", "https://api.twitter.com/1/statuses/update.json", params);
    return JSON.parse(result);
}

social.twitter.sendDirectMsg = function(screen_name, user_id, text){
    var params = {};
    params.screen_name = screen_name;
    params.user_id = user_id;
    params.text = text;
    var result = social.twitter.sendSign("POST", "http://api.twitter.com/1/direct_messages/new.json", params);
    return JSON.parse(result);
}

social.twitter.sendMediaMsg = function(text, photo){
    var params = {};
    params.status = text;
    params["media[]"] = photo;
    var result = social.twitter.sendSignForm("POST", "https://upload.twitter.com/1/statuses/update_with_media.json", params);
    return JSON.parse(result);
}

social.twitter.cleanText = function(text){
    text = text.replace(social.twitter.specSymb, " , ");
    
    for (key in social.twitter.specTerm){ 
        text = text.replace(social.twitter.specTermRegExp[key], social.twitter.specTerm[key]);
    }
    
    text = text.replace(cleanToTts.emoticon1, "");
    text = text.replace(cleanToTts.emoticon2, "");
    text = text.replace(cleanToTts.emoticon3, "");
    text = text.replace(cleanToTts.emoticon4, "");
    text = text.replace(triplePoint, ".");
    text = text.toLowerCase();
    return text;
}

social.twitter.replaceLink = function(text, lang){
    log("####################")
    log("####### text : " + text)
    log("####### lang : " + lang)
    log("####### httpLinkTxt[lang] : " + cleanToTts.httpLinkTxt[lang])
    log(text)
    if(cleanToTts.httpLinkTxt[lang] != undefined)
    {
        text = text.replace(cleanToTts.httpLink, cleanToTts.httpLinkTxt[lang]);
    }
    else
    {
        text = text.replace(cleanToTts.httpLink, "");
    }
    log(text)
    text = text.replace(soundcloudLink, "");
    log(text)
    log("####################")
    return text;
}

social.twitter.replaceMentionName = function(message, text){
    if(message.entities != undefined && message.entities.user_mentions != undefined)
    {
        for (key in message.entities.user_mentions){ 
            log("result : " + message.entities.user_mentions[key].screen_name);
            log("result : " + message.entities.user_mentions[key].name);
            reg = new RegExp("@" + message.entities.user_mentions[key].screen_name, "gi")
            text = text.replace(reg, message.entities.user_mentions[key].name + ", ")
        }
    }
    
    return text
}
