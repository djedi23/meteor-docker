Router.route('/networks', {
  name: 'networks_list',
  template: 'networkList',
  data: function() {
    return modules.collections.Networks.find();
  },
  onRun: function() {
    Meteor.call('network.list', function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('networks_list')];
  }
});

Router.route('/networks/create', {
  name: 'networkCreate',
  template: 'networkCreate'
});

Router.route('/networks/:host/:name/inspect', {
  name: 'networkInspect',
  template: 'networkInspect',
  data: function() {
    return modules.collections.NetworksInspect.findOne({_host:this.params.host, Name:this.params.name});
  },
  onRun: function() {
    Meteor.call('network.inspect', {host:this.params.host, Name:this.params.name}, function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('network_inspect', this.params.host, this.params.name)];
  }
});
