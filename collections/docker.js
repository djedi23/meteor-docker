
Containers = new Mongo.Collection('docker.containers');
ContainersInspect = new Mongo.Collection('docker.containers.inspect');
ContainersStats = new Mongo.Collection('docker.containers.stats');
Hosts = new Mongo.Collection('docker.hosts');
Images = new Mongo.Collection('docker.images');
ImagesInspect = new Mongo.Collection('docker.images.inspect');
Volumes = new Mongo.Collection('docker.volumes');
VolumesInspect = new Mongo.Collection('docker.volumes.inspect');
Networks = new Mongo.Collection('docker.networks');
NetworksInspect = new Mongo.Collection('docker.networks.inspect');
Swarms = new Mongo.Collection('docker.swarms');
SwarmsInspect = new Mongo.Collection('docker.swarms.inspect');
Nodes = new Mongo.Collection('docker.nodes');
NodesInspect = new Mongo.Collection('docker.nodess.inspect');
Services = new Mongo.Collection('docker.services');
ServicesInspect = new Mongo.Collection('docker.services.inspect');
Tasks = new Mongo.Collection('docker.tasks');
TasksInspect = new Mongo.Collection('docker.tasks.inspect');



modules.collections.Containers = Containers;
modules.collections.ContainersInspect = ContainersInspect;
modules.collections.ContainersStats = ContainersStats;
modules.collections.Hosts = Hosts;
modules.collections.Images = Images;
modules.collections.ImagesInspect = ImagesInspect;
modules.collections.Volumes = Volumes;
modules.collections.VolumesInspect = VolumesInspect;
modules.collections.Networks = Networks;
modules.collections.NetworksInspect = NetworksInspect;
modules.collections.Swarms = Swarms;
modules.collections.SwarmsInspect = SwarmsInspect;
modules.collections.Nodes = Nodes;
modules.collections.NodesInspect = NodesInspect;
modules.collections.Services = Services;
modules.collections.ServicesInspect = ServicesInspect;
modules.collections.Tasks = Tasks;
modules.collections.TasksInspect = TasksInspect;


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

Volumes.deny({
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

VolumesInspect.deny({
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

Networks.deny({
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

NetworksInspect.deny({
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

Swarms.deny({
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

SwarmsInspect.deny({
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

Nodes.deny({
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

NodesInspect.deny({
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

Services.deny({
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

ServicesInspect.deny({
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

Tasks.deny({
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

TasksInspect.deny({
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
