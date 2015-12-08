volumeCreateSchemas = new SimpleSchema({
  Name: {
    type: String,
    label: "Name",
    max: 96,
    trim: true
  },
  Driver: {
    type: String,
    max: 32,
    label: "Driver",
    defaultValue: 'local', // supercede par config.Driver='local'; dans create.js
    allowedValues: ['local'],
    autoform: {
      options: 'allowed',
      template: "bootstrap-horizontal"
    }
  },
  DriverOpts: {
    type: String,
    label: "Driver Options",
    optional: true,
    max: 96,
    trim: true
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

if (modules.schemas === undefined)
  modules.schemas = {};
modules.schemas.volumeCreateSchemas = volumeCreateSchemas;

if (Meteor.isClient) {
  AutoForm.hooks({
    volumeCreateSchemas: {
      after: {
        'method': formNotifier('volume create', 'volumes_list')
          /*      },
                before: {
                  'method': function(doc) {
                    console.log("before", this.template.data.doc);
                    //                    doc.id = this.template.data.doc.Id;
                    doc.host = this.template.data.doc._host;
                    return doc;
                  }
          */
      }
    }
  });
}
