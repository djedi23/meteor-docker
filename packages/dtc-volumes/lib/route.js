Router.route('/volumes', {
  name: 'volumes_list',
  template: 'volumeList',
  data: function() {
    return modules.collections.Volumes.find();
  },
  onRun: function() {
    Meteor.call('volume.list', function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('volumes_list')];
  }
});

Router.route('/volumes/create', {
  name: 'volumeCreate',
  template: 'volumeCreate'
});

Router.route('/volumes/:host/:name/inspect', {
  name: 'volumeInspect',
  template: 'volumeInspect',
  data: function() {
    return modules.collections.VolumesInspect.findOne({_host:this.params.host, Name:this.params.name});
  },
  onRun: function() {
    Meteor.call('volume.inspect', {host:this.params.host, Name:this.params.name}, function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('volume_inspect', this.params.host, this.params.name)];
  }
});
