subs = new SubsManager();

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

var imagesRouteOptions = {
  template: 'images',
  data: function () {
    var filter = {};
    if (Session.get('hostFilter'))
      filter = _.extend(filter,{_host:Session.get('hostFilter')});
    if (Session.get('imageFilter'))
      filter = _.extend(filter,{RepoTags:{$regex: Session.get('imageFilter')}});

    return Images.find(filter, {sort: {Created: -1}});
  },
  onRun: function() {
    Meteor.call('images.list',function(){});
    this.next()
  },
  subscriptions: function() {
    return subs.subscribe('images');
  }};


//Router.route('/', _.extend(_.clone(imagesRouteOptions),{template:'home', name:'home'}));
Router.route('/', {
  name:'home',
  template: 'home',
  data: function () {
   var filter = {};
   if (Session.get('hostFilter'))
     filter = _.extend(filter,{_host:Session.get('hostFilter')});
   if (Session.get('containerFilter'))
     filter = _.extend(filter,{Names:{$regex: Session.get('containerFilter')}});
   if (Session.get('containerImgFilter'))
     filter = _.extend(filter,{Image:{$regex: Session.get('containerImgFilter')}});
   return Containers.find(filter, {sort: {Created: -1}});
  },
  onRun: function() {
    Meteor.call('containers.list',function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ subs.subscribe('containers'),
      modules.call('router.subscribe.container.remove',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.stop',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.start',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.restart',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.kill',self, this.params.host, this.params.id)
    ];
  }});



Router.route('/images', _.extend(_.clone(imagesRouteOptions),{name:'images'}));

Router.route('/images/:host/:id/inspect', {
  name:'imagesInspect',
  template: 'imageInspect',
  data: function () {
    return ImagesInspect.findOne({Id:queryImageId(this.params.id), _host:this.params.host});
  },
  onRun: function() {
    Meteor.call('image.details',this.params.host, this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('imageInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.image.remove',self, this.params.host, this.params.id)];
  }
});

Router.route('/images/:host/:id/run', {
  name:'imageRunParameter',
  template: 'imageRunParameter',
  data: function () {
    return ImagesInspect.findOne({Id:this.params.id, _host:this.params.host});
  },
  onRun: function(){
    Meteor.call('image.details', this.params.host, this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('imageInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.image.run',self, this.params.host, this.params.id)];
  }
});

Router.route('/images/:host/:id/tag', {
  name:'imageTagParameter',
  template: 'imageTagParameter',
  data: function () {
    return ImagesInspect.findOne({_host:this.params.host, Id:this.params.id});
  },
  onRun: function() {
    Meteor.call('image.details',this.params.host, this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('imageInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.image.tag',self, this.params.host, this.params.id)];
  }
});


Router.route('/images/pull', {
  name:'imagePull',
  template: 'imagePullParameter',
  subscriptions: function() {
    var self = this;
    return modules.call('router.subscribe.image.pull',self, this.params.host, this.params.id);
  }
});

Router.route('/images/:host/:id/push', {
  name:'imagePushParameter',
  template: 'imagePushParameter',
  data: function () {
    return ImagesInspect.findOne({_host:this.params.host, Id:this.params.id});
  },
  onRun: function() {
    Meteor.call('image.details',this.params.host, this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('imageInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.image.push',self, this.params.host, this.params.id)];
  }
});



Router.route('/containers', {
  name:'containers',
  template: 'containers',
  data: function () {
   var filter = {};
   if (Session.get('hostFilter'))
     filter = _.extend(filter,{_host:Session.get('hostFilter')});
   if (Session.get('containerFilter'))
     filter = _.extend(filter,{Names:{$regex: Session.get('containerFilter')}});
   if (Session.get('containerImgFilter'))
     filter = _.extend(filter,{Image:{$regex: Session.get('containerImgFilter')}});
   return Containers.find(filter, {sort: {Created: -1}});
  },
  onRun: function() {
    Meteor.call('containers.list',function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ subs.subscribe('containers'),
      modules.call('router.subscribe.container.remove',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.stop',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.start',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.restart',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.kill',self, this.params.host, this.params.id)
    ];
  }});

Router.route('/containers/:host/:id/inspect', {
  name:'containersInspect',
  template: 'containerInspect',
  data: function () {
    return ContainersInspect.findOne({_host:this.params.host,Id:this.params.id});
  },
  onRun: function() {
    Meteor.call('container.details',this.params.host, this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('containerInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.container.remove',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.stop',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.start',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.restart',self, this.params.host, this.params.id),
      modules.call('router.subscribe.container.kill',self, this.params.host, this.params.id)
    ];
  }
});

Router.route('/containers/:host/:id/rename', {
  name:'containerRename',
  template: 'containerRename',
  data: function () {
    return ContainersInspect.findOne({_host:this.params.host,Id:this.params.id});
  },
  onRun: function() {
    Meteor.call('container.details',this.params.host, this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('containerInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.container.rename',self, this.params.host, this.params.id)];
  }
});


Router.route('/containers/:host/:id/commit', {
  name:'containerCommit',
  template: 'containerCommit',
  data: function () {
    return ContainersInspect.findOne({_host:this.params.host, Id:this.params.id});
  },
  onRun: function(){
    Meteor.call('container.details',this.params.host,this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('containerInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.container.commit',self, this.params.host, this.params.id)];
  }
});


// Router.route('/containers/:hostId/:containerId/copy',
//     function(){
//         var self = this;
//         var hostId = this.params.hostId;
//         var containerId = this.params.containerId;
//         console.log(hostId,containerId, this.userId);
//         check(hostId, checkHostId);
//         check(containerId, checkDockerId);
//          if (! Roles.userIsInRole(this.userId, ['admin','container.copy']))
//              throw new Meteor.Error(403, "Not authorized to copy container");

//         var container = docker[hostId].getContainer(containerId);
//         if (container){
//          container.copy({"Resource": "/etc"},Meteor.bindEnvironment(
//                 function (err, tarStream) {
//                     //console.log("log",logs, err);
//                     if (err){
//                         console.log('copy err',err);
//                      return;
//                     }

//                  tarStream.pipe(process.stdout);
//              }));
//         }
//     }, {where: 'server', name:'containerCopy'});


Router.route('/containers/:host/:id/exec/create', {
  name:'containerExecCreate',
  template: 'containerExecCreate',
  data: function () {
    return ContainersInspect.findOne({_host:this.params.host,Id:this.params.id});
  },
  onRun: function() {
    Meteor.call('container.details',this.params.host, this.params.id ,function(){});
    this.next()
  },
  subscriptions: function() {
    var self = this;
    return [ Meteor.subscribe('containerInspect', this.params.host, this.params.id),
      modules.call('router.subscribe.container.exec.create',self, this.params.host, this.params.id)];
  }
});



Router.route('/host', {
  name:'host',
  template: 'host',
  data: function () {
    return Hosts.find();
  },
  onRun: function() {
    Meteor.call('host.details',function(){});
    this.next()
  },
  subscriptions: function() {
    return subs.subscribe('hosts');
  }});



AccountsTemplates.configureRoute('signIn');
