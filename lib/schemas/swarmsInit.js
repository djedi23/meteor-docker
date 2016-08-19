var specSchema = new SimpleSchema({
  "Dispatcher.HeartbeatPeriod": {
    type: Number,
    optional:true,
    trim: true
  },
  "Orchestration.TaskHistoryRetentionLimit": {
    type: Number,
    label: "Task History Retention Limit",
    optional:true,
    trim: true
  },
  "Raft": {
    type: raftSchemas
  },
  "CAConfig": {
    type: caConfig
  }
});

swarmsInitSchemas = new SimpleSchema({
  ListenAddr: {
    type: String,
    label: "Listen Address",
    optional:true,
    max: 96,
    trim: true
  },
  AdvertiseAddr: {
    type: String,
    label: "Advertise Address",
    optional:true,
    max: 96,
    trim: true
  },
  ForceNewCluster: {
    type: Boolean,
    label: "Force new cluster",
    optional:true,
    trim: true
  },
  Spec: {
    type: specSchema
  },
  host: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }}
});

if (modules.schemas === undefined)
  modules.schemas = {};
modules.schemas.swarmsInitSchemas = swarmsInitSchemas;

if (Meteor.isClient) {
  AutoForm.hooks({
    swarmsInit: {
      after: {
        'method': formNotifier('swarm init', 'swarms_list')
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
    //     servicesUpdate: {
    //       after: {
    //         'method': formNotifier('service updated', 'services_list')
    //       }
    //     }
  });
}
