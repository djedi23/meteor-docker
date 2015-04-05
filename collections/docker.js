
Containers = new Mongo.Collection('docker.containers');
ContainersInspect = new Mongo.Collection('docker.containers.inspect');
ContainersStats = new Mongo.Collection('docker.containers.stats');
Hosts = new Mongo.Collection('docker.hosts');
Images = new Mongo.Collection('docker.images');
ImagesInspect = new Mongo.Collection('docker.images.inspect');

modules.collections.Containers = Containers;
modules.collections.ContainersInspect = ContainersInspect;
modules.collections.ContainersStats = ContainersStats;
modules.collections.Hosts = Hosts;
modules.collections.Images = Images;
modules.collections.ImagesInspect = ImagesInspect;


Meteor.users.deny({
    insert: function(userId, doc) {
	return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function() {
	return true;
    }
});


Containers.deny({
    insert: function(userId, doc) {
	return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function() {
	return true;
    }
});
ContainersInspect.deny({
    insert: function(userId, doc) {
	return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function() {
	return true;
    }
});
ContainersStats.deny({
    insert: function(userId, doc) {
	return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function() {
	return true;
    }
});

// Hosts.deny({
//     insert: function(userId, doc) {
// 	return true;
//     },
//     update: function(userId, doc, fieldNames, modifier) {
//         return true;
//     },
//     remove: function() {
// 	return true;
//     }
// });

Images.deny({
    insert: function(userId, doc) {
	return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function() {
	return true;
    }
});

ImagesInspect.deny({
    insert: function(userId, doc) {
	return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function() {
	return true;
    }
});
