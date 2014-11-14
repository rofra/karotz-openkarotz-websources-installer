var SITE_LOG = "karotz.ts-box.fr/log.php";

exlog = function(text)
{
	http.get(SITE_LOG + "?log=" + escape(text));
}

//supprime le fichier log du server
exlogerase = function()
{
	http.get(SITE_LOG + "?erase=1");
}