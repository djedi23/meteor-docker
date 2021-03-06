// mode: js2 ; org-default-notes-file: "../docs/docker.org"

// Hold the streams for the containers stats
containerStats = {};


checkDockerId = Match.Where(function(x){
  check(x,String);
  return /^(sha256:)?[0-9a-z]{64}$/.test(x);
});

checkHostId = Match.Where(function(x){
  check(x,String);
  return modules.hostIdRegExp.test(x);
});

ensureApi = function(hostId, api) {
  var host = Hosts.findOne({_id:hostId});
  if (host){
    return host.version.ApiVersion >= api;
  }
  return false;
};


var copyIfExists = function(from, to, options) {
  if (from[options])
    to[options] = from[options];
};

listContainers = function(sinceId){
  var options = {all:true};
  if (sinceId){
    check(sinceId, checkDockerId);
    options.since = sinceId;
  }

  _.each(_.pairs(docker), function(dockerHost) {
    var hostId = dockerHost[0];
    var docker = dockerHost[1];
    docker.listContainers(options,
			  Meteor.bindEnvironment(function (err, containers) {
			    if (err){
			      console.log("list container",err);
			      return;
			    }
			    var list = {};
			    _.each(Containers.find({_host:hostId},{fields:{Id:1}}).fetch(),
				   function(e){list[e.Id]=1;});
			    containers.forEach(function(container){
			      container._host = hostId;
			      v = {};
			      if (container.Labels)
				_.each(_.pairs(container.Labels),
				       function(p){
					 p[0] = p[0].replace(/\./g,'U+FF0E');
					 v[p[0]] = p[1];
				       });
			      container.Labels = v;

			      var u = Containers.upsert({_host:hostId, Id:container.Id}, {$set: container});
			      delete list[container.Id];
			    });
			    Containers.remove({Id:{$in:_.keys(list)}});
			    ContainersInspect.remove({Id:{$in:_.keys(list)}});
			  }));
  });
};

dtcVersion =  function(){
  var version = JSON.parse(Assets.getText('version.json'));
  return 'version:'+version.version+' date:'+version.date+(version.build?("build:"+version.build):"");
};



containerDetails = function(hostId, containerId){
  check(hostId, checkHostId);
  check(containerId, checkDockerId);

  if (docker[hostId] === undefined)
    return;

  var container = docker[hostId].getContainer(containerId);
  container.inspect(Meteor.bindEnvironment(function (err, container) {
    if (err)
      return;

    container._host = hostId;
    var v = {};
    if (container.Volumes)
      _.each(_.pairs(container.Volumes),
	     function(p){
	       p[0] = p[0].replace(/\./g,'U+FF0E');
	       v[p[0]] = p[1];
	     });
    container.Volumes = v;

    v = {};
    if (container.VolumesRW)
      _.each(_.pairs(container.VolumesRW),
	     function(p){
	       p[0] = p[0].replace(/\./g,'U+FF0E');
	       v[p[0]] = p[1];
	     });
    container.VolumesRW = v;

    v = {};
    if (container.Config && container.Config.Volumes)
      _.each(_.pairs(container.Config.Volumes),
	     function(p){
	       p[0] = p[0].replace(/\./g,'U+FF0E');
	       v[p[0]] = p[1];
	     });
    container.Config.Volumes = v;

    v = {};
    if (container.Labels)
      _.each(_.pairs(container.Labels),
	     function(p){
	       p[0] = p[0].replace(/\./g,'U+FF0E');
	       v[p[0]] = p[1];
	     });
    container.Labels = v;

    v = {};
    if (container.Config.Labels)
      _.each(_.pairs(container.Config.Labels),
	     function(p){
	       p[0] = p[0].replace(/\./g,'U+FF0E');
	       v[p[0]] = p[1];
	     });
    container.Config.Labels = v;

    v = {};
    if (container.HostConfig.Labels)
      _.each(_.pairs(container.HostConfig.Labels),
	     function(p){
	       p[0] = p[0].replace(/\./g,'U+FF0E');
	       v[p[0]] = p[1];
	     });
    container.HostConfig.Labels = v;


    var u = ContainersInspect.upsert({_host:hostId, Id:container.Id}, {$set: container});
  }));

  var cont = ContainersInspect.findOne({_host:hostId, Id:containerId});
  // if (cont && cont.execs){
  //     _.each(_.keys(cont.execs),
  //         function(c) {
  //             console.log(c);
  //             execDetails(hostId, c);
  //         });
  // }

  return container;
};



listImages = function(){
  _.each(_.pairs(docker), function(dockerHost) {
    var hostId = dockerHost[0];
    var docker = dockerHost[1];

    var list = {};
    _.each(Images.find({_host:hostId},{fields:{Id:1}}).fetch(),
	   function(e){list[e.Id]=1;});


    docker.listImages(Meteor.bindEnvironment(
      function (err, images) {
	if (err)
	  return;

	images.forEach(function(img){
	  img._host = hostId;

	  v = {};
	  if (img.Labels)
	    _.each(_.pairs(img.Labels),
		   function(p){
		     p[0] = p[0].replace(/\./g,'U+FF0E');
		     v[p[0]] = p[1];
		   });
	  img.Labels = v;

	  var u = Images.upsert({_host:hostId, Id:img.Id}, {$set: img});
	  delete list[img.Id];
	});
	Images.remove({Id:{$in:_.keys(list)}});
	ImagesInspect.remove({Id:{$in:_.keys(list)}});
      }));
  });
};

listVolumes = function(){
  _.each(_.pairs(docker), function(dockerHost) {
    var hostId = dockerHost[0];
    var docker = dockerHost[1];
    if (ensureApi(hostId,'1.21')) {
      var list = {};
      _.each(Volumes.find({_host:hostId},{fields:{Name:1}}).fetch(),
	     function(e){list[e.Name]=1;});

      docker.listVolumes(Meteor.bindEnvironment(
	function (err, volumes) {
	  if (err)
	    return;

	  if (!volumes.Volumes)
	    return;

	  volumes.Volumes.forEach(function(vol){
	    vol._host = hostId;

	    var u = Volumes.upsert({_host:hostId,Name:vol.Name}, {$set: vol});
	    delete list[vol.Name];
	  });
	  Volumes.remove({Name:{$in:_.keys(list)}});
	  VolumesInspect.remove({Name:{$in:_.keys(list)}});
	}));
    }
  });
};


imageDetail = function(hostId, imgId){
  check(hostId, checkHostId);
  check(imgId, checkDockerId);

  if (docker[hostId] === undefined)
    return;

  var img = docker[hostId].getImage(washImageId(imgId));
  if (img) {
    img.inspect(Meteor.bindEnvironment(function (err, image) {
      if (err)
	return;
      var img = Images.findOne({_host:hostId, Id: queryImageId(image.Id)});
      if (img)
	image.tags = img.RepoTags;

      image._host = hostId;
      if (image._id)
	delete image._id;

      v = {};
      if (image.ContainerConfig.Labels)
	_.each(_.pairs(image.ContainerConfig.Labels),
	       function(p){
		 p[0] = p[0].replace(/\./g,'U+FF0E');
		 v[p[0]] = p[1];
	       });
      image.ContainerConfig.Labels = v;
      v = {};
      if (image.Config && image.Config.Labels) {
	_.each(_.pairs(image.Config.Labels),
	       function(p){
		 p[0] = p[0].replace(/\./g,'U+FF0E');
		 v[p[0]] = p[1];
	       });
	image.Config.Labels = v;
      }

      var u = ImagesInspect.upsert({_host:hostId,Id:image.Id}, {$set: image});
    }));


    var imgage_ = Images.findOne({_host:hostId, Id:queryImageId(imgId)});
    img.history(Meteor.bindEnvironment(function (err, history) {
      if (err)
	return;
      var image = {_host:hostId,Id: imgage_.Id,
		   history: history};
      var u = ImagesInspect.upsert({_host:hostId,Id:imgage_.Id}, {$set: image});
    }));
  }
};

containerCall = function(opts, fct) {
  if (opts.host){
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

    var container = docker[opts.host].getContainer(opts.id);
    if (container){
      var callopts = opts;
      delete callopts.id;
      delete callopts.host;
      container[fct].call(container, callopts, function (err, result) {
	if (err){
	  console.log("container",fct,err);
	  myFuture.throw(err.json?err.json:(err.reason?err.reason:err));
	} else {
	  myFuture.return(result);
	}
      });
      try{
	return myFuture.wait();
      } catch (err){
	throw new Meteor.Error('docker', err.toString());
      }
    }
  }
};

var imageCall = function(opts, fct) {
  if (opts.host){
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

    var image = docker[opts.host].getImage(opts.id);
    var callopts = opts;
    delete callopts.id;
    delete callopts.host;
    image[fct].call(image, callopts, function (err, result) {
      if (err){
	myFuture.throw(err.reason);
      } else
	myFuture.return(result);
    });
    try{
      return myFuture.wait();
    } catch (err){
      throw new Meteor.Error('docker', err.toString());
    }
  }
};



Meteor.methods({
  'dtcVersion': dtcVersion,
  'container.details':function(hostId, containerId){
    check(hostId, checkHostId);
    check(containerId, checkDockerId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.view']))
      throw new Meteor.Error(403, "Not authorized to view container");

    var container = containerDetails(hostId,containerId);
    if (container){
      container.top(Meteor.bindEnvironment(
	function (err, top) {
	  if (err){
	    ContainersInspect.update({_host:hostId, Id:containerId}, {$unset: {top:""}});
	    return;
	  }
	  var image = {top: top};
	  var u = ContainersInspect.update({_host:hostId, Id:containerId}, {$set: image});
	}));

      if (Roles.userIsInRole(Meteor.user(), ['container.logs'])){
	container.logs({stdout:1, tail:200},Meteor.bindEnvironment(
	  function (err, logsStream) {
	    if (err){
	      console.log("container log",err);
	      ContainersInspect.update({_host:hostId,Id:containerId}, {$unset: {logs:""}});
	      return;
	    }

	    var buffer="";
	    logsStream.on('data', function(chunk){
	      buffer += chunk.slice(8).toString(); // https://github.com/docker/docker/issues/8223
	    }).on('end', Meteor.bindEnvironment(function(){
	      var logs = {logs: buffer};
	      var u = ContainersInspect.update({_host:hostId, Id:containerId}, {$set: logs});
	    }));
	  }));
      }

      if (Roles.userIsInRole(Meteor.user(), ['container.changes'])){
	container.changes(Meteor.bindEnvironment(
	  function (err, changes) {
	    if (err){
	      ContainersInspect.update({_host:hostId,Id:containerId}, {$unset: {diff:""}});
	      return;
	    }

	    if (changes){
	      var changes_ = {changes: changes};
	      var u = ContainersInspect.update({_host:hostId,Id:containerId}, {$set: changes_});
	    }
	  }));
      }
      //      startMonitoringContainer(hostId,containerId);
    }
  },
  'containers.list': function(){
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.list']))
      throw new Meteor.Error(403, "Not authorized to list container");
    //      if (docker == undefined){
    //          console.log("Docker not ready");
    //          return null;
    //      }
    listContainers();
  },
  'container.pause': function(hostId,containerId){
    check(hostId, checkHostId);
    check(containerId, checkDockerId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.pause']))
      throw new Meteor.Error(403, "Not authorized to pause container");
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

    var container = docker[hostId].getContainer(containerId);
    if (container){
      container.pause(function (err, result) {
	if (err){
	  myFuture.throw(err.reason);
	} else
	  myFuture.return(result);
      });
      try{
	return myFuture.wait();
      } catch (err){
	throw new Meteor.Error('docker', err.toString());
      }
    }
  },
  'container.unpause': function(hostId,containerId){
    check(hostId, checkHostId);
    check(containerId, checkDockerId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.unpause']))
      throw new Meteor.Error(403, "Not authorized to unpause container");
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

    var container = docker[hostId].getContainer(containerId);
    if (container){
      container.unpause(function (err, result) {
	if (err){
	  myFuture.throw(err.reason);
	} else
	  myFuture.return(result);
      });
      try{
	return myFuture.wait();
      } catch (err){
	throw new Meteor.Error('docker', err.toString());
      }
    }
  },
  'container.restart': function(opts,a,b){
    check(opts,containerStopSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.restart']))
      throw new Meteor.Error(403, "Not authorized to restart container");
    containerCall(opts, 'restart');
  },
  'container.start': function(opts,a,b) {
    check(opts,containerStartSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.start']))
      throw new Meteor.Error(403, "Not authorized to start container");
    containerCall(opts, 'start');
  },
  'container.rm': function(opts, a,b){
    check(opts,containerRemoveSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.rm']))
      throw new Meteor.Error(403, "Not authorized to remove container");

    containerCall(opts, 'remove');
  },
  'container.kill': function(opts,a,b){
    check(opts,containerKillSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.kill']))
      throw new Meteor.Error(403, "Not authorized to kill container");
    containerCall(opts, 'kill');
  },
  'container.stop': function(opts,a,b){
    check(opts,containerStopSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.stop']))
      throw new Meteor.Error(403, "Not authorized to stop container");

    containerCall(opts, 'stop');
  },
  'container.rename': function(opts,a,b){
    check(opts,containerRenameSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.rename']))
      throw new Meteor.Error(403, "Not authorized to rename container");

    containerCall(opts, 'rename');
  },
  'container.update': function(opts,a,b){
    check(opts,containerUpdateSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (ensureApi(opts.host, "1.22")) {
      if (! Roles.userIsInRole(Meteor.user(), ['admin','container.update']))
	throw new Meteor.Error(403, "Not authorized to update container");

      containerCall(opts, 'update');
    }
  },
  'container.commit': function(opts,a,b){
    check(opts,commitSchemas);
    check(opts.container, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','container.commit']))
      throw new Meteor.Error(403, "Not authorized to commit a container");

    opts= _.extend(opts, opts.Config);
    delete opts.Config;

    opts.id = opts.container;
    containerCall(opts, 'commit');
  },
  'host.details':function(){
    if (! Roles.userIsInRole(Meteor.user(), ['admin','host.view']))
      throw new Meteor.Error(403, "Not authorized to view host");

    _.each(_.pairs(docker), function(dockerHost) {
      var hostId = dockerHost[0];
      var docker = dockerHost[1];

      docker.version(Meteor.bindEnvironment(function (err, version) {
	if (err)
	  return;
	modules.collections.Hosts.update({_id:hostId}, {$set: {version:version}}, {validate:false, filter: false});
      }));
      docker.info(Meteor.bindEnvironment(function (err, info) {
	if (err)
	  return;
	if (! _.isUndefined(info.RegistryConfig.IndexConfigs)){
	  _.each(_.pairs(info.RegistryConfig.IndexConfigs), function(index){
	    if (index[0].indexOf('.') !== -1){
	      info.RegistryConfig.IndexConfigs[index[0].replace('.','_','g')] = index[1];
	      delete info.RegistryConfig.IndexConfigs[index[0]];
	    }});}

	modules.collections.Hosts.update({_id:hostId}, {$set: {info:info}}, {validate:false, filter: false});
      }));
    });
  },
  'host.new':function(host){
    check(host, checkHostId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','host.new']))
      throw new Meteor.Error(403, "Not authorized to add host");

    docker_init(host);
  },
  'host.rm': function(hostId,containerId){
    check(hostId, checkHostId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','host.remove']))
      throw new Meteor.Error(403, "Not authorized to remove host");

    modules.collections.Hosts.remove({Id:hostId});
    //      if (docker[hostId] && docker[hostId]._eventStream)
    //          docker[hostId]._eventStream.end();
    delete docker[hostId];
    modules.collections.Containers.remove({_host:hostId});
    modules.collections.ContainersInspect.remove({_host:hostId});
    modules.collections.Images.remove({_host:hostId});
    modules.collections.ImagesInspect.remove({_host:hostId});
  },
  'host.rename':function(host,a,b){
    check(a,Match.Any);
    check(b,Match.Any);
    check(host, Match.Any);
    if (host === null)
      return;
    check(host.Id, checkHostId);
    check(host._id, String);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','host.rename']))
      throw new Meteor.Error(403, "Not authorized to rename host");
    if (Hosts.findOne({Id: host.Id})!=undefined)
      throw new Meteor.Error(500, "Host name already exists");
    Hosts.update({_id:host._id},{$set: {Id: host.Id}}, {validate:false, filter:false});
  },
  'host.enable':function(hostId,a,b){
    check(a,Match.Any);
    check(b,Match.Any);
    check(hostId, checkHostId);
    if (hostId === null)
      return;
    if (! Roles.userIsInRole(Meteor.user(), ['admin','host.enable']))
      throw new Meteor.Error(403, "Not authorized to rename host");
    var host = Hosts.findOne({_id:hostId});
    if (host) {
      if (host.disabled)
	Hosts.update({_id:hostId},{$unset: {disabled: ""}}, {validate:false, filter:false});
      else
	Hosts.update({_id:hostId},{$set: {disabled: 'disabled'}}, {validate:false, filter:false});
    }
  },
  'images.list': function(){
    if (! Roles.userIsInRole(Meteor.user(), ['admin','image.list']))
      throw new Meteor.Error(403, "Not authorized to list images");
    if (docker == undefined)
      return null;

    listImages();
  },
  'image.details':function(hostId, imgId){
    check(imgId, checkDockerId);
    check(hostId, checkHostId);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','image.view']))
      throw new Meteor.Error(403, "Not authorized to view images");
    imageDetail(hostId, washImageId(imgId));
  },
  'image.pull': function(params,a,b){
    check(params,pullSchemas);
    check(params.host, checkHostId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','image.pull']))
      throw new Meteor.Error(403, "Not authorized to pull image");

    if(docker[params.host])
      docker[params.host].createImage(params,Meteor.bindEnvironment(
	function (err, stream) {
	  if (err){
	    console.log(err);
	    return;
	  }

	  stream.on('data', Meteor.bindEnvironment(
	    function(chunk){
	      var status = JSON.parse(chunk);
	      if (status.id){
		status.Id = washImageId(status.id);
		status._host=params.host;
		if (status.status === 'Download complete')
		  Images.remove({_host:params.host, Id:status.Id});
		else
		  Images.upsert({_host:params.host, Id:status.Id}, {$set: status});
	      }
	    })).on('end', Meteor.bindEnvironment(
	      function(){
		listImages();
		modules.calls('events.image.pull.'+params.fromImage+'.'+params.tag, this, params.host, params);
	      }));
	}));
  },
  'image.push': function(params,a,b){
    check(params,pushSchemas);
    check(params.host, checkHostId);
    check(a,Object);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','image.push']))
      throw new Meteor.Error(403, "Not authorized to push image");

    if(docker[params.host])
      docker[params.host].push(params,Meteor.bindEnvironment(
	function (err, stream) {
	  if (err){
	    console.log(err);
	    return;
	  }

	  stream.on('data', Meteor.bindEnvironment(
	    function(chunk){
	      var status = JSON.parse(chunk);
	      console.log("chunk",status);
	      if (status.id){
		status.Id = washImageId(status.id);
		status._host=params.host;
		// if (status.status === 'Download complete')
		//     Images.remove({_host:params.host, Id:status.Id});
		// else
		Images.upsert({_host:params.host, Id:status.Id}, {$set: status});
	      }
	    })).on('end', Meteor.bindEnvironment(
	      function(){
		listImages();
	      }));
	}));
  },
  'image.run': function(params,a,b){
    check(params,runSchemas);
    check(params.host, checkHostId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','image.run']))
      throw new Meteor.Error(403, "Not authorized to run image");

    //console.log('image.run',params);
    if (docker[params.host]){
      var command = [];
      if (params.command){
	command = [params.command];
	if (params.args)
	  command = command.concat(params.args);
      }
      var create_options = {};
      copyIfExists(params,create_options, 'name');
      copyIfExists(params,create_options, 'Tty');
      copyIfExists(params,create_options, 'User');
      copyIfExists(params,create_options, 'Env');
      copyIfExists(params,create_options, 'WorkingDir');
      copyIfExists(params,create_options, 'Entrypoint');
      copyIfExists(params,create_options, 'AttachStderr');
      copyIfExists(params,create_options, 'AttachStdin');
      copyIfExists(params,create_options, 'AttachStdout');
      copyIfExists(params,create_options, 'Memory');
      copyIfExists(params,create_options, 'MemorySwap');
      copyIfExists(params,create_options, 'OpenStdin');
      copyIfExists(params,create_options, 'StdinOnce');

      create_options.ExposedPorts ={};
      create_options.HostConfig = {};
      create_options.HostConfig.PortBindings = {};
      _.each(params.publish,function(binding){
	create_options.ExposedPorts[binding.port.port+'/'+binding.port.protocol] = {};
	if (binding.host && binding.host.hostPort)
	  create_options.HostConfig.PortBindings[binding.port.port+'/'+binding.port.protocol] = [{HostPort:binding.host.hostPort.toString(),
												  HostIp:binding.host.hostIp}];
      });
      create_options.HostConfig.Links = _.map(params.links,
					      function(l){
						return l.container_name+':'+l.alias;
					      });

      if (ensureApi(params.host,'1.18')) {
	create_options.Labels={};
	_.each(params.Labels, function(label){ create_options.Labels[label.key] = label.value; });
      }

      copyIfExists(params,create_options.HostConfig, 'PublishAllPorts');
      copyIfExists(params,create_options.HostConfig, 'Binds');
      copyIfExists(params,create_options.HostConfig, 'RestartPolicy');
      if (ensureApi(params.host,'1.18')) {
	copyIfExists(params,create_options.HostConfig, 'Ulimits');
      }

      console.log('co',JSON.stringify(create_options));
      var start_options = {};

      Future = Npm.require('fibers/future');
      var myFuture = new Future();
      docker[params.host].run(washImageId(params.id),command, [process.stdout, process.stderr], create_options,  start_options,
			      function (err, result,container) {
			      }).on('container',
				    function (container) {
				      myFuture.return(container.id);
				    });
      try{
	return myFuture.wait();
      } catch (err){
	throw new Meteor.Error('docker', err.toString());
      }
    }
  },
  'image.rm':function(opts,a,b){
    check(opts, imageRemoveSchemas);
    check(opts.id, checkDockerId);
    check(a,Match.Any);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','image.rm']))
      throw new Meteor.Error(403, "Not authorized to remove image");

    if (opts.tag)
      opts.id = opts.tag;
    opts.id = washImageId(opts.id);
    imageCall(opts,'remove');
  },
  'image.tag':function(opts,a,b){
    check(opts, tagSchemas);
    check(opts.id, checkDockerId);
    check(a,Object);
    check(b,Match.Any);
    if (! Roles.userIsInRole(Meteor.user(), ['admin','image.tag']))
      throw new Meteor.Error(403, "Not authorized to tag image");
    opts.id = washImageId(opts.id);
    imageCall(opts,'tag');
  },
  'volume.list': function(){
    if (! Roles.userIsInRole(Meteor.user(), ['admin','volume.list']))
      throw new Meteor.Error(403, "Not authorized to list volumes");
    if (docker == undefined)
      return null;

    listVolumes();
  },
  'volume.create':function(opts){
    check(opts, volumeCreateSchemas);
    check(opts.host, checkHostId);
    if (ensureApi(opts.host, "1.21")){
      if (! Roles.userIsInRole(Meteor.user(), ['admin','volume.create']))
	throw new Meteor.Error(403, "Not authorized to tag image");

      if (opts.host) {
	Future = Npm.require('fibers/future');
	var myFuture = new Future();

	docker[opts.host].createVolume(opts, function(err, result) {
	  if (err) {
	    myFuture.throw(err.reason);
	  }
	  else
	    myFuture.return(result);
	});
	try {
	  return myFuture.wait();
	}
	catch (err) {
	  throw new Meteor.Error('docker', err.toString());
	}
      }
    }},
  'volume.remove':function(opts){
    check(opts, {host:checkHostId, Name:String});
    if (ensureApi(opts.host, "1.21")){
      if (! Roles.userIsInRole(Meteor.user(), ['admin','volume.remove']))
	throw new Meteor.Error(403, "Not authorized to tag image");

      if (opts.host) {
	Future = Npm.require('fibers/future');
	var myFuture = new Future();
	var volume = docker[opts.host].getVolume(opts.Name);
	volume.remove(opts, function(err, result) {
	  if (err) {
	    myFuture.throw(err.reason);
	  }
	  else
	    myFuture.return(result);
	});
	try {
	  return myFuture.wait();
	}
	catch (err) {
	  throw new Meteor.Error('docker', err.toString());
	}
      }
    }},
  'volume.inspect':function(opts){
    check(opts, {host:checkHostId, Name:String});
    if (ensureApi(opts.host, "1.21")){
      if (! Roles.userIsInRole(Meteor.user(), ['admin','volume.remove']))
	throw new Meteor.Error(403, "Not authorized to tag image");

      if (opts.host) {
	Future = Npm.require('fibers/future');
	var myFuture = new Future();
	var volume = docker[opts.host].getVolume(opts.Name);
	volume.inspect(Meteor.bindEnvironment(function(err, result) {
	  if (err) {
	    myFuture.throw(err.reason);
	  }
	  else {
	    result._host = opts.host;
	    VolumesInspect.upsert({_host:opts.host,Name:result.Name}, {$set: result});
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
    }}
});


const LISTS_METHODS = _.pluck([
  'dtcVersion',
  'container.details',
  'containers.list',
  'container.pause',
  'container.unpause',
  'container.restart',
  'container.start',
  'container.rm',
  'container.kill',
  'container.stop',
  'container.rename',
  'container.commit',
  'container.exec.create',
  'host.details',
  'host.new',
  'host.rm',
  'host.rename',
  'host.enable',
  'images.list',
  'image.details',
  'image.pull',
  'image.push',
  'image.run',
  'image.rm',
  'image.tag',
  'volume.list',
  'volume.create',
  'volume.remove',
  'volume.inspect'
], 'name');
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(LISTS_METHODS, name);
  },
  connectionId() { return true; }
}, 5, 1000);
