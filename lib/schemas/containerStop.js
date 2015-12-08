containerStopSchemas = new SimpleSchema({
  t: {
    type: Number,
    optional: true,
    min: 0,
    defaultValue: 10,
    label: "Time"
  },
  id: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  host: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false
    }
  }
});

if (Meteor.isClient) {
  AutoForm.hooks({
    containerStopForm: {
      after: {
        'method': formNotifier('stop', null)
      }
    },
    containerRestartForm: {
      after: {
        'method': formNotifier('restart', null)
      }
    }
  });
}
