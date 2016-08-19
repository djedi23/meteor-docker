Template.swarmsList.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host =  Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  inSwarm: function(){
    return this.info && this.info.Swarm && this.info.Swarm.LocalNodeState === 'active';
  },
  notInSwarm: function(){
    return ! this.info || ! this.info.Swarm || (this.info && this.info.Swarm && this.info.Swarm.LocalNodeState === 'inactive') ;
  },
  swarm: function(){
    if (this.info && this.info.Swarm && this.info.Swarm.Cluster)
      return this.info.Swarm.Cluster.ID;
  },
  role: function(){
    if (this.info && this.info.Swarm && this.info.Swarm.Managers >0)
      return 'MANAGER';
  }
});



Template.swarmsList.events({
  'click #btnSwarmLeave': function(evt, tpl) {
    var opts = {
      host: this._id
    };

    Meteor.call('swarms.leave', opts, function(error, result) {
      if (error)
        Notifications.error('docker swarms leave', error.reason);
      else {
        Notifications.success('docker swarms leave', result);
        Meteor.call('swarms.list');
      }
    });
    $(evt.currentTarget).blur();
  }
});
