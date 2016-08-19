listServices = function() {
  _.each(filterSwarmManager(docker), function(dockerHost) {
    var hostId = dockerHost[0];
    var docker = dockerHost[1];
    if (ensureApi(hostId, '1.24')) {
      var list = {};
      _.each(Services.find({
        _host: hostId
      }, {
        fields: {
          ID: 1
        }
      }).fetch(),
        function(e) {
          list[e.ID] = 1;
        });

      docker.listServices(Meteor.bindEnvironment(
        function(err, services) {
          if (err) {
            console.log(err);
            return;
          }

          if (!services)
            return;

          services.forEach(function(node) {
            node._host = hostId;
            //           node = cleanDot(node);

            var u = Services.upsert({
              _host: hostId,
              ID: node.ID
            }, {
              $set: node
            });
            delete list[node.ID];
          });
          Services.remove({
            ID: {
              $in: _.keys(list)
            }
          });
          ServicesInspect.remove({
            ID: {
              $in: _.keys(list)
            }
          });
        }));
    }
  });
};


Meteor.methods({
  'services.list': function() {
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'services.list']))
      throw new Meteor.Error(403, "Not authorized to list services");
    if (docker == undefined)
      return null;

    listServices();
  },
  'services.inspect': function(opts) {
    check(opts, {
      host: checkHostId,
      ID: String
    });
    if (ensureApi(opts.host, "1.24")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'services.inspect']))
        throw new Meteor.Error(403, "Not authorized to inspect a services");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var services = docker[opts.host].getService(opts.ID);
        services.inspect(Meteor.bindEnvironment(function(err, result) {
                           if (err) {
                             myFuture.throw(err.reason);
                           }
                           else {
                             result._host = opts.host;
                             //            result = cleanDot(result);
                             ServicesInspect.upsert({
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
  },
  'services.remove': function(opts) {
    check(opts, {
      host: checkHostId,
      ID: String
    });
    if (ensureApi(opts.host, "1.24")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'services.remove']))
        throw new Meteor.Error(403, "Not authorized to remove a service");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var service = docker[opts.host].getService(opts.ID);
        service.remove(function(err, result) {
          if (err) {
            myFuture.throw(err.reason);
          }
          else
            myFuture.return(result);
        });
        try {
          return myFuture.wait();
        }
        catch (err) {
          throw new Meteor.Error('docker', err.toString());
        }
      }
    }
  },
  'services.create': function(opts) {
    check(opts, servicesCreateSchemas);
    check(opts.host, checkHostId);
    if (ensureApi(opts.host, "1.24")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'services.create']))
        throw new Meteor.Error(403, "Not authorized to create a services");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();

        docker[opts.host].createService(opts, function(err, result) {
          if (err) {
            console.log( err);
            myFuture.throw(err.reason);
          }
          else
            myFuture.return(result);
        });
        try {
          return myFuture.wait();
        }
        catch (err) {
          throw new Meteor.Error('docker', err.toString());
        }
      }
    }
  },
  'services.update': function(opts) {
    check(opts, servicesCreateSchemas);
    check(opts.host, checkHostId);
    if (ensureApi(opts.host, "1.24")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'services.update']))
        throw new Meteor.Error(403, "Not authorized to update a services");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var service = docker[opts.host].getService(opts.ID);
        service.update(opts, function(err, result) {
          if (err) {
            console.log( err);
            myFuture.throw(err.reason);
          }
          else
            myFuture.return(result);
        });
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
  'services.list',
  'services.inspect',
  'services.remove',
  'services.create',
  'services.update'
], 'name');
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(LISTS_METHODS, name);
  },
  connectionId() { return true; }
}, 5, 1000);
