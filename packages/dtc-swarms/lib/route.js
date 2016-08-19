Router.route('/swarms', {
  name: 'swarms_list',
  template: 'swarmsList',
  data: function() {
    var filter = {};
    if (Session.get('hostFilter'))
      filter = _.extend(filter,{_host:Session.get('hostFilter')});
    return modules.collections.Hosts.find(filter);
  },
  onRun: function() {
    Meteor.call('swarms.list', function() {});
    this.next()
  },
  subscriptions: function() {
    return [Meteor.subscribe('swarms_list')];
  }
});

Router.route('/swarms/:host/join', {
  name: 'swarmsJoin',
  template: 'swarmsJoin',
  data: function() {
    return {host:this.params.host};
  },
  subscriptions: function() {
    return [Meteor.subscribe('swarms_list')];
  }
});


Router.route('/swarms/:host/init', {
  name: 'swarmsInit',
  template: 'swarmsInit',
  data: function() {
    return {host:this.params.host};
  },
  subscriptions: function() {
    return [Meteor.subscribe('swarms_list')];
  }
});

Router.route('/swarms/:host/update', {
  name: 'swarmsUpdate',
  template: 'swarmsUpdate',
  data: function() {
    return SwarmsInspect.findOne({_host: this.params.host}); //{host:this.params.host};
  },
  subscriptions: function() {
    return [Meteor.subscribe('swarms_list')];
  }
});



// Router.route('/swarms/:host/:id/inspect', {
//   name: 'swarmsInspect',
//   template: 'swarmsInspect',
//   data: function() {
//     return modules.collections.SwarmsInspect.findOne({_host:this.params.host, ID:this.params.id});
//   },
//   onRun: function() {
//     Meteor.call('swarms.inspect', {host:this.params.host, ID:this.params.id}, function() {});
//     this.next()
//   },
//   subscriptions: function() {
//     return [Meteor.subscribe('swarms_inspect', this.params.host, this.params.id)];
//   }
// });
