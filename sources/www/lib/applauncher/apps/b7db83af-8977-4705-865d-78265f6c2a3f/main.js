include("util.js");
include("tinyxmldom.js");

var testTTS=1;

var buttonListener = function(event) {
    	if (event == "DOUBLE") {
    	    	karotz.tts.stop();
		exit();
    	}
    	return true;
}

var tts = function(event) {
	if(event == "TERMINATED") {exit();}
	return true;
} 

var onKarotzConnect = function(data)
{
	karotz.led.light("000000");
	karotz.led.pulse("0000FF", 1500, -1);
	karotz.button.addListener(buttonListener);

	var pr=params[instanceName].pr;

	var c1=params[instanceName].c1;		//TF1
	var c2=params[instanceName].c2;		//France 2
	var c3=params[instanceName].c3;		//France 3
	var c4=params[instanceName].c4;		//Canal+
	var c5=params[instanceName].c5;		//ARTE
	var c6=params[instanceName].c6;		//M6
	var c7=params[instanceName].c7;		//France 4
	var c8=params[instanceName].c8;		//France 5
	var c9=params[instanceName].c9;		//Direct 8
	var c10=params[instanceName].c10;	//W9
	var c11=params[instanceName].c11;	//TMC
	var c12=params[instanceName].c12;	//NT1
	var c13=params[instanceName].c13;	//NRJ 12
	var c14=params[instanceName].c14;	//LCP
	var c15=params[instanceName].c15;	//BFM TV
	var c16=params[instanceName].c16;	//i>Télé
	var c17=params[instanceName].c17;	//Direct Star
	var c18=params[instanceName].c18;	//Gulli
	var c19=params[instanceName].c19;	//France Ô
/*
	var pr=3;

	var c1=1;	//TF1
	var c2=1;	//France 2
	var c3=1;	//France 3
	var c4=0;	//Canal+
	var c5=0;	//ARTE
	var c6=1;	//M6
	var c7=0;	//France 4
	var c8=0;	//France 5
	var c9=0;	//Direct 8
	var c10=0;	//W9
	var c11=0;	//TMC
	var c12=0;	//NT1
	var c13=0;	//NRJ 12
	var c14=0;	//LCP
	var c15=0;	//BFM TV
	var c16=0;	//i>Télé
	var c17=0;	//Direct Star
	var c18=0;	//Gulli
	var c19=0;	//France Ô
*/
	var data = http.get("http://www3.web2hosts.com/convertigo/projects/yafatv/tv.xml");
	var objDom = new XMLDoc(data);
	var domTree = objDom.docNode;

	var text_to_speech="";	

	if((pr==1)||(pr==3))
	{
		text_to_speech+="Première 'partie de la soirée : : : : : : ";
		if(c1==1)
		{
			text_to_speech+= domTree.selectNode("/prog[0]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[0]/prime_title").getText();
		}
		if(c2==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[1]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[1]/prime_title").getText();
		}
		if(c3==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[2]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[2]/prime_title").getText();
		}
		if(c4==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[3]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[3]/prime_title").getText();
		}
		if(c5==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[4]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[4]/prime_title").getText();
		}
		if(c6==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[5]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[5]/prime_title").getText();
		}
		if(c8==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[7]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[7]/prime_title").getText();
		}
		if(c9==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[8]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[8]/prime_title").getText();
		}
		if(c10==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[9]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[9]/prime_title").getText();
		}
		if(c11==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[10]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[10]/prime_title").getText();
		}
		if(c12==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[11]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[11]/prime_title").getText();
		}
		if(c13==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[12]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[12]/prime_title").getText();
		}
		if(c14==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[13]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[13]/prime_title").getText();
		}
		if(c7==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[6]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[6]/prime_title").getText();
		}
		if(c15==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[14]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[14]/prime_title").getText();
		}
		if(c16==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[15]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[15]/prime_title").getText();
		}
		if(c17==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[16]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[16]/prime_title").getText();
		}
		if(c18==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[17]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[17]/prime_title").getText();
		}
		if(c19==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[18]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[18]/prime_title").getText() + " : : : : : : ";
		}
	}

	/**************************************************************************************/

	if((pr==2)||(pr==3))
	{
		text_to_speech+="Deuxième partie de la soirée";
		if(c1==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[0]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[0]/deuz_title").getText();
		}
		if(c2==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[1]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[1]/deuz_title").getText();
		}
		if(c3==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[2]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[2]/deuz_title").getText();
		}
		if(c4==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[3]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[3]/deuz_title").getText();
		}
		if(c5==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[4]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[4]/deuz_title").getText();
		}
		if(c6==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[5]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[5]/deuz_title").getText();
		}
		if(c8==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[7]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[7]/deuz_title").getText();
		}
		if(c9==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[8]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[8]/deuz_title").getText();
		}
		if(c10==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[9]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[9]/deuz_title").getText();
		}
		if(c11==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[10]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[10]/deuz_title").getText();
		}
		if(c12==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[11]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[11]/deuz_title").getText();
		}
		if(c13==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[12]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[12]/deuz_title").getText();
		}
		if(c14==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[13]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[13]/deuz_title").getText();
		}
		if(c7==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[6]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[6]/deuz_title").getText();
		}
		if(c15==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[14]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[14]/deuz_title").getText();
		}
		if(c16==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[15]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[15]/deuz_title").getText();
		}
		if(c17==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[16]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[16]/deuz_title").getText();
		}
		if(c18==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[17]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[17]/deuz_title").getText();
		}
		if(c19==1)
		{
			text_to_speech+= " : : : : : : " + domTree.selectNode("/prog[18]/canal").getText();
			text_to_speech+= " : " + domTree.selectNode("/prog[18]/deuz_title").getText();
		}
	}

	var i=0
	while (i!=-1) {
		i=text_to_speech.indexOf("\\",i);
		if (i>=0) {
			text_to_speech=text_to_speech.substring(0,i)+text_to_speech.substring(i+1);
		}
	}

	karotz.tts.start(text_to_speech, "fr",tts);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
