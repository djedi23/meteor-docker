servicesCreateSchemas = new SimpleSchema({
  Name: {
    type: String,
    label: "Name",
    max: 96,
    trim: true
  },
  'TaskTemplate.ContainerSpec.Image': {
    type: String,
    label:"Image",
    max:96,
    trim:true
  },
  'TaskTemplate.ContainerSpec.Command': {
    type: [String],
    label:"Command",
    max:96,
    optional: true,
    trim:true
  },
  'TaskTemplate.ContainerSpec.Args': {
    type: [String],
    label:"Args",
    max:96,
    optional: true,
    trim:true
  },
  'TaskTemplate.ContainerSpec.Env': {
    type: [String],
    label: "Env",
    regEx: /^\w+=.*$/,
    max: 200,
    optional: true,
    trim: true
  },
  'TaskTemplate.ContainerSpec.Dir': {
    type: String,
    label:"Dir",
    max:256,
    optional: true,
    trim:true
  },
  'TaskTemplate.ContainerSpec.Labels.$.key': {
    type: String,
    label: "Key",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'TaskTemplate.ContainerSpec.Labels.$.value': {
    type: String,
    label: "Value",
    optional: true,
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },

  'Labels.$.key': {
    type: String,
    label: "Key",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'Labels.$.value': {
    type: String,
    label: "Value",
    optional: true,
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'Mode.Replicated.Replicas': {
    type: Number,
    label: 'Replicas',
    optional:true,
    decimal:false,
    min:0,
    max:16384,
    trim:true
  },
  host: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }},
  ID: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }},
  version: {
    type: Number,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }
  }});

if (modules.schemas === undefined)
  modules.schemas = {};
modules.schemas.servicesCreateSchemas = servicesCreateSchemas;

if (Meteor.isClient) {
  AutoForm.hooks({
    servicesCreate: {
      after: {
        'method': formNotifier('service created', 'services_list')
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
    },
    servicesUpdate: {
      after: {
        'method': formNotifier('service updated', 'services_list')
      }
    }
  });
}
