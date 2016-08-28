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

Meteor.publishComposite("images", function(limit, hostFilter, imageFilter){
  return {
    find: function() {
      check(limit,Number);
      check(hostFilter,Match.Maybe(String));
      check(imageFilter,Match.Maybe(String));
      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'image.list']))
	return null;
      var filters = imageFilters(hostFilter,imageFilter);
      return Images.find({$and: [hostEnabledCriteria(), filters]},{sort: {Created: -1}, limit: limit});
    }
  };
});


Meteor.publishComposite("containers", function(limit, hostFilter, containerFilter, containerImgFilter){
  return {
    find: function() {
      check(limit,Number);
      check(hostFilter,Match.Maybe(String));
      check(containerFilter,Match.Maybe(String));
      check(containerImgFilter,Match.Maybe(String));
      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'container.list']))
	return null;

      var filters = containerFilters(hostFilter, containerFilter, containerImgFilter);
      var containers = Containers.find({$and: [filters,hostEnabledCriteria()]}, {sort: {Created: -1}, limit: limit});

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
  };
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
        Id: queryImageId(imgId)
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

      fields = {};
      if (!Roles.userIsInRole(this.userId, ['container.logs']))
        fields.logs = 0;
      if (!Roles.userIsInRole(this.userId, ['container.changes']))
        fields.changes = 0;

      return ContainersInspect.find({
        _host: hostId,
        Id: containerId
      },{fields: fields});
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


Meteor.publishComposite("volumes_list",  function(limit, hostFilter){
  return {
    find: function() {
      check(limit,Number);
      check(hostFilter,Match.Maybe(String));
      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'volume.list']))
	return null;
      var filter = {};
      if (hostFilter)
	filter = _.extend(filter,{_host:hostFilter});
      return Volumes.find({$and: [hostEnabledCriteria(), filter]},{sort: {Name: -1}, limit: limit});
    }
  };
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


Meteor.publishComposite("swarms_list", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'swarms.list']))
      return null;
    return Hosts.find({},{fields:{'info.Swarm':1}});
  },
  children: [
    {
      find: function(host){
        return SwarmsInspect.find({host:host._host});
      }
    }
  ]
});


Meteor.publishComposite("nodes_list", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'nodes.list']))
      return null;
    return Nodes.find();
  }
});

Meteor.publishComposite("nodes_inspect", function(hostId, id) {
  return {
    find: function() {
      check(hostId, String);
      check(id, String);

      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'nodes.inspect']))
        return null;
      return NodesInspect.find({
        _host: hostId,
        ID: id
      });
    }
  }
});

Meteor.publishComposite("services_list", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'services.list']))
      return null;
    return Services.find();
  }
});

Meteor.publishComposite("services_inspect", function(hostId, id) {
  return {
    find: function() {
      check(hostId, String);
      check(id, String);

      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'services.inspect']))
        return null;
      return ServicesInspect.find({
        _host: hostId,
        ID: id
      });
    }
  }
});


Meteor.publishComposite("tasks_list", {
  find: function() {
    if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'tasks.list']))
      return null;
    return Tasks.find();
  },
  children: [
    {
      find: function(task){
        return Nodes.find({ID:task.NodeID},{fields:{ID:1,_host:1,'Description.Hostname':1}});
      }
    },
    {
      find: function(task){
        return Services.find({ID:task.ServiceID},{fields:{ID:1,_host:1,'Spec.Name':1}});
      }
    },
    {
      find: function(task){
        return Containers.find({Id:task.Status.ContainerStatus.ContainerID},{fields:{Id:1,_host:1,'Names':1}});
      }
    }
  ]
});

Meteor.publishComposite("tasks_inspect", function(hostId, id) {
  return {
    find: function() {
      check(hostId, String);
      check(id, String);

      if (!Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin', 'tasks.inspect']))
        return null;
      return TasksInspect.find({
        _host: hostId,
        ID: id
      });
    }
  }
});


const LISTS_PUBLISH = _.pluck([
  "images",
  "containers",
  "imageInspect",
  "containerInspect",
  "hosts",
  "hostsStatus",
  "hostsStatus",
  "volumes_list",
  "volume_inspect",
  "networks_list",
  "network_inspect",
  "swarms_list",
  "nodes_list",
  "nodes_inspect",
  "services_list",
  "services_inspect",
  "tasks_list",
  "tasks_inspect",
], 'name');
DDPRateLimiter.addRule({
  type:'subscription',
  name(name) {
    return _.contains(LISTS_PUBLISH, name);
  },
  connectionId() { return true; }
}, 5, 1000);
