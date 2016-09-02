import Future from 'fibers/future';

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
	  myFuture.return(streamToWS(stream,detachKeysSeq));
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
