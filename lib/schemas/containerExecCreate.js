containerExecCreateSchemas = new SimpleSchema({
  Cmd: {
    type: [String],
    max: 256,
    trim: true,
    label: "Command"
  },
  AttachStderr: {
    type: Boolean,
    label: "Attach Stderr",
    optional: true
  },
  AttachStdin: {
    type: Boolean,
    label: "Attach Stdin",
    optional: true
  },
  AttachStdout: {
    type: Boolean,
    label: "Attach Stdout",
    optional: true
  },
  Tty: {
    type: Boolean,
    label: "tty",
    optional: true
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
    containerExecCreateForm: {
      after: {
        'method': formNotifier('execCreate', null)
      }
    }
  });
}
