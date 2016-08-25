modules.hostIdRegExp = /^[0-9A-Za-z][-_ .0-9A-Za-z]{0,64}$/;

formNotifier = function(action, route, mapping) {
  return function(error, result) {
    if (error) {
      Notifications.error('Error', error);
      return null;
    }
    try {
      Notifications.success('docker ' + action, result);
      $('.modal.in').modal('hide');
    } catch (e) {
      console.log(e);
    }
    if (route) {
      var doc = this.currentDoc;
      if (mapping)
        doc = mapping(doc,result);
      Router.go(route, doc);
      $('.modal-backdrop').remove();
      $('.modal-open').removeClass('modal-open');
    }
    return result;
  };
};


RestartPolicySchema = new SimpleSchema({
  'Name': {
    type: String,
    optional: true,
    trim: true,
    label: "Name",
    allowedValues: ['always', 'on-failure'],
    defaultValue: 'always',
    autoform: {
      options: 'allowed',
      template: "bootstrap-horizontal"
    }
  },
  'MaximumRetryCount': {
    type: Number,
    optional: true,
    label: "Maximum Retry Count"
  }
});
