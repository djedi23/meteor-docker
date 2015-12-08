hostEnabled = function() {
  return Hosts.find({
    disabled: 'disabled'
  }).map(function(h) {
    return h._id;
  });
};

hostEnabledCriteria = function() {
  return {
    _host: {
      $not: {
        $in: hostEnabled()
      }
    }
  };
};

Meteor.publishComposite("images", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'image.list']))
      return null;
    return Images.find(hostEnabledCriteria());
  }
});


Meteor.publishComposite("containers", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'container.list']))
      return null;
    var containers = Containers.find(hostEnabledCriteria());

    return containers;
  },
  children: [
    {
      find: function(container) {
        return Images.find({
          _host: container._host,
          RepoTags: container.Image
        });
      }
    }
  ]
});


Meteor.publishComposite("imageInspect", function(hostId, imgId) {
  return {
    find: function() {
      check(hostId, String);
      check(imgId, checkDockerId);
      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'image.view']))
        return null;

      return ImagesInspect.find({
        _host: hostId,
        Id: imgId
      });
    }
  }
});

Meteor.publishComposite("containerInspect", function(hostId, containerId) {
  return {
    find: function() {
      check(hostId, String);
      check(containerId, checkDockerId);
      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'container.view']))
        return null;

      return ContainersInspect.find({
        _host: hostId,
        Id: containerId
      });
    },
    children: [
      {
        find: function(container) {
          if (modules.stats === undefined || modules.stats.active === undefined || !modules.stats.active)
            return;
          return ContainersStats.find({
            _host: container._host,
            Id: container.Id
          }, {
            fields: modules.stats.fields,
            sort: {
              read: -1
            },
            limit: 60
          });
        }
      },
      {
        find: function(container) {
          if (container.HostConfig && container.HostConfig.Links) {
            var links = _.map(container.HostConfig.Links,
              function(link) {
                return link.split(':')[0];
              });
            return ContainersInspect.find({
              Name: {
                $in: links
              }
            }, {
              fields: {
                _host: 1,
                Id: 1,
                Name: 1
              }
            });
          }
          return null;
        }
      },
      {
        find: function(container) {
          var query = {};
          query['Containers.' + container.Id] = {
            $exists: true
          };
          return NetworksInspect.find(query);
        }
      }
    ]
  }
});

Meteor.publishComposite("hosts", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'host.view']))
      return null;
    return Hosts.find();
  }
});

Meteor.publishComposite("hostsStatus", {
  find: function() {
    //     if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','host.view']))
    //         return null;
    return Hosts.find({}, {
      fields: {
        status: 1,
        Id: 1,
        version: 1
      }
    });
  }
});


Meteor.publishComposite("volumes_list", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'volume.list']))
      return null;
    return Volumes.find();
  }
});

Meteor.publishComposite("volume_inspect", function(hostId, name) {
  return {
    find: function() {
      check(hostId, String);
      check(name, String);

      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'volume.inspect']))
        return null;
      return VolumesInspect.find({
        _host: hostId,
        Name: name
      });
    }
  }
});

Meteor.publishComposite("networks_list", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'network.list']))
      return null;
    return Networks.find();
  }
});

Meteor.publishComposite("network_inspect", function(hostId, name) {
  return {
    find: function() {
      check(hostId, String);
      check(name, String);

      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'network.inspect']))
        return null;
      return NetworksInspect.find({
        _host: hostId,
        Name: name
      });
    }
  }
});
