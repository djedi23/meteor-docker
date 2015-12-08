containerRenameSchemas = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
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
    containerRenameForm: {
      after: {
        'method': formNotifier('rename', 'containersInspect')
      }
    }
  });
}
