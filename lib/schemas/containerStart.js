containerStartSchemas = new SimpleSchema({
  a: {
    type: Boolean,
    optional: true,
    label: "Attach"
  },
  i: {
    type: Boolean,
    optional: true,
    label: "interactive"
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
    containerStartForm: {
      after: {
        'method': formNotifier('start', null)
      }
    }
  });
}
