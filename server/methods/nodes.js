listNodes = function() {
  _.each(_.pairs(docker), function(dockerHost) {
    var hostId = dockerHost[0];
    var docker = dockerHost[1];
    if (ensureApi(hostId, '1.24')) {
      var list = {};
      _.each(Nodes.find({
          _host: hostId
        }, {
          fields: {
            ID: 1
          }
        }).fetch(),
        function(e) {
          list[e.ID] = 1;
        });

      docker.listNodes(Meteor.bindEnvironment(
        function(err, nodes) {
          if (err) {
            console.log(err);
            return;
          }

          if (!nodes)
            return;

          nodes.forEach(function(node) {
            node._host = hostId;
 //           node = cleanDot(node);

            var u = Nodes.upsert({
              _host: hostId,
              ID: node.ID
            }, {
              $set: node
            });
            delete list[node.ID];
          });
          Nodes.remove({
            ID: {
              $in: _.keys(list)
            }
          });
          NodesInspect.remove({
            ID: {
              $in: _.keys(list)
            }
          });
        }));
    }
  });
};


Meteor.methods({
  'nodes.list': function() {
    if (!Roles.userIsInRole(Meteor.user(), ['admin', 'nodes.list']))
      throw new Meteor.Error(403, "Not authorized to list nodes");
    if (docker == undefined)
      return null;

    listNodes();
  },
  'nodes.inspect': function(opts) {
    check(opts, {
      host: checkHostId,
      ID: String
    });
    if (ensureApi(opts.host, "1.24")) {
      if (!Roles.userIsInRole(Meteor.user(), ['admin', 'nodes.inspect']))
        throw new Meteor.Error(403, "Not authorized to inspect a nodes");

      if (opts.host) {
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        var nodes = docker[opts.host].getNode(opts.ID);
        nodes.inspect(Meteor.bindEnvironment(function(err, result) {
          if (err) {
            myFuture.throw(err.reason);
          }
          else {
            result._host = opts.host;
//            result = cleanDot(result);
            NodesInspect.upsert({
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
  'nodes.list',
  'nodes.inspect',

], 'name');
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(LISTS_METHODS, name);
  },
  connectionId() { return true; }
}, 5, 1000);
