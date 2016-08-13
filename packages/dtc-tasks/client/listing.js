Template.tasksList.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host =  Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  StatusClass: function(){
    switch(this.Status.State){
      case 'running':
      return 'label-success';
      case 'shutdown':
      case 'rejected':
      return 'label-danger';
      default:
      return 'label-info';
    }
  },
  Node: function(){
    var node = Nodes.findOne({ID:this.NodeID});
    if (node && node.Description && node.Description.Hostname)
      return node.Description.Hostname;
    else
      return this.NodeID;
  },
  Service: function(){
    var service = Services.findOne({ID:this.ServiceID});
    if (service && service.Spec && service.Spec.Name)
      return service.Spec.Name;
    else
      return this.ServiceID;
  },
  Container: function(){
    var container = Containers.findOne({Id:this.Status.ContainerStatus.ContainerID});
    if (container &&  container.Names)
      return container.Names[0];
    else
      return this.Status.ContainerStatus.ContainerID?this.Status.ContainerStatus.ContainerID.substring(0, 12):'';
  },
  canLinkContainer: function(){
    var container = Containers.findOne({Id:this.Status.ContainerStatus.ContainerID});
    return container;
  },
  ContainerHost: function(){
    var container = Containers.findOne({Id:this.Status.ContainerStatus.ContainerID});
    return container._host;
  }
});



// Template.tasksList.events({
//   'click #bcremove': function(evt, tpl) {
//     var opts = {
//       host: this._host,
//       Name: this.Name
//     };

//     Meteor.call('tasks.remove', opts, function(error, result) {
//       if (error)
//         Notifications.error('docker tasks rm', error.reason);
//       else {
//         Notifications.success('docker tasks rm', result);
//         Meteor.call('tasks.list');
//       }
//     });
//     $(evt.currentTarget).blur();
//   }
// });