commitSchemas = new SimpleSchema({
  repo: {
    type: String,
    label: "Repository",
    max: 96,
    trim: true
  },
  tag: {
    type: String,
    label: "Tag",
    max: 96,
    trim: true
  },
  comment: {
    type: String,
    label: "Comment",
    max: 256,
    optional: true,
    trim: true
  },
  author: {
    type: String,
    label: "Author",
    max: 96,
    optional: true,
    trim: true
  },
  Config: {
    type: Object,
    label: "Config",
    optional: true
  },
  'Config.Cmd': {
    type: [String],
    label: "Command",
    max: 256,
    optional: true,
    trim: true
  },
  'Config.Entrypoint': {
    type: [String],
    label: "Entrypoint",
    max: 256,
    optional: true,
    trim: true
  },
  'Config.User': {
    type: String,
    label: "User",
    max: 256,
    optional: true,
    trim: true
  },
  'Config.WorkingDir': {
    type: String,
    label: "Working Dir",
    max: 256,
    optional: true,
    trim: true
  },
  'Config.Tty': {
    type: Boolean,
    label: "TTY",
    optional: true
  },

  container: {
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
    containerCommit: {
      after: {
        'method': formNotifier('commit', 'containers')
      },
      before: {
        'method': function(doc) {
          doc.container = this.template.data.doc.Id;
          doc.host = this.template.data.doc.host;
          return doc;
        }
      }
    }
  });
}
