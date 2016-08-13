Router.route('/nodes', {
  name: 'nodes_list',
  template: 'nodesList',
  data: function() {
    var filter = {};
    if (Session.get('hostFilter'))
      filter = _.extend(filter,{_host:Session.get('hostFilter')});
    return modules.collections.Nodes.find(filter);
  },
  onRun: function() {
    Meteor.call('nodes.list', function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('nodes_list')];
  }
});


Router.route('/nodes/:host/:id/inspect', {
  name: 'nodesInspect',
  template: 'nodesInspect',
  data: function() {
    return modules.collections.NodesInspect.findOne({_host:this.params.host, ID:this.params.id});
  },
  onRun: function() {
    Meteor.call('nodes.inspect', {host:this.params.host, ID:this.params.id}, function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('nodes_inspect', this.params.host, this.params.id)];
  }
});
