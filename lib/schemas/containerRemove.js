
containerRemoveSchemas = new SimpleSchema({
  force: {
    type: Boolean,
    optional:true,
    label: "Force"
  },
  link: {
    type: Boolean,
    optional:true,
    label: "Link"
  },
  v: {
    type: Boolean,
    optional:true,
    label: "Volumes"
  }
  ,id: {
    type: String,
    autoform: {
      type: 'hidden',
      label:false
    }
  }
  ,host: {
    type: String,
    autoform: {
      type: 'hidden',
      label:false
    }
  }
});

if (Meteor.isClient){
  AutoForm.hooks({
    containerRemoveForm: {
      after: {
        'method': formNotifier('rm','containers')}
    }});
}

