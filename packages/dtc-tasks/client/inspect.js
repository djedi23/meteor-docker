Template.tasksInspect.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host =  Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  task: function(){
    return {
      json: this
    };
  }
});