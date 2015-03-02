
Meteor.publish("images", function(){
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','image.list']))
        return null;
    return Images.find();
});


Meteor.publish("containers", function(){
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','container.list']))
        return null;
    var containers =  Containers.find();
    
    return [containers,
            Images.find()];
});


Meteor.publish("imageInspect", function(hostId, imgId){
    check(hostId, String);
    check(imgId, checkDockerId);
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','image.view']))
        return null;

    return ImagesInspect.find({_host: hostId, Id:imgId});
});

Meteor.publish("containerInspect", function(hostId, containerId){
    check(hostId, String);
    check(containerId, checkDockerId);
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','container.view']))
        return null;

    return ContainersInspect.find({_host:hostId, Id:containerId});
});

Meteor.publish("hosts", function(){
    if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','host.view']))
        return null;
    return Hosts.find();
});

Meteor.publish("hostsStatus", function(){
//     if (! Roles.userIsInRole(Meteor.users.findOne(this.userId), ['admin','host.view']))
//         return null;
    return Hosts.find({},{fields:{status:1, Id:1, version:1}});
});
