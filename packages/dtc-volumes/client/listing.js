Template.volumeList.events({
  'click #bcremove': function(evt, tpl) {
    var opts = {
      host: this._host,
      Name: this.Name
    };

    Meteor.call('volume.remove', opts, function(error, result) {
      if (error)
        Notifications.error('docker volume rm', error.reason);
      else {
        Notifications.success('docker volume rm', result);
        Meteor.call('volume.list');
      }
    });
    $(evt.currentTarget).blur();
  }
});