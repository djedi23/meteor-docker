listSwarms = function() {
  Meteor.call('host.details',function(){
    var managers = filterSwarmManager(docker);
    SwarmsInspect.remove({});
    _.each(managers, function(h){
      Meteor.call('swarms.inspect',
        {host:h[0]},
        function(err,res){});
    });

//     SwarmsInspect.find().map(function(swarm){
//       if (! _.detect(managers, function(m){ console.log(m[0] , swarm._id );  return m[0]===swarm._id; }))
//         SwarmsInspect.remove({_id:swarm._id});
//     });
  });
};


Meteor.methods({
  'swarms.init': function(opts) {
    check(opts, swarmsInitSchemas);
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'swarms.init']))
      throw new Meteor.Error(403, "Not authorized to init swarms");
    if (docker == undefined)
      return null;

    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    var swarm = docker[opts.host].swarmInit(opts,function(err, result) {
                  if (err) {
                    console.log(err);
                    myFuture.throw(err);
                  }
                  else {
                    myFuture.return(result);
                  }
                });
    try {
      listSwarms();
      return myFuture.wait();
    }
    catch (err) {
      throw new Meteor.Error('docker', err.toString());
    }

  },
  'swarms.join': function(opts) {
    check(opts, swarmsJoinSchemas);
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'swarms.join']))
      throw new Meteor.Error(403, "Not authorized to join swarms");
    if (docker == undefined)
      return null;

    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    var swarm = docker[opts.host].swarmJoin(opts,function(err, result) {
                  if (err) {
                    console.log(err);
                    myFuture.throw(err);
                  }
                  else {
                    myFuture.return(result);
                  }
                });
    try {
      listSwarms();
      return myFuture.wait();
    }
    catch (err) {
      throw new Meteor.Error('docker', err.toString());
    }

  },
  'swarms.update': function(opts) {
    check(opts, swarmsUpdateSchemas);
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'swarms.update']))
      throw new Meteor.Error(403, "Not authorized to update swarms");
    if (docker == undefined)
      return null;

    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    var swarm = docker[opts.host].swarmUpdate(opts,function(err, result) {
                  if (err) {
                    console.log(err);
                    myFuture.throw(err);
                  }
                  else {
                    myFuture.return(result);
                  }
                });
    try {
      listSwarms();
      return myFuture.wait();
    }
    catch (err) {
      throw new Meteor.Error('docker', err.toString());
    }

  },
  'swarms.leave': function(opts) {
    check(opts, {
      host: checkHostId
    });
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'swarms.leave']))
      throw new Meteor.Error(403, "Not authorized to leave swarms");
    if (docker == undefined)
      return null;

    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    var swarm = docker[opts.host].swarmLeave(function(err, result) {
                  if (err) {
                    console.log(err);
                    myFuture.throw(err);
                  }
                  else {
                    myFuture.return(result);
                  }
                });
    try {
      listSwarms();
      return myFuture.wait();
    }
    catch (err) {
      throw new Meteor.Error('docker', err.toString());
    }

  },
  'swarms.list': function(opts) {
    //    if (ensureApi(opts.host, "1.24")) {
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'swarms.list']))
      throw new Meteor.Error(403, "Not authorized to list swarms");
    if (docker == undefined)
      return null;

    listSwarms();
    //    }
  },
  'swarms.inspect': function(opts) {
    check(opts, {
      host: checkHostId
    });
    if (ensureApi(opts.host, "1.24")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'swarms.inspect']))
        throw new Meteor.Error(403, "Not authorized to inspect a swarms");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var swarm = docker[opts.host].swarmInspect(
          Meteor.bindEnvironment(function(err, result) {
            if (err) {
              console.log( err);
              myFuture.throw(err);
            }
            else {
              result._host = opts.host;
              //            result = cleanDot(result);
              SwarmsInspect.upsert({
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
  'swarms.list',
  'swarms.inspect'
], 'name');
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(LISTS_METHODS, name);
  },
  connectionId() { return true; }
}, 5, 1000);
