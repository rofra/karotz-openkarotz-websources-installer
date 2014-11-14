if (!social.facebook)
    social.facebook = {}

social.facebook.postMessage = function(msg){
  return JSON.parse(social.facebook.post("https://graph.facebook.com/me/feed",{'message' : msg},{},true));
}

social.facebook.getMessage = function(lastId){
  var ret =  JSON.parse(social.facebook.get('https://graph.facebook.com/me/feed' ))
  if (!lastId) return ret;
  var result = {}
  result.data = []
  var i;
  for(i=0;i<ret.data.length;i++){
    log(lastId + " == " + ret.data[i].id)
    if (lastId != ret.data[i].id)
      result.data.push(ret.data[i]);
   else return result;
  }
  return result;

}

social.facebook.saveLastMessage = function(lastId){
  var type = typeof lastId;
  var id;
  if (type == 'string') id = lastId;
  else if (lastId.id) id = lastId.id;
  JSON.save("lastMessage",id)
}

social.facebook.getLastMessage = function(){
  try {return JSON.load("lastMessage");}
  catch(e){}
  return "";
}

social.facebook.getFriends = function(){
  var list = social.facebook.FQL("SELECT uid,first_name,middle_name,last_name,sex,birthday_date FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) OR uid = me() ")
  var i;
  var ret = {};
  for(i=0;i<list.length;i++){
    ret[list[i].uid] = list[i]  
  }
  return ret;
}

social.facebook.getStream = function(timestamp){
  if (!timestamp || timestamp == "") timestamp = 0;
  var ret= social.facebook.FQL("SELECT post_id,app_id,updated_time,created_time,attribution,actor_id,target_id,message,app_data,action_links,attachment,comments,likes FROM stream WHERE filter_key in (SELECT filter_key FROM stream_filter WHERE uid=me() AND type='newsfeed') AND actor_id<>me() AND is_hidden = 0 AND created_time > "+ timestamp +" LIMIT 20")
  log("stream "+JSON.stringify(ret))
  return ret
}

social.facebook.getWall = function(timestamp){
  if (!timestamp || timestamp == "") timestamp = 0;
  var ret= social.facebook.FQL("SELECT post_id,app_id,updated_time,created_time,attribution,actor_id,target_id,message,app_data,action_links,attachment,comments,likes FROM stream WHERE filter_key = 'others' AND source_id = me() AND is_hidden = 0 AND created_time > "+ timestamp +" LIMIT 20")
  log("wall "+JSON.stringify(ret))
  return ret
}

social.facebook.getName = function(){
  var ret= social.facebook.FQL("SELECT name,username FROM profile WHERE id = me()")
  log("name "+JSON.stringify(ret))
  return ret
}

social.facebook.getUserInfo = function(uid){
  return JSON.parse(social.facebook.get('https://graph.facebook.com/'+uid ))
}



social.facebook.saveLastStream = function(ts){
  JSON.save("lastStream",ts)
}

social.facebook.getLastStream = function(){
  try {return JSON.load("lastStream");}
  catch(e){}
  return "";
}


/*
social.facebook.getWall = function(date){
  var ret = JSON.parse(social.facebook.get('https://graph.facebook.com/me/feed' ))
  //log("wall "+JSON.stringify(ret))
  var result = {}
  result.data = {}
  var i;
  for(i=0;i<ret.data.length;i++){
    if (date < ret.data[i].created_time)
      result.data.push(ret.data[i]);
  }

  return result;
}
*/
social.facebook.saveLastWall = function(ts){
  JSON.save("lastWall",ts)
}

social.facebook.getLastWall = function(){
  try {return JSON.load("lastWall");}
  catch(e){}
  return "";
}

social.facebook.postPhoto = function(photo,msg,album){
  if (!album) album ='me'; 
  return JSON.parse(social.facebook.post("https://graph.facebook.com/"+album+"/photos",{'message' : msg, 'graph_url' : photo },{},true))
}

social.facebook.FQL = function(req){
 return JSON.parse(social.facebook.get("https://api.facebook.com/method/fql.query?format=JSON&query="+encodeURIComponent(req)) )
}

social.facebook.friendRequest = function(){
  return ret = social.facebook.FQL("SELECT name FROM user WHERE uid IN (SELECT uid_from FROM friend_request WHERE uid_to=me())")
}

social.facebook.getMail = function(timestamp){
  if (timestamp == "" ) timestamp = '1';
  var thread = social.facebook.FQL("SELECT thread_id,subject,snippet,snippet_author,updated_time,unread FROM thread WHERE folder_id = 0 and unread != 0 and updated_time > "+ timestamp +" LIMIT 20")
  log("thread "+JSON.stringify(thread))
  if (!thread.length || thread.error_code) return thread;

  var threadid = thread[0].thread_id
  var i,j;
  for(i=1;i<thread.length;i++){
    threadid += ","+ thread[i].thread_id    
  }
  log("uidList : "+uidList)
  log("threadid : "+threadid)
  var messages = social.facebook.FQL("SELECT message_id,thread_id,author_id,body,created_time,attachment FROM message WHERE created_time > "+ timestamp +" AND thread_id IN ("+threadid+") ")
  log("messages "+JSON.stringify(messages))
  if(!messages.length || messages.error_code) return messages;

  var uidList = messages[0].author_id
  for(i=1;i<messages.length;i++){
    uidList += ","+ messages[i].author_id 
  }
  for(i=0;i<thread.length;i++){
    thread[i].messages = []
  }
    log("thread "+JSON.stringify(thread))
  for(j=0;j<messages.length;j++){
    for(i=0;i<thread.length;i++){  
      if (thread[i].thread_id == messages[j].thread_id){ 
        log(" thread[i].messages " + i + " " + thread[i].messages)  
        thread[i].messages[thread[i].messages.length] = messages[j];
        log(" thread[i].messages " + i + " " + thread[i].messages)   
      }        
    }
  }

  return thread;
}



social.facebook.getLastMail = function(){
  try {return JSON.load("lastMail");}
  catch(e){}
  return "";
}

social.facebook.saveLastMail = function(obj){
  JSON.save("lastMail",obj)
}

social.facebook.getNotification = function(timestamp){
  if (!timestamp || timestamp == "") timestamp = 1;
  var notif = social.facebook.FQL("SELECT created_time,notification_id, sender_id, title_text, body_text, href FROM notification WHERE recipient_id=me() AND created_time > "+ timestamp + " LIMIT 20" )
      log("notif "+JSON.stringify(notif))
  return notif
}

social.facebook.getLastNotification = function(){
  try {return JSON.load("lastNotification");}
  catch(e){}
  return "";
}

social.facebook.saveLastNotification = function(obj){
  JSON.save("lastNotification",obj)
}
