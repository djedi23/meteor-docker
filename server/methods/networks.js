var cleanDot = function(network) {
  var o = {};
  if (network.Options)
    _.each(_.pairs(network.Options),
      function(p) {
        p[0] = p[0].replace(/\./g, 'U+FF0E');
        o[p[0]] = p[1];
      });
  network.Options = o;


  if (network.Labels)
    _.each(_.pairs(network.Labels),
      function(p) {
        p[0] = p[0].replace(/\./g, 'U+FF0E');
        o[p[0]] = p[1];
      });
  network.Labels = o;


  return network;
}


listNetworks = function() {
  _.each(_.pairs(docker), function(dockerHost) {
    var hostId = dockerHost[0];
    var docker = dockerHost[1];
    if (ensureApi(hostId, '1.21')) {
      var list = {};
      _.each(Networks.find({
        _host: hostId
      }, {
        fields: {
          Name: 1
        }
      }).fetch(),
        function(e) {
          list[e.Name] = 1;
        });

      docker.listNetworks(Meteor.bindEnvironment(
        function(err, networks) {
          if (err)
            return;

          if (!networks)
            return;

          networks.forEach(function(network) {
            network._host = hostId;
            network = cleanDot(network);

            var u = Networks.upsert({
              _host: hostId,
              Name: network.Name
            }, {
              $set: network
            });
            delete list[network.Name];
          });
          Networks.remove({
            Name: {
              $in: _.keys(list)
            }
          });
          NetworksInspect.remove({
            Name: {
              $in: _.keys(list)
            }
          });
        }));
    }
  });
};


Meteor.methods({
  'network.list': function() {
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'network.list']))
      throw new Meteor.Error(403, "Not authorized to list networks");
    if (docker == undefined)
      return null;

    listNetworks();
  },
  'network.create': function(opts) {
    check(opts, networkCreateSchemas);
    check(opts.host, checkHostId);
    if (ensureApi(opts.host, "1.21")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'network.create']))
        throw new Meteor.Error(403, "Not authorized to create a network");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();

        docker[opts.host].createNetwork(opts, function(err, result) {
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
  'network.remove': function(opts) {
    check(opts, {
      host: checkHostId,
      Name: String
    });
    if (ensureApi(opts.host, "1.21")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'network.remove']))
        throw new Meteor.Error(403, "Not authorized to remove a network");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var network = docker[opts.host].getNetwork(opts.Name);
        network.remove(opts, function(err, result) {
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
  'network.inspect': function(opts) {
    check(opts, {
      host: checkHostId,
      Name: String
    });
    if (ensureApi(opts.host, "1.21")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'network.inspect']))
        throw new Meteor.Error(403, "Not authorized to inspect a network");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var network = docker[opts.host].getNetwork(opts.Name);
        network.inspect(Meteor.bindEnvironment(function(err, result) {
                          if (err) {
                            myFuture.throw(err.reason);
                          }
                          else {
                            result._host = opts.host;
                            result = cleanDot(result);
                            NetworksInspect.upsert({
                              _host: opts.host,
                              Name: result.Name
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
  'network.connect': function(opts) {
    check(opts, {
      host: checkHostId,
      network: String,
      container: String
    });
    if (ensureApi(opts.host, "1.21")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'network.connect']))
        throw new Meteor.Error(403, "Not authorized to connect network");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var network = docker[opts.host].getNetwork(opts.network);
        network.connect({
          Container: opts.container
        }, function(err, result) {
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
  'network.disconnect': function(opts) {
    check(opts, {
      host: checkHostId,
      network: String,
      container: String
    });
    if (ensureApi(opts.host, "1.21")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'network.connect']))
        throw new Meteor.Error(403, "Not authorized to connect network");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var network = docker[opts.host].getNetwork(opts.network);
        network.disconnect({
          Container: opts.container
        }, function(err, result) {
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
  }
});


const LISTS_METHODS = _.pluck([
  'network.list',
  'network.create',
  'network.remove',
  'network.inspect',
  'network.connect',
  'network.disconnect'
], 'name');
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(LISTS_METHODS, name);
  },
  connectionId() { return true; }
}, 5, 1000);
