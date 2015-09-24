var errorCount=0;

docker_init = function(hostId) {
  check(hostId, checkHostId);
  var host = modules.collections.Hosts.findOne({_id:hostId});
  if (host === null || host === undefined)
    return;
  docker[host._id] = new Docker(host.connection);
  try{
    docker[host._id].version(
      Meteor.bindEnvironment(function (err, version) {
        if (err)
          return;
        var u = modules.collections.Hosts.update({_id:host._id}, {$set: {version:version}}, {validate:false, filter: false});
      }));
    modules.collections.Hosts.upsert({_id:host._id}, {$set: {status:true, lastError:{warning:"Event stream not initialized"}}}, {validate:false, filter: false});
    docker[host._id].getEvents({}, Meteor.bindEnvironment(
      function(err,stream){
        if (err){
          if (! host.disabled)
            console.log(host, err);
          modules.collections.Hosts.upsert({_id:host._id}, {$set: {status:false, lastError:err}}, {validate:false, filter: false});
          Meteor.setTimeout(function() {
            docker_init(host._id);
          }, Math.round(10000/(1+ Math.exp(-0.15*(errorCount-30)))) );
          errorCount++;
        }
        else {
          modules.collections.Hosts.upsert({_id:host._id}, {$set: {status:true}}, {validate:false, filter: false});
          errorCount=0;
          docker[host._id]._eventStream = stream;
          stream.on('data', Meteor.bindEnvironment(
            function(chunk) {
              var event = JSON.parse(chunk.toString());
              eventHandle(host._id,event);
              modules.collections.Hosts.upsert({_id:host._id}, {$set: {status:true}}, {validate:false, filter: false});
            })).on('end', Meteor.bindEnvironment(
              function(error) {
                modules.collections.Hosts.upsert({_id:host._id}, {$set: {status:false, lastError:err}}, {validate:false, filter: false});
                docker_init(host._id);
              })).on('error', Meteor.bindEnvironment(
                function(error) {
                  modules.collections.Hosts.upsert({_id:host._id}, {$set: {status:false, lastError:err}}, {validate:false, filter: false});
                  docker_init(host._id);
                }));
        }}));
  } catch(exp) {
    console.log(exp);
  }
};


Meteor.startup(function () {
  docker = {};
  modules.docker ={};
  modules.docker.api = docker;

  if (modules.collections.Hosts.find().count()===0){
      var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
      try {
          var fs = Npm.require('fs');
          var stats  = fs.statSync(socket);

          if (!stats.isSocket()) {
              throw new Error("Are you sure the docker is running?");
          }
          var hostOptions = {Id:'localSocket',
                             connection: {socketPath: socket}};
          modules.collections.Hosts.upsert({Id:'localSocket'}, hostOptions, {validate:false, filter: false});
      } catch(e) {
        console.log("*** Are you sure the docker daemon is running? ***");
        console.log("We have a problem creating the initial host from the socket \""+socket+"\".");
        console.log("If no docker deamon run on the computer, ignore this message");
        console.log("You can specify the docker socket with this environment variable: DOCKER_SOCKET");
      }
  }

  modules.collections.Hosts.find().forEach(function(e){
    if (e.connection)
      docker_init(e._id);
  });

  startMonitoringContainers();
  Accounts.onCreateUser(function(options, user) {
    if (Meteor.users.find().count() === 0)
      user.roles=_.map(modules.rolesList, function(e){return e.role;});

    return user;
  });
});
