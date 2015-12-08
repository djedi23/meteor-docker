var containers = function containers() {
  if (this.Containers) {
    var cont = _.map(_.pairs(this.Containers), function(c) {
      return c[0];
    });
    return modules.collections.Containers.find({
      Id: {
        $not: {
          $in: cont
        }
      }
    });
  } else
    return modules.collections.Containers.find();
};

Template.networkInspect.helpers({
  networkConfiguration: function() {
    return {
      json: this,
      ignore: ['_id', '_host'],
      templates: {
        'Containers': 'jsonContainerValue'
      }
    };
  },
  containers: containers,
  containers_count: function() {
    var cont = containers.apply(this);
    return cont && cont.count() > 0;
  },
  name: function() {
    if (this.Names)
      if (this.Names.toString().length > 40)
        return this.Names.toString().substring(0, 40) + " ...";
      else
        return this.Names;
    return null;
  }
});

Template.networkInspect.events({
  "click #addContainer": function(evt, tpl) {
    var self = this;
    Meteor.call('network.connect', {
      host: this._host,
      network: this.Id,
      container: $('#containerSelect').val()
    }, function(error, result) {
      if (error)
        Notifications.error('docker network connect', error.reason);
      else {
        Notifications.success('docker network connect', result);
        Meteor.call('network.inspect', {
          host: self._host,
          Name: self.Name
        });
      }
    });

    $(evt.target).blur();
  },
  "click .removeContainer": function(evt, tpl) {
    var self = this;
    var id = self.Id;
    var parent = Template.parentData(1);
    Meteor.call('network.disconnect', {
      host: parent._host,
      network: parent.Id,
      container: id
    }, function(error, result) {
      $(evt.target).blur();
      if (error)
        Notifications.error('docker network connect', error.reason);
      else {
        Notifications.success('docker network connect', result);
        Meteor.call('network.inspect', {
          host: parent._host,
          Name: parent.Name
        });
        Meteor.call('container.details', parent._host, id);
      }
    });
  }
});

Template.jsonContainerValue.helpers({
  value: function() {
    var self = this.config.json;
    var ids = _.pairs(self);
    if (ids.length > 0) {
      var cts = modules.collections.Containers.find({
        Id: {
          $in: _.map(ids, function(e) {
            return e[0];
          })
        }
      });
      return cts;
    } else
      return null;
  },
  Names: function() {
    return this.Names.toString();
  }
});
