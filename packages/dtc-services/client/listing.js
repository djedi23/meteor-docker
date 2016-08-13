
Template.servicesList.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host =  Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  StatusClass: function(){
    if (this.Status.State === 'ready')
      return 'label-success';
    else if (this.Status.State === 'down')
      return 'label-danger';
    else
      return 'label-info';
  },
  AvailabilityClass: function(){
    if (this.Spec.Availability === 'active')
      return 'label-success';
    else if (this.Spec.Availability === 'down')
      return 'label-danger';
    else
      return 'label-info';
  }
});



Template.servicesList.events({
  'click #bcremove': function(evt, tpl) {
    var opts = {
      host: this._host,
      ID: this.ID
    };

    Meteor.call('services.remove', opts, function(error, result) {
      if (error)
        Notifications.error('docker services rm', error.reason);
      else {
        Notifications.success('docker services rm', result);
        Meteor.call('services.list');
      }
    });
    $(evt.currentTarget).blur();
  }
});