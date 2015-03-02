Template.images.helpers({
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
    hosts: function() {
	return Hosts.find();
    },
    hostId: function() {
	var host =  Hosts.findOne(this._host);
	if (host)
	    return host.Id;
	return null;
    },
    progress: function(){
	if (this.progressDetail && this.progressDetail.current && this.progressDetail.total)
	    return Math.round((this.progressDetail.current / this.progressDetail.total) *100);
	return null;
    },
    progressStart: function(){
	if (this.progressDetail && this.progressDetail.start)
	    return moment.unix(this.progressDetail.start).fromNow();
	return null;
    }
});

Template.imageInspect.helpers({
    Created: function(){
	return moment.unix(this.Created).fromNow();
    },
    IdShort: function(){
	if (this.Id)
	    return this.Id.substring(0,12);
	return null;
    },
    CreatedByShort: function(){
	if (this.CreatedBy)
	    return this.CreatedBy.substring(0,32);
	return null;
    },
    Size: function(){
	if (this.Size)
	    return filesize(this.Size);
	return null;
    },
    haveData: function () {
	return !(!this);
    },
    multihost: function() {
	return Hosts.find().count() > 1;
    },
    configs: function(){
	if (this.Config){
	    return _.map(_.pairs(this.Config),
			 function(c){
			     return {n:c[0],p: EJSON.stringify(c[1])};
			 });
	}
	return null;
    },
    hostId: function() {
	var host =  Hosts.findOne(this._host);
	if (host)
	    return host.Id;
	return null;
    },
    host: function() {
	return this._host;
    }
});

Template.imageInspect.events({
    'mousedown #brm': actionHandler('#imageRemoveModal', 'image.rm', 'images', 'docker rmi', 'removed')
});

Template.imageRunParameter.helpers({
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
    Tags: function() {
	if (this.history && this.history[0])
	    return this.history[0].Tags;
	return null;
    },
    config: function(){
	var config = modules.call('image.run.parameter.config',this, this._host, this.Id);
	if (!config) {
	    config = {};
	    var cf = this.Config;
	    if (!cf)
		return null;
	    config.host=this._host;
	    config.Id=this.Id;
	    config.command = cf.Cmd?cf.Cmd[0]:'';
	    config.args = cf.Cmd?_.rest(cf.Cmd):[];
	    config.AttachStderr = cf.AttachStderr;
	    config.AttachStdin = cf.AttachStdin;
	    config.AttachStdout = cf.AttachStdout;
	    config.Entrypoint = cf.Entrypoint;
	    config.Envs = cf.Env;
	    config.Tty = cf.Tty;
	    config.User = cf.User;
	    config.WorkingDir = cf.WorkingDir;
	    config.Memory = cf.Memory;
	    config.MemorySwap = cf.MemorySwap;
	    config.Binds = cf.Volumes;
	    config.PublishAllPorts = cf.PublishAllPorts;
	    if (cf.ExposedPorts){
		config.publish = [];
		_.each(_.pairs(cf.ExposedPorts), function(port){
		    var p = port[0].split('/');
		    config.publish.push({port: {port:p[0], protocol:p[1]}});
		});
	    }
	}
	return config;
    }
});

Template.imagePullParameter.helpers({
    config: function(){
	var config = modules.call('image.pull.parameter.config',this, this._host, this.Id);
	if (!config)
	    config = {host: Session.get('hostFilter')};
	return config;
    }
});

Template.imageTagParameter.helpers({
    multihost: function() {
	return Hosts.find().count() > 1;
    },
    hostId: function() {
	var host =  Hosts.findOne(this._host);
	if (host)
	    return host.Id;
	return null;
    },
    IdShort: function(){
	if (this.Id)
	    return this.Id.substring(0,12);
	return null;
    },
    config: function(){
	var config = modules.call('image.tag.parameter.config',this, this._host, this.Id);
	if (!config) {
	    config = this;
	}
	return config;
    }
});


Template.imagePushParameter.helpers({
    multihost: function() {
	return Hosts.find().count() > 1;
    },
    hostId: function() {
	var host =  Hosts.findOne(this._host);
	if (host)
	    return host.Id;
	return null;
    },
    IdShort: function(){
	if (this.Id)
	    return this.Id.substring(0,12);
	return null;
    },
    config: function(){
	var config = modules.call('image.push.parameter.config',this, this._host, this.Id);
	if (!config) {
	    config = this;
	}
	return config;
    }
});


Template["afArrayField_publish"].helpers({
    portport: function(){
	return this.name+".port.port";
    },
    portprotocol: function(){
	return this.name+".port.protocol";
    },
    hostIp: function(){
	return this.name+".host.hostIp";
    },
    hostPort: function(){
	return this.name+".host.hostPort";
    },
    rightColumnClass: function () {
	var atts = this.atts || {};
	return atts['input-col-class'] || "";
    },
    afFieldLabelAtts: function () {
	// Use only atts beginning with label-
	var labelAtts = {};
	_.each(this.atts, function (val, key) {
	    if (key.indexOf("label-") === 0) {
		labelAtts[key.substring(6)] = val;
	    }
	});
	// Add bootstrap class
	labelAtts = AutoForm.Utility.addClass(labelAtts, "control-label");
	return labelAtts;
    }
});

Template["afArrayField_array"].helpers({
    rightColumnClass: function () {
	var atts = this.atts || {};
	return atts['input-col-class'] || "";
    },
    afFieldLabelAtts: function () {
	// Use only atts beginning with label-
	var labelAtts = {};
	_.each(this.atts, function (val, key) {
	    if (key.indexOf("label-") === 0) {
		labelAtts[key.substring(6)] = val;
	    }
	});
	// Add bootstrap class
	labelAtts = AutoForm.Utility.addClass(labelAtts, "control-label");
	return labelAtts;
    }
});


Template.imageModals.helpers({
    removeTagOptions:function(){
	return _.map(this.tags,
		     function(t){
			 return {label: t, value:t};
		     });
    },
    config: function(){
	var config = modules.call('image.remove.parameter.config',this, this._host, this.Id);
	if (!config) {
	    config = this;
	}
	return config;
    }
});
