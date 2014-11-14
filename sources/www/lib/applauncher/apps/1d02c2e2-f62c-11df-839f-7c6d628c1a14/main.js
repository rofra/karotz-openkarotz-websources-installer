include("util.js");
include("data.js");

var onKarotzConnect = function(data){
    var instance = params[instanceName];

/*
    if (instance.phoneNumber != "") {  
        log("send SMS");
        var data = http.post("https://www.esendex.com/secure/messenger/formpost/SendSMS.aspx",
            {
              "EsendexUsername":"sylvain.cassini@mindscape.fr",
              "EsendexPassword":"karotz",
              "EsendexAccount":"EX0071671",
              "EsendexRecipient": instance.phoneNumber,
              "EsendexBody": instance.message
            });
    }
*/
    if (instance.mail != "") {
        if (instance.photo == "yes"){
            log("takePhoto");
            myUuid = uuid();
	    picture = "http://www.karotz.com/photo/"+myUuid; 
            karotz.webcam.photo(picture);
	    photoHtml = '<img alt="photo.jpg"\n\
 src="http://www.karotz.com/photo/'+myUuid+'"\n\
 moz-do-not-send="true" height="480" width="640">\n'
        }
        else {
            photoHtml = ""
        }
        msgHtml="\n" + '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n\
<html>\n\
<head>\n\
\n\
<meta http-equiv="content-type" content="text/html; charset=UTF8">\n\
</head>\n\
<br/>\n\
<body text="#000000" bgcolor="#ffffff">\n<big>' +
instance.message + "</big><br/><br/>"
+ photoHtml + "<br/><br/><big>" + noreply + "</big><br/><br/>" +
'</body>\n\
</html>'

        log("send Mail");
        mailTab = instance.mail.split(";")
        log("mailTab length : " + mailTab.length);
        
        for(i=0;i<mailTab.length;i++){
            log("mailTab : " + mailTab[i]);
            
            http.post("http://www.karotz.com/mail/send/"+instance.uuid,
            {
                "to":mailTab[i],
                "subject": subject + instanceName,
                "content": msgHtml
            });
        }

        
    }
    exit();
    
}

karotz.connectAndStart(host, port, onKarotzConnect, {});
