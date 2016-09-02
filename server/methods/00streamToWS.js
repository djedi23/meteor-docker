import sockjs from 'sockjs';

import Fiber from 'fibers';
import Future from 'fibers/future';
import { Random } from 'meteor/random';

var detachCodes = [];
for (i=1; i<27; i++){
  detachCodes.push({code:i, key:'ctrl-'+String.fromCharCode(96+i)});
  detachCodes.push({code:96+i, key:String.fromCharCode(96+i)});
  detachCodes.push({code:64+i, key:String.fromCharCode(64+i)});
}
toDetachKeys = (seq) => (_.map(seq, (n)=>(detachCodes[n].key)).join(','));
var toDetachCharCodes = (seq) => (_.map(seq, (n)=>(detachCodes[n].code)));
randomSeq = (n)=>(_.map(_.range(n),()=>(Math.floor(Math.random()*detachCodes.length))));


var uniqReferences = {};


streamToWS = function(stream,detachKeysSeq){
  var wsKey = Random.id();
  var ws = sockjs.createServer({
    prefix: '/attach/'+ wsKey,
    log: ()=>{}
  });
  uniqReferences[wsKey] = true;
  ws.on('connection', function(conn) {
    if (!uniqReferences[wsKey]){
      conn.write('Duplicate connection');
      conn.close();
      console.log('*Duplicate connection to the attach websocket*');
      return;
    }
    delete uniqReferences[wsKey];
    stream.on('data', function(message){
      conn.write(message);
    });
    stream.on('end', function(){
      conn.close();
    });

    conn.on('data', function(message) {
      //	      console.log(">>", message.charCodeAt(0));
      stream.write(message);
    });
    conn.on('close', function() {
      if (detachKeysSeq)
	Fiber(function(){
	  var fiber = Fiber.current;
	  _.each(toDetachCharCodes(detachKeysSeq),(c,i)=>{
	    stream.write(String.fromCharCode(c), ()=>{fiber.run();});
	    Fiber.yield();
	  });
	  stream.end();
	  //		WebApp.httpServer.removeAllListeners('request');
	  //		WebApp.httpServer.removeAllListeners('upgrade');
	}).run();
    });
  });
  ws.installHandlers(WebApp.httpServer);
  return(wsKey);
};
