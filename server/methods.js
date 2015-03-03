// mode: js2 ; org-default-notes-file: "../docs/docker.org"

checkDockerId = Match.Where(function(x){
    check(x,String);
    return /^[0-9a-z]{64}$/.test(x);
});

checkHostId = Match.Where(function(x){
    check(x,String);
    return modules.hostIdRegExp.test(x);
});


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
		                      console.log(err);
		                      return;
	                          }
                                  var list = {};
                                  _.each(Containers.find({_host:hostId},{fields:{Id:1}}).fetch(),
                                         function(e){list[e.Id]=1;});
                                  containers.forEach(function(container){
                                      container._host = hostId;
		                      var u = Containers.upsert({_host:hostId, Id:container.Id}, {$set: container});
                                      delete list[container.Id];
                                  });
                                  Containers.remove({Id:{$in:_.keys(list)}});
			          ContainersInspect.remove({Id:{$in:_.keys(list)}});
	                      }));
    })
};

dtcVersion =  function(){
    var version = JSON.parse(Assets.getText('version.json'));
    return 'version:'+version.version+' date:'+version.date;
};


execDetails = function(hostId, exec){
    check(hostId, checkHostId);

    if (docker[hostId] === undefined)
        return;
    if (exec.inspect)
    exec.inspect(Meteor.bindEnvironment(function (err, exec) {
                     if (err){
                         console.log(err);
		         return;
                     }
                     
                     exec._host = hostId;
                     console.log(EJSON.stringify(exec));
                     //var u = ContainersInspect.upsert({_host:hostId, Id:exec.Id}, {$set: exec});
	         }));
    return exec;
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
                                      p[0] = p[0].replace('.','U+FF0E');
                                      v[p[0]] = p[1];
                                  });
                          container.Volumes = v;

                          v = {};
                          if (container.VolumesRW)
                          _.each(_.pairs(container.VolumesRW),
                                 function(p){
                                     p[0] = p[0].replace('.','U+FF0E');
                                     v[p[0]] = p[1];
                                 });
                          container.VolumesRW = v;

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
		    var u = Images.upsert({_host:hostId, Id:img.Id}, {$set: img});
                    delete list[img.Id];
                });
	        Images.remove({Id:{$in:_.keys(list)}});
	        ImagesInspect.remove({Id:{$in:_.keys(list)}});
            }));
    });
};

imageDetail = function(hostId, imgId){
        check(hostId, checkHostId);
        check(imgId, checkDockerId);

        if (docker[hostId] === undefined)
            return;


  	var img = docker[hostId].getImage(imgId);
        if (img) {
	    img.inspect(Meteor.bindEnvironment(function (err, image) {
                        if (err)
		            return;
	                    var img = Images.findOne({_host:hostId, Id:image.Id});
	                    if (img)
		                image.tags = img.RepoTags;
                            
                            image._host = hostId;
                            var u = ImagesInspect.upsert({_host:hostId,Id:image.Id}, {$set: image});
	                }));
	    img.history(Meteor.bindEnvironment(function (err, history) {
                            if (err)
		                return;
	                    var image = {_host:hostId,Id: imgId,
			                 history: history};
                            var u = ImagesInspect.upsert({_host:hostId,Id:imgId}, {$set: image});
	                }));
        }
};

var containerCall = function(opts, fct) {
    if (opts.host){
        Future = Npm.require('fibers/future');
        var myFuture = new Future();
        
        var container = docker[opts.host].getContainer(opts.id);
        if (container){
            container[fct].call(container, opts, function (err, result) {
                if (err){
		    console.log(err);
                    myFuture.throw(err.json?err.json:err.reason);
                } else
                    myFuture.return(result);
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
        image[fct].call(image, opts, function (err, result) {
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
            
	    container.logs({stdout:1},Meteor.bindEnvironment(
                function (err, logsStream) {
                    if (err){
                        ContainersInspect.update({_host:hostId,Id:containerId}, {$unset: {logs:""}});
		        return;
                    }
                    
	            var buffer="";
	            logsStream.on('data', function(chunk){
		        buffer += chunk.toString();
	            }).on('end', Meteor.bindEnvironment(function(){
		                     var logs = {logs: buffer};
		                     var u = ContainersInspect.update({_host:hostId, Id:containerId}, {$set: logs});
	                         }));
	        }));
            
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
    },
    'containers.list': function(){
        if (! Roles.userIsInRole(Meteor.user(), ['admin','container.list']))
            throw new Meteor.Error(403, "Not authorized to list container");
// 	if (docker == undefined){
// 	    console.log("Docker not ready");
// 	    return null;
// 	}
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
    'container.exec.create': function(opts,a,b){
        check(opts,containerExecCreateSchemas);
        check(opts.id, checkDockerId);
        check(a,Match.Any);
        check(b,Match.Any);
        if (! Roles.userIsInRole(Meteor.user(), ['admin','exec.create']))
            throw new Meteor.Error(403, "Not authorized to create container exec");

	var exec = containerCall(opts, 'exec');
	if (exec){
	    exec.start({},Meteor.bindEnvironment(function(err, stream){
		if (err) {
		    console.log(err);
		    return;
		}
		stream.pipe(process.stdout);
		
		var stub = {};
		stub['execs.'+exec.id] = {};
		ContainersInspect.upsert({_host:opts.host, Id:opts.id}, {$set: stub});
		execDetails(opts.host, exec);
	    }));
	}
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
// 	if (docker[hostId] && docker[hostId]._eventStream)
// 	    docker[hostId]._eventStream.end();
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
        imageDetail(hostId, imgId);
    },
    'image.pull': function(params,a,b){
        check(params,pullSchemas);
        check(params.host, checkHostId);
        check(a,Object);
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
                            status.Id = status.id;
			    status._host=params.host;
                            if (status.status === 'Download complete')
                                Images.remove({_host:params.host, Id:status.Id});
                            else
		                Images.upsert({_host:params.host, Id:status.Id}, {$set: status});
                        }
	            })).on('end', Meteor.bindEnvironment(
                        function(){
                            listImages();
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
                            status.Id = status.id;
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
        check(a,Object);
        check(b,Match.Any);
        if (! Roles.userIsInRole(Meteor.user(), ['admin','image.run']))
            throw new Meteor.Error(403, "Not authorized to run image");

        console.log('image.run',params);
        if (docker[params.host]){
            var command = [];
            if (params.command){
                command = params.command;
                if (params.args)
                    command.concat(params.args);
            }
            var create_options = {};
            copyIfExists(params,create_options, 'name');
            copyIfExists(params,create_options, 'Tty');
            copyIfExists(params,create_options, 'User');
            copyIfExists(params,create_options, 'Envs');
            copyIfExists(params,create_options, 'WorkingDir');
            copyIfExists(params,create_options, 'Entrypoint');
            copyIfExists(params,create_options, 'AttachStderr');
            copyIfExists(params,create_options, 'AttachStdin');
            copyIfExists(params,create_options, 'AttachStdout');
            copyIfExists(params,create_options, 'Memory');
            copyIfExists(params,create_options, 'MemorySwap');

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
	    
	    copyIfExists(params,create_options.HostConfig, 'PublishAllPorts');
            copyIfExists(params,create_options.HostConfig, 'Binds');
            copyIfExists(params,create_options.HostConfig, 'RestartPolicy');
	    
            console.log('co',JSON.stringify(create_options));
            var start_options = {};

                Future = Npm.require('fibers/future');
            var myFuture = new Future();

            docker[params.host].run(params.id,command, [process.stdout, process.stderr], create_options,  start_options,
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
        imageCall(opts,'remove');
    },
    'image.tag':function(opts,a,b){
        check(opts, tagSchemas);
        check(opts.id, checkDockerId);
        check(a,Object);
        check(b,Match.Any);
        if (! Roles.userIsInRole(Meteor.user(), ['admin','image.tag']))
            throw new Meteor.Error(403, "Not authorized to tag image");
        imageCall(opts,'tag');
    }
});
