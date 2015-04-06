// mode: js2

startMonitoringContainer = function(hostId, containerId){
  if (! ensureApi(hostId,"1.17"))
    return;
  if (! _.isUndefined(containerStats[containerId]))
    return;
  if (docker[hostId] === undefined)
    return;

  var container = docker[hostId].getContainer(containerId);
  if (!container)
    return;
  containerStats[containerId] = {status: 2};
  container.stats(Meteor.bindEnvironment(
    function (err, stream) {
      if (err){
        delete containerStats[containerId];
        console.log(err);
        return;
      }

      containerStats[containerId] = {stream: stream, status:1};
      stream.on('data', Meteor.bindEnvironment(
        function(chunk){
          var stat = JSON.parse(chunk);
          stat.Id = containerId;
          stat._host = hostId;
          stat.read = moment(stat.read).toDate();
          ContainersStats.insert(stat);
        })).
        on('end', Meteor.bindEnvironment(function(){
                    delete containerStats[containerId];
                  })).
        on('close', Meteor.bindEnvironment(function(){
                      delete containerStats[containerId];
                    })).
        on('error', Meteor.bindEnvironment(function(){
                      delete containerStats[containerId];
                    }));
    }));
};


startMonitoringContainers = function(){
  Containers.find().forEach(function(container){
    startMonitoringContainer(container._host,container.Id);
  });
};


// Clean old stats
SyncedCron.add({
  name: 'Clean old stats',
  schedule: function(parser) {
    return parser.text('every 2 hours');
  },
  job: function() {
    var query = {read: {$lt: moment().subtract(1, 'days').toDate()}};
    var stats = ContainersStats.find(query);
    ContainersStats.remove(query)
    return stats.count();
  }
});


SyncedCron.config({
  log:false
});


Meteor.startup(function(){
  SyncedCron.start();
});