var colorList = new Array();
colorList.push(["0000FF","00FF00"]);
colorList.push(["FF0000","FF8000"]);
colorList.push(["0080FF","00FFFF"]);
colorList.push(["00802F","00FF80"]);
colorList.push(["550020","0000FF"]);
colorList.push(["555020","5050FF"]);


var rndLedTupleId;

var ledCallback = function()
{
  log("ledCallback");
}

var rndLedCb = function(){
  log("rndLedCb");
  //if (event=="TERMINATED" || event=="CANCELLED"){
  rndLedTupleId = Math.floor(karotz.random()%colorList.length );
  log(colorList[rndLedTupleId][0]);
  log(colorList[rndLedTupleId][1]);
  karotz.led.pulse(colorList[rndLedTupleId][1],4000,Math.floor(karotz.random()%(20*1000)+4000),ledCallback);  
  //}
  return true;
}


var rndLed = function(){
  log("rndLed");
  rndLedTupleId = Math.floor(karotz.random()%colorList.length );
  log(colorList[rndLedTupleId][0]);
  //randomEars();
  karotz.led.fade(colorList[rndLedTupleId][0],2000,rndLedCb);
}

var rndLedRelaunch = function(event){
  log("rndLedEvent");
  if (event=="TERMINATED" || event=="CANCELLED"){
    rndLed();  
  }
}
