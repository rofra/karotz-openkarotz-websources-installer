function execAction(num, delay)
{
	setTimeout(delay, function()
	{
		automate(num);
	});
}

function speakAndGoto(txt, num, delay)
{
	karotz.tts.start(txt, "fr", function(event)
	{
		if ((event=="TERMINATED")&&(kill==0))
		{
			execAction(num, delay);
		}
	});
}
