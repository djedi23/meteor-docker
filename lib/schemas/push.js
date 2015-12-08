pushSchemas = new SimpleSchema({
  name: {
    type: String,
    label: "Repository/tag",
    max: 96,
    trim: true
  },
  tag: {
    type: String,
    label: "Remote Tag",
    optional: true,
    max: 96,
    trim: true
  },
  id: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }
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


if (Meteor.isClient) {
  AutoForm.hooks({
    imagePush: {
      after: {
        'method': formNotifier('push', 'images')
      },
      before: {
        'method': function(doc) {
          doc.id = this.template.data.doc.Id;
          doc.host = this.template.data.doc._host;
          return doc;
        }
      }
    }
  });
}
