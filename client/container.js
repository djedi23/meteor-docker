Template.containers.helpers({
    ImageId: function(){
        var image = Images.findOne({RepoTags:this.Image});
        if (image)
            return image.Id;
        return undefined;
    },
    Names: function(){
	if (this.Names)
	    if (this.Names.toString().length > 40)
		return this.Names.toString().substring(0,40)+" ...";
	    else
		return this.Names;
        return null;
    },
    NamesFull: function(){
	if (this.Names)
	    return this.Names;
        return null;
    },
    Created: function(){
        if (this.Created)
            return moment.unix(this.Created).fromNow();
        return null;
    },
    IdShort: function(){
        if (this.Id)
            return this.Id.substring(0,12);
        return null;
    },
    hostId: function() {
        var host =  Hosts.findOne(this._host);
        if (host)
            return host.Id;
        return null;
    },
    VirtualSize: function(){
        if (this.VirtualSize)
            return filesize(this.VirtualSize);
        return null;
    },
    haveData: function () {
	return this && this.count() > 0;
    },
    multihost: function() {
        return Hosts.find().count() > 1;
    },
    canPause: function(){
        return /^Up/.test(this.Status) && ! (/Paused/.test(this.Status));
    },
    canUnPause: function(){
        return /Paused/.test(this.Status);
    },
    canRestart: function(){
        return /^Up/.test(this.Status) && ! (/Paused/.test(this.Status));
    },
    canStart: function(){
        return /^Exited/.test(this.Status);
    },
    canKill: function(){
        return /^Up/.test(this.Status);
    },
    canStop: function(){
        return /^Up/.test(this.Status) && ! (/Paused/.test(this.Status));
    }
});

var currentContainer = new ReactiveVar();
actionHandler = function(modalId, method, routeSuccess, notificationMsg, notificationMsg2) {
    return function(e, tpl){
	if (e.button === 1 || e.button === 2){
            tpl.$(modalId+ ' input[name="id"]').val(this.Id);
            tpl.$(modalId+ ' input[name="host"]').val(this._host);
	    tpl.$(modalId).modal();
	    currentContainer.set(this._id);
            $(e.currentTarget).blur();
	    return;
	} else if (e.button === 0){
            var name = this.Name;
            Meteor.call(method, {host:this._host, id: this.Id}, function (error,result) {
                if (error)
                    Notifications.error(notificationMsg, error.reason);
		else
                    Notifications.success(notificationMsg, name+' '+notificationMsg2);
            });
            $(e.currentTarget).blur();
	    if (routeSuccess)
		Router.go(routeSuccess);
        }
    };
};

var events = {
    'mousedown #brm': actionHandler('#containerRemoveModal', 'container.rm', 'containers', 'docker rm', 'removed'),
    'click #bpause': function(e){
        var name = this.Name;
        Meteor.call('container.pause', this._host, this.Id, function (error,result) {
            if (error)
                Notifications.error('docker pause', error.reason);
            else
                Notifications.success('docker pause', name+" paused");
        });
        $(e.currentTarget).blur();
    },
    'click #bunpause': function(e){
        var name = this.Name;
        Meteor.call('container.unpause', this._host, this.Id, function (error,result) {
            if (error)
                Notifications.error('docker unpause', error.reason);
            else
                Notifications.success('docker unpause', name+" unpaused");
        });
        $(e.currentTarget).blur();
    },
    'mousedown #brestart': actionHandler("#containerRestartModal", 'container.restart', null, 'docker restart','restarted'),
    'mousedown #bstart': actionHandler('#containerStartModal', 'container.start', null, 'docker start', 'started'),
    'mousedown #bkill': actionHandler('#containerKillModal', 'container.kill', null, 'docker kill', 'killed'),
    'mousedown #bstop': actionHandler('#containerStopModal', 'container.stop', null, 'docker stop', 'stopped')
};


Template.containers.events(events);


Template.containerInspect.helpers({
    ImageId: function(){
        var image = Images.findOne({RepoTags:this.Image});
        if (image)
            return image.Id;
        return undefined;
    },
    Created: function(){
        return moment.unix(this.Created).fromNow();
    },
    IdShort: function(){
        if (this.Id)
            return this.Id.substring(0,12);
        return undefined;
    },
    command: function(){
        var cmd = this.Path || '';
        if (this.Args)
            cmd += ' '+this.Args.join(' ');
        return cmd;
    },
    ExposedPorts: function(){
        if (this.Config){
            var ports = this.HostConfig.PortBindings || {};
            _.defaults(ports, this.Config.ExposedPorts);
            return _.map(_.pairs(ports),
                        function(e){
                            if (_.isEmpty(e[1]))
                                return e[0];
                            else {
                               return _.map(e[1],
                                      function(p){
                                          return e[0] +'->'+ (p.HostIp?(p.HostIp+':'):'') + p.HostPort;
                                      });
                            }
                        }).join(', ');
        }
        return '-';
    },
    Links: function(){
        if (this.HostConfig && this.HostConfig.Links){
	    return this.HostConfig.Links;
        }
        return '-';
    },
    Binds: function(){
        if (this.HostConfig && this.HostConfig.Binds){
	    return this.HostConfig.Binds;
        }
        return '-';
    },
    haveData: function () {
	return !(!this);
    },
    multihost: function() {
        return Hosts.find().count() > 1;
    },
    hostId: function() {
        var host =  Hosts.findOne(this._host);
        if (host)
            return host.Id;
        return null;
    },
    host: function() {
        return this._host;
    },
    configs: function(){
	if (this.Config){
	    return _.map(_.pairs(this.Config),
			 function(c){
			     return {n:c[0],p:EJSON.stringify(c[1])};
			 });
	}
	return null;
    },
    networkSettings: function(){
	if (this.NetworkSettings){
	    return _.map(_.pairs(this.NetworkSettings),
			 function(c){
			     return {n:c[0],p:EJSON.stringify(c[1])};
			 });
	}
	return null;
    },
    Kind: function(){
	if (this.Kind !== undefined){
	    var map = ['C','A'];
	    return map[this.Kind];
	}
        return null;
    },
    canPause: function(){
	if (this.State)
            return (this.State.Running && !this.State.Paused);
        return undefined;
    },
    canUnPause: function(){
	if (this.State)
            return (this.State.Running && this.State.Paused);
        return undefined;
    },
    canRestart: function(){
	if (this.State)
            return (this.State.Running && !this.State.Paused);
        return undefined;
    },
    canStart: function(){
	if (this.State)
            return !(this.State.Running);
        return undefined;
    },
    canRemove: function(){
	if (this.State)
            return !(this.State.Running);
        return undefined;
    },
    canKill: function(){
	if (this.State)
            return this.State.Running && !this.State.Paused;
        return undefined;
    },
    canStop: function(){
	if (this.State)
            return this.State.Running && !this.State.Paused;
        return undefined;
    },
    canExec: function(){
	if (this.State)
            return this.State.Running && !this.State.Paused;
        return undefined;
    }
});

Template.containerInspect.events(events);

Template.containerCommit.helpers({
    IdShort: function(){
        if (this.Id)
            return this.Id.substring(0,12);
        return null;
    },
    multihost: function() {
        return Hosts.find().count() > 1;
    },
    hostId: function() {
        var host =  Hosts.findOne(this._host);
        if (host)
            return host.Id;
        return null;
    },
    config: function() {
        var config = {};
        config.Id = this.Id;
        config.host = this._host;
        config.Config = this.Config;

        if (Meteor.user() && Meteor.user().emails && Meteor.user().emails.length>0)
            config.author = Meteor.user().emails[0].address;
        return config;
    }
});

Template.containerRename.helpers({
    IdShort: function(){
        if (this.Id)
            return this.Id.substring(0,12);
        return null;
    },
    multihost: function() {
        return Hosts.find().count() > 1;
    },
    hostId: function() {
        var host =  Hosts.findOne(this._host);
        if (host)
            return host.Id;
        return null;
    },
    config: function() {
        var config = {};
        config.id = this.Id;
        config.host = this._host;
        config.Name = this.Names;

        return config;
    }
});


Template.containerExecCreate.helpers({
    IdShort: function(){
        if (this.Id)
            return this.Id.substring(0,12);
        return null;
    },
    multihost: function() {
        return Hosts.find().count() > 1;
    },
    hostId: function() {
        var host =  Hosts.findOne(this._host);
        if (host)
            return host.Id;
        return null;
    },
    config: function() {
        var config = {};
        config.id = this.Id;
        config.host = this._host;

        return config;
    }
});

Template.containerModals.helpers({
    configRemove: function(){
	var self = Containers.findOne({_id: currentContainer.get()});
	if (!self)
	    self = ContainersInspect.findOne({_id: currentContainer.get()});
	if (!self)
	    return null;
	var config = modules.call('container.remove.parameter.config',self, self._host, self.Id);
	if (!config) {
	    config = self;
	}
	return config;
    },
    configStop: function(){
	var self = Containers.findOne({_id: currentContainer.get()});
	if (!self)
	    self = ContainersInspect.findOne({_id: currentContainer.get()});
	if (!self)
	    return null;
	var config = modules.call('container.stop.parameter.config',self, self._host, self.Id);
	if (!config) {
	    config = self;
	}
	return config;
    }
});