listTasks = function() {
  _.each(filterSwarmManager(docker), function(dockerHost) {
    var hostId = dockerHost[0];
    var docker = dockerHost[1];
    if (ensureApi(hostId, '1.24')) {
      var list = {};
      _.each(Tasks.find({
	_host: hostId
      }, {
	fields: {
	  ID: 1
	}
      }).fetch(),
	function(e) {
	  list[e.ID] = 1;
	});

      docker.listTasks(Meteor.bindEnvironment(
	function(err, tasks) {
	  if (err) {
	    console.log(err);
	    return;
	  }

	  if (!tasks)
	    return;

	  tasks.forEach(function(task) {
	    task._host = hostId;
	    //           node = cleanDot(node);

	    var u = Tasks.upsert({
	      _host: hostId,
	      ID: task.ID
	    }, {
	      $set: task
	    });
	    delete list[task.ID];
	  });
	  Tasks.remove({
	    ID: {
	      $in: _.keys(list)
	    }
	  });
	  TasksInspect.remove({
	    ID: {
	      $in: _.keys(list)
	    }
	  });
	}));
    }
  });
};


Meteor.methods({
  'tasks.list': function() {
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'tasks.list']))
      throw new Meteor.Error(403, "Not authorized to list tasks");
    if (docker == undefined)
      return null;

    listTasks();
  },
  'tasks.inspect': function(opts) {
    check(opts, {
      host: checkHostId,
      ID: String
    });
    if (ensureApi(opts.host, "1.24")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'tasks.inspect']))
	throw new Meteor.Error(403, "Not authorized to inspect a tasks");

      if (opts.host) {
	Future = Npm.require('fibers/future');
	var myFuture = new Future();
	var task = docker[opts.host].getTask(opts.ID);
	task.inspect(Meteor.bindEnvironment(function(err, result) {
                       if (err) {
                         myFuture.throw(err.reason);
                       }
                       else {
                         result._host = opts.host;
                         //            result = cleanDot(result);
                         TasksInspect.upsert({
                           _host: opts.host,
                           ID: result.ID
                         }, {
                           $set: result
                         });
                         myFuture.return(result);
                       }
                     }));
	try {
	  return myFuture.wait();
	}
	catch (err) {
	  throw new Meteor.Error('docker', err.toString());
	}
      }
    }
  }
});


const LISTS_METHODS = _.pluck([
  'tasks.list',
  'tasks.inspect'
], 'name');
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(LISTS_METHODS, name);
  },
  connectionId() { return true; }
}, 5, 1000);
