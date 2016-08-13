Router.route('/services', {
  name: 'services_list',
  template: 'servicesList',
  data: function() {
    var filter = {};
    if (Session.get('hostFilter'))
      filter = _.extend(filter,{_host:Session.get('hostFilter')});
    return modules.collections.Services.find(filter);
  },
  onRun: function() {
    Meteor.call('services.list', function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('services_list')];
  }
});


Router.route('/services/:host/:id/inspect', {
  name: 'servicesInspect',
  template: 'servicesInspect',
  data: function() {
    return modules.collections.ServicesInspect.findOne({_host:this.params.host, ID:this.params.id});
  },
  onRun: function() {
    Meteor.call('services.inspect', {host:this.params.host, ID:this.params.id}, function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('services_inspect', this.params.host, this.params.id)];
  }
});

Router.route('/services/create', {
  name: 'servicesCreate',
  template: 'servicesCreate'
});

Router.route('/services/:host/:id/update', {
  name: 'servicesUpdate',
  template: 'servicesUpdate',
  data: function() {
    return modules.collections.ServicesInspect.findOne({_host:this.params.host, ID:this.params.id});
  },
  onRun: function() {
    Meteor.call('services.inspect', {host:this.params.host, ID:this.params.id}, function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('services_inspect', this.params.host, this.params.id)];
  }
});
