Template.networkList.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host =  Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  IdShort: function() {
    if (this.Id)
      return this.Id.substring(0, 12);
    return null;
  }
});

Template.networkList.events({
  'click #bcremove': function(evt, tpl) {
    var opts = {
      host: this._host,
      Name: this.Name
    };

    Meteor.call('network.remove', opts, function(error, result) {
      if (error)
        Notifications.error('docker network rm', error.reason);
      else {
        Notifications.success('docker network rm', result);
        Meteor.call('network.list');
      }
    });
    $(evt.currentTarget).blur();
  }
});