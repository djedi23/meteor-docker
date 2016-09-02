containerExecCreateSchemas = new SimpleSchema({
  Cmd: {
    type: [String],
    max: 256,
    trim: true,
    label: "Command"
  },
  User: {
    type: String,
    optional: true
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
  Privilegied: {
    type: Boolean,
    optional: true
  },
  Detach: {
    type: Boolean,
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
	'method': formNotifier('exec Create','execAttach', (doc,result)=>{Session.set('attachKey',result.key); return {host:result._host, id:result.ContainerID, eid:result.ID};})
      }
    }
  });
}
