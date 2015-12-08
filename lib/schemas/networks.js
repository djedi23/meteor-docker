networkCreateSchemas = new SimpleSchema({
  Name: {
    type: String,
    label: "Name",
    max: 96,
    trim: true
  },
  Driver: {
    type: String,
    max: 32,
    label: "Driver",
    defaultValue: 'bridge', // supercede par config.Driver='local'; dans create.js
    allowedValues: ['bridge', 'host', 'null'],
    autoform: {
      options: 'allowed',
      template: "bootstrap-horizontal"
    }
  },
  IPAM: {
    type: String,
    label: "IPAM",
    optional: true,
    max: 96,
    trim: true
  },
  Options: {
    type: String,
    label: "Options",
    optional: true,
    max: 96,
    trim: true
  },
  CheckDuplicate: {
    type: Boolean,
    label: "Check Duplicate",
    optional: true,
    defaultValue: true
  },
  host: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }
  }
});

if (modules.schemas === undefined)
  modules.schemas = {};
modules.schemas.networkCreateSchemas = networkCreateSchemas;

var formNotifier = function(action, route) {
  return function(error, result) {
    if (error) {
      Notifications.error('Error', error);
      return null;
    }
    try {
      Notifications.success('docker ' + action, result);
      $('.modal.in').modal('hide');
    }
    catch (e) {
      console.log(e);
    }
    if (route)
      Router.go(route, this.currentDoc);
    return result;
  };
};

if (Meteor.isClient) {
  AutoForm.hooks({
    networkCreateSchemas: {
      after: {
        'method': formNotifier('network create', 'networks_list')
      }
    },
    'modules.schemas.networkCreateSchemas':{
      after: {
        'method': formNotifier('network create', 'networks_list')
      }
    }
  });
}