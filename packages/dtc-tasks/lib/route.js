Router.route('/tasks', {
  name: 'tasks_list',
  template: 'tasksList',
  data: function() {
    var filter = {};
    if (Session.get('hostFilter'))
      filter = _.extend(filter,{_host:Session.get('hostFilter')});
    return modules.collections.Tasks.find(filter);
  },
  onRun: function() {
    Meteor.call('tasks.list', function() {});
    Meteor.call('nodes.list', function() {});
    Meteor.call('services.list', function() {});
    Meteor.call('containers.list', function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('tasks_list')];
  }
});


Router.route('/tasks/:host/:id/inspect', {
  name: 'tasksInspect',
  template: 'tasksInspect',
  data: function() {
    return modules.collections.TasksInspect.findOne({_host:this.params.host, ID:this.params.id});
  },
  onRun: function() {
    Meteor.call('tasks.inspect', {host:this.params.host, ID:this.params.id}, function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('tasks_inspect', this.params.host, this.params.id)];
  }
});
