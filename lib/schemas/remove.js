imageRemoveSchemas = new SimpleSchema({
  force: {
    type: Boolean,
    optional: true,
    label: "Force"
  },
  noprune: {
    type: Boolean,
    optional: true,
    label: "No Prune"
  },
  tag: {
    type: String,
    optional: true,
    trim: true,
    label: "Tag"
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
    imageRemoveForm: {
      after: {
        'method': formNotifier('remove', 'images')
      }
    }
  });
}
