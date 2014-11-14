var SITE_LOG="http://192.168.1.112:8888/log.php";
MyLog = function(text)
{
   http.get(SITE_LOG + "?log=" + escape(text));
}
//supprime le fichier log du server
MyLogErase = function()
{
	http.get(SITE_LOG + "?erase=1");
}

karotz.connectAndStart = function(host, port, callback, data){
	try {
		karotz.connect(host, port);
		MyLogErase();
		MyLog("connected");
		karotz.start(callback, data);
	}catch(err){
		MyLog(err);
	}
};
