
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
          return ContainersStats.find({_host:container._host, Id:container.Id},{sort: {read: -1}, limit:60});
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
