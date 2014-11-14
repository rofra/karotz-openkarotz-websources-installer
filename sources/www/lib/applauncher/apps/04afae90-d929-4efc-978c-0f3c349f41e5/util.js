karotz.connectAndStart = function(host, port, callback, data){	
    try
    {
      karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }
    catch(err)
    {
    	log(err);
    }
};

var SITE_LOG = "http://karotz.ts-box.fr/log.php";

HttpLog = function(text)
{
	log(SITE_LOG + "?log=" + escape(text));
	http.get(SITE_LOG + "?log=" + escape(text));
}

//supprime le fichier log du server
HttpLogErase = function()
{
	http.get(SITE_LOG + "?erase=1");
}

function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%');
}