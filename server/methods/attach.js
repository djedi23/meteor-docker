import sockjs from 'sockjs';

import Fiber from 'fibers';
import Future from 'fibers/future';
import { Random } from 'meteor/random';

// TODO: gestion de this.userId

var detachCodes = [];
for (i=1; i<27; i++){
  detachCodes.push({code:i, key:'ctrl-'+String.fromCharCode(96+i)});
  detachCodes.push({code:96+i, key:String.fromCharCode(96+i)});
  detachCodes.push({code:64+i, key:String.fromCharCode(64+i)});
}
var toDetachKeys = (seq) => (_.map(seq, (n)=>(detachCodes[n].key)).join(','));
var toDetachCharCodes = (seq) => (_.map(seq, (n)=>(detachCodes[n].code)));
var randomSeq = (n)=>(_.map(_.range(n),()=>(Math.floor(Math.random()*detachCodes.length))));

var uniqReferences = {};

Meteor.methods({
  'container.attach':function(hostId, containerId){
    check(hostId, checkHostId);
    check(containerId, checkDockerId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.attach']))
      throw new Meteor.Error(403, "Not authorized to view container");

    var myFuture = new Future();
    var container = docker[hostId].getContainer(containerId);
    if (container){
      var detachKeysSeq = randomSeq(16);
      container.attach({stream:true,stdin:true,stdout:true,detachKeys:toDetachKeys(detachKeysSeq)},function (err, stream) {
	if (err){
	  console.log("attach",err);
	  myFuture.throw(err);
	} else{
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
	  myFuture.return(wsKey);
	}
      });
      try{
	return myFuture.wait();
      } catch (err){
	throw new Meteor.Error('docker', err.toString());
      }
    }
  },
  'container.resize':function(hostId, containerId,w,h){
    check(hostId, checkHostId);
    check(containerId, checkDockerId);
    check(w, Number);
    check(h, Number);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.attach']))
      throw new Meteor.Error(403, "Not authorized to resize container");

    var myFuture = new Future();
    var container = docker[hostId].getContainer(containerId);
    if (container){
      container.resize({h:h,w:w},function (err, stream) {
	if (err){
	  console.log("resize",err);
	  myFuture.throw(err);
	} else{
	  myFuture.return();
	}
      });
      try{
	return myFuture.wait();
      } catch (err){
	throw new Meteor.Error('docker', err.toString());
      }
    }
  }
});
