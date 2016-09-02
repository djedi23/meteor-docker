import Future from 'fibers/future';


execDetails = function(hostId, exec){
  check(hostId, checkHostId);

  if (docker[hostId] === undefined)
    return;
  if (exec.inspect){
    var future = new Future();
    exec.inspect(Meteor.bindEnvironment(function (err, exec) {
      if (err){
	console.log(err);
	future.throw(err);
      }

      var stub = {};
      stub['execs.'+exec.ID]= exec;
      var u = ContainersInspect.upsert({_host:hostId, Id:exec.ContainerID}, {$set: stub});
      exec._host = hostId;
      future.return(exec);
    }));
    return future.wait();
  }
  return exec;
};

Meteor.methods({
  'container.exec.create': function(opts,a,b){
    check(opts,containerExecCreateSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','exec.create']))
      throw new Meteor.Error(403, "Not authorized to create container exec");

    var host = opts.host;
    var detachKeysSeq = randomSeq(16);
    opts.detachKeys=toDetachKeys(detachKeysSeq);
    var future = new Future();
    var exec = containerCall(opts, 'exec');
    if (exec){
      exec.start({Detach: opts.Detach, Tty:opts.Tty, stdin: opts.AttachStdin},Meteor.bindEnvironment(function(err, stream){
	if (err) {
	  console.log(err);
	  future.throw(err);
	}
	//	stream.pipe(process.stdout);
	var wsKey = streamToWS(stream,detachKeysSeq);

	var stub = {};
	stub['execs.'+exec.id] = {};
	ContainersInspect.upsert({_host:host, Id:opts.id}, {$set: stub});
	var e = execDetails(host, exec);
	e.key = wsKey;
	future.return(e);
      }));
      return future.wait();
    }
  },
  'exec.resize':function(hostId, execId,w,h){
    check(hostId, checkHostId);
    check(execId, checkDockerId);
    check(w, Number);
    check(h, Number);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','exec.create']))
      throw new Meteor.Error(403, "Not authorized to resize exec");

    var myFuture = new Future();
    var exec = docker[hostId].getExec(execId);
    if (exec){
      exec.resize({h:h,w:w},function (err, stream) {
	if (err){
	  console.log("exec resize",err);
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
  },
  'exec.inspect':function(hostId, execId){
    check(hostId, checkHostId);
    check(execId, checkDockerId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','exec.create']))
      throw new Meteor.Error(403, "Not authorized to resize exec");

    var exec = docker[hostId].getExec(execId);
    if (exec){
      try{
	execDetails(hostId,exec);
      } catch (err){
	throw new Meteor.Error('docker', err.toString());
      }
    }
  }
});
