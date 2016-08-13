Template.containers.helpers({
  Image: function() {
    var image = washImageId(this.Image);
    var ipart = image.split(':');
    if (/^[0-9a-z]{64}$/.test(ipart[0])) {
      var image_ = Images.findOne({
        _host: this._host,
        Id: ipart[0]
      });
      if (image_ && image_.RepoTags[0])
        return washImageId(image_.RepoTags[0]);
      else {
        if (ipart.length >1)
          return ipart[0].substring(0, 12) + ':' + ipart[1];
        else
          return ipart[0].substring(0, 12);
      }
    } else
      return image;
  },
  ImageId: function() {
    var image_ = washImageId(this.Image);
    var ipart = image_.split(':');

    if (/^[0-9a-z]{64}$/.test(ipart[0]))
      var image = Images.findOne({
        _host: this._host,
        Id: queryImageId(ipart[0])
      });
    else
      image = Images.findOne({
        _host: this._host,
        RepoTags: queryImageId(image_)
      });
    if (image)
      return washImageId(image.Id);
    return undefined;
  },
//   Names: function() {
//     if (this.Names)
//       if (this.Names.toString().length > 40)
//         return this.Names.toString().substring(0, 40) + " ...";
//       else
//         return this.Names;
//     return null;
//   },
//   NamesFull: function() {
//     if (this.Names)
//       return this.Names;
//     return null;
//   },
  Created: function() {
    if (this.Created)
      return moment.unix(this.Created).fromNow();
    return null;
  },
  IdShort: function() {
    if (this.Id)
      return this.Id.substring(0, 12);
    return null;
  },
  hostId: function() {
    var host = Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  hostInvalid: function() {
    var host = Hosts.findOne(this._host);
    if (host && host.status)
      return host.status === true ? null : true;
    return true;
  },
  VirtualSize: function() {
    if (this.VirtualSize)
      return filesize(this.VirtualSize);
    return null;
  },
  haveData: function() {
    return this && this.count() > 0;
  },
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  canPause: function() {
    var status = modules.containers.statusParser(this.Status);
    return (modules.containers.status.up === status || modules.containers.status.restarting === status && modules.containers.status.paused !== status);
  },
  canUnPause: function() {
    var status = modules.containers.statusParser(this.Status);
    return modules.containers.status.paused === status;
  },
  canRestart: function() {
    var status = modules.containers.statusParser(this.Status);
    return modules.containers.status.up === status && modules.containers.status.paused !== status;
  },
  canStart: function() {
    var status = modules.containers.statusParser(this.Status);
    return modules.containers.status.exited === status;
  },
  canKill: function() {
    var status = modules.containers.statusParser(this.Status);
    return modules.containers.status.up === status || modules.containers.status.restarting === status;
  },
  canStop: function() {
    var status = modules.containers.statusParser(this.Status);
    return (modules.containers.status.up === status || modules.containers.status.restarting === status) && modules.containers.status.paused !== status;
  }
});

var currentContainer = new ReactiveVar();
actionHandler = function(modalId, method, routeSuccess, notificationMsg, notificationMsg2) {
  return function(e, tpl) {
    if (e.button === 1 || e.button === 2) {
      tpl.$(modalId + ' input[name="id"]').val(this.Id);
      tpl.$(modalId + ' input[name="host"]').val(this._host);
      tpl.$(modalId).modal();
      currentContainer.set(this._id);
      $(e.currentTarget).blur();
      return;
    } else if (e.button === 0) {
      var name = this.Name;
      Meteor.call(method, {
        host: this._host,
        id: this.Id
      }, function(error, result) {
        if (error)
          Notifications.error(notificationMsg, error.reason);
        else
          Notifications.success(notificationMsg, name + ' ' + notificationMsg2);
      });
      $(e.currentTarget).blur();
      if (routeSuccess)
        Router.go(routeSuccess);
    }
  };
};

var events = {
  'mousedown #brm': actionHandler('#containerRemoveModal', 'container.rm', 'containers', 'docker rm', 'removed'),
  'click #bpause': function(e) {
    var name = this.Name;
    Meteor.call('container.pause', this._host, this.Id, function(error, result) {
      if (error)
        Notifications.error('docker pause', error.reason);
      else
        Notifications.success('docker pause', name + " paused");
    });
    $(e.currentTarget).blur();
  },
  'click #bunpause': function(e) {
    var name = this.Name;
    Meteor.call('container.unpause', this._host, this.Id, function(error, result) {
      if (error)
        Notifications.error('docker unpause', error.reason);
      else
        Notifications.success('docker unpause', name + " unpaused");
    });
    $(e.currentTarget).blur();
  },
  'mousedown #brestart': actionHandler("#containerRestartModal", 'container.restart', null, 'docker restart', 'restarted'),
  'mousedown #bstart': actionHandler('#containerStartModal', 'container.start', null, 'docker start', 'started'),
  'mousedown #bkill': actionHandler('#containerKillModal', 'container.kill', null, 'docker kill', 'killed'),
  'mousedown #bstop': actionHandler('#containerStopModal', 'container.stop', null, 'docker stop', 'stopped')
};


Template.containers.events(events);


Template.containerInspect.helpers({
  configConfiguration:function(){
    return {
      json: this.Config,
      ignore:['_id','_host','top','logs'],
      templates:{
        'Image': 'jsonImageValue'
      }
    };
  },
  networkSettingsConfiguration:function(){
    var templates = { 'Image': 'jsonImageValue'};
    if (ensureApi(this._host, "1.21"))
      templates['Networks'] = 'jsonNetworksValue';

    return {
      json: this.NetworkSettings,
      ignore:['_id','_host','top','logs'],
      templates: templates
    };
  },
  ImageId: function(){
    var image = Images.findOne({RepoTags:this.Image});
    if (image)
      return washImageId(image.Id);
    return undefined;
  },
  Created: function() {
    return moment.unix(this.Created).fromNow();
  },
  IdShort: function() {
    if (this.Id)
      return this.Id.substring(0, 12);
    return undefined;
  },
  command: function() {
    var cmd = this.Path || '';
    if (this.Args)
      cmd += ' ' + this.Args.join(' ');
    return cmd;
  },
  ExposedPorts: function() {
    if (this.Config) {
      var ports = this.HostConfig.PortBindings || {};
      _.defaults(ports, this.Config.ExposedPorts);
      return _.map(_.pairs(ports),
        function(e) {
          if (_.isEmpty(e[1]))
            return e[0];
          else {
            return _.map(e[1],
              function(p) {
                return e[0] + '->' + (p.HostIp ? (p.HostIp + ':') : '') + p.HostPort;
              });
          }
        }).join(', ');
    }
    return '-';
  },
  Links: function() {
    if (this.HostConfig && this.HostConfig.Links) {
      var end = this.HostConfig.Links.length - 1;
      return _.map(this.HostConfig.Links,
        function(link, i) {
          var container = ContainersInspect.findOne({
            Name: link.split(':')[0]
          });
          if (container) {
            console.log(i, end);
            return {
              link: link,
              _host: container._host,
              id: container.Id,
              end: end === i
            };
          } else
            return {
              link: link
            };
        });
    }
    return null;
  },
  Binds: function() {
    if (this.HostConfig && this.HostConfig.Binds) {
      return this.HostConfig.Binds;
    }
    return '-';
  },
  Labels: function() {
    if (ensureApi(this._host, "1.18") && this.Config && this.Config.Labels) {
      return _.map(_.pairs(this.Config.Labels), function(label) {
        return filterChars(label[0]) + ' = ' + label[1];
      }).join(', ');
    }
    return '-';
  },
  logs: function() {
    if (this.logs)
      return ansi_up.ansi_to_html(ansi_up.escape_for_html(this.logs));
    return null;
  },
  haveData: function() {
    return !(!this);
  },
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostInvalid: function() {
    var host = Hosts.findOne(this._host);
    if (host && host.status)
      return host.status === true ? null : true;
    return true;
  },
  hostId: function() {
    var host = Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  host: function() {
    return this._host;
  },
  Kind: function(){
    if (this.Kind !== undefined){
      var map = ['C','A'];
      return map[this.Kind];
    }
    return null;
  },
  canPause: function() {
    if (this.State)
      return (this.State.Running && !this.State.Paused);
    return undefined;
  },
  canUnPause: function() {
    if (this.State)
      return (this.State.Running && this.State.Paused);
    return undefined;
  },
  canRestart: function() {
    if (this.State)
      return (this.State.Running && !this.State.Paused);
    return undefined;
  },
  canStart: function() {
    if (this.State)
      return !(this.State.Running);
    return undefined;
  },
  canRemove: function() {
    if (this.State)
      return !(this.State.Running);
    return undefined;
  },
  canKill: function() {
    if (this.State)
      return this.State.Running && !this.State.Paused;
    return undefined;
  },
  canStop: function() {
    if (this.State)
      return this.State.Running && !this.State.Paused;
    return undefined;
  },
  canExec: function() {
    if (this.State)
      return this.State.Running && !this.State.Paused;
    return undefined;
  }
});

Template.containerInspect.events(_.extend({
  'click .removeContainer': function(evt,tpl) {
    var self = this;
    var container = Template.parentData(1);
    var network = self;

    Meteor.call('network.disconnect', {
      host: network._host,
      network: network.Id,
      container: container.Id
    }, function(error, result) {
      $(evt.target).blur();
      if (error)
        Notifications.error('docker network connect', error.reason);
      else {
        Notifications.success('docker network connect', result);
        Meteor.call('container.details', container._host, container.Id);
        Meteor.call('network.inspect', {host: network._host,Name: network.Name});
        }}
    );
  }
}, events));

Template.containerInspect.onRendered(function() {
  var thiz = this;
  this.autorun(function() {
    var self = Template.currentData();
    if (self)
      Containers.find({
        Id: self.Id,
        _host: self._host
      }).observeChanges({
        removed: function(id) {
          Notifications.success('docker container ', self.Id + " removed");
          Router.go('containers');
        }
      });

    if (self && !thiz.hearthbeat ){
      thiz.hearthbeat = Meteor.setInterval(function() {
        Meteor.apply('container.details', [self._host, self.Id], {
          wait: true
        });
      }, 5000);
      selfFlag = self;
    }
  });
});

Template.containerInspect.onDestroyed(function() {
  if (this.hearthbeat){
    Meteor.clearInterval(this.hearthbeat);
  }
});


Template.containerCommit.helpers({
  IdShort: function() {
    if (this.Id)
      return this.Id.substring(0, 12);
    return null;
  },
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host = Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  config: function() {
    var config = {};
    config.Id = this.Id;
    config.host = this._host;
    config.Config = this.Config;

    if (Meteor.user() && Meteor.user().emails && Meteor.user().emails.length > 0)
      config.author = Meteor.user().emails[0].address;
    return config;
  }
});

Template.containerRename.helpers({
  IdShort: function() {
    if (this.Id)
      return this.Id.substring(0, 12);
    return null;
  },
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host = Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  config: function() {
    var config = {};
    config.id = this.Id;
    config.host = this._host;
    config.Name = this.Names;

    return config;
  }
});


Template.containerExecCreate.helpers({
  IdShort: function() {
    if (this.Id)
      return this.Id.substring(0, 12);
    return null;
  },
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host = Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  config: function() {
    var config = {};
    config.id = this.Id;
    config.host = this._host;

    return config;
  }
});

Template.containerModals.helpers({
  configRemove: function() {
    var self = Containers.findOne({
      _id: currentContainer.get()
    });
    if (!self)
      self = ContainersInspect.findOne({
        _id: currentContainer.get()
      });
    if (!self)
      return null;
    var config = modules.call('container.remove.parameter.config', self, self._host, self.Id);
    if (!config) {
      config = self;
    }
    return config;
  },
  configStop: function() {
    var self = Containers.findOne({
      _id: currentContainer.get()
    });
    if (!self)
      self = ContainersInspect.findOne({
        _id: currentContainer.get()
      });
    if (!self)
      return null;
    var config = modules.call('container.stop.parameter.config', self, self._host, self.Id);
    if (!config) {
      config = self;
    }
    return config;
  }
});

Template.containerFilter.helpers({
  value: function() {
    return Session.get('containerFilter');
  }
});
Template.containerFilter.events(eventsForFilters('containerFilter'));

Template.containerImgFilter.helpers({
  value: function() {
    return Session.get('containerImgFilter');
  }
});
Template.containerImgFilter.events(eventsForFilters('containerImgFilter'));

Template.jsonNetworksValue.helpers({
  value: function(){
    var self = this.config.json;
    var ids = _.pairs(self);
    if (ids.length > 0){
      var cts = NetworksInspect.find({
        Name: {
          $in:_.map(ids, function(e) {
            return e[0];
          })}});
          return cts;
  }  else
      return null;
  }
});
