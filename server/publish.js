
hostEnabled = function() {
  return Hosts.find({disabled: 'disabled'}).map(function(h){
	   return h._id;
         });
};

hostEnabledCriteria = function() {
  return {_host: {$not: {$in: hostEnabled()}}};
};

Meteor.publishComposite("images", {
  find:function(){
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','image.list']))
      return null;
    return Images.find(hostEnabledCriteria());
  }});


Meteor.publishComposite ("containers", {
  find:function(){
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','container.list']))
      return null;
    var containers =  Containers.find(hostEnabledCriteria());
    
    return containers;
  },
  children: [
    {
      find: function(container){
        return Images.find({_host:container._host, RepoTags:container.Image});
      }
    }
  ]
});


Meteor.publishComposite("imageInspect", function(hostId, imgId){
  return {
    find: function() {
      check(hostId, String);
      check(imgId, checkDockerId);
      if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','image.view']))
        return null;

      return ImagesInspect.find({_host: hostId, Id:imgId});
    }}});

Meteor.publishComposite("containerInspect", function(hostId, containerId){
  return {
    find: function(){
      check(hostId, String);
      check(containerId, checkDockerId);
      if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','container.view']))
        return null;
      
      return ContainersInspect.find({_host:hostId, Id:containerId});
    },
    children: [
      {
        find: function(container) {
          if (modules.stats === undefined || modules.stats.active === undefined || ! modules.stats.active)
            return;
          return ContainersStats.find({_host:container._host, Id:container.Id},{fields: modules.stats.fields,
            sort: {read: -1}, limit:60});
        }
      },
      {
        find: function(container) {
	  if (container.HostConfig && container.HostConfig.Links){
	    var links = _.map(container.HostConfig.Links,
			      function(link){
				return link.split(':')[0];
			      });
	    return ContainersInspect.find({Name: {$in: links}},{fields: {_host:1, Id:1, Name:1}});
	  }
	  return null;
        }
      }
    ]
  }});

Meteor.publishComposite("hosts", {
  find:function(){
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','host.view']))
      return null;
    return Hosts.find();
  }});

Meteor.publishComposite("hostsStatus", {
  find:function(){
    //     if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','host.view']))
    //         return null;
    return Hosts.find({},{fields:{status:1, Id:1, version:1}});
  }});
