
swarmsUpdateSchemas = new SimpleSchema({
  Name: {
    type: String,
    label: "Name",
    optional:true,
    max: 96,
    trim: true
  },
  rotateWorkerToken: {
    type: Boolean,
    optional:true,
    trim: true
  },
  rotateManagerToken: {
    type: Boolean,
    optional:true,
    trim: true
  },
  "JoinTokens.Worker": {
    type: String,
    label: "Worker",
    optional:true,
    max: 96,
    trim: true
  },
  "JoinTokens.Manager": {
    type: String,
    label: "Manager",
    optional:true,
    max: 96,
    trim: true
  },
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
  },
  host: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  version: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }}
});

if (modules.schemas === undefined)
  modules.schemas = {};
modules.schemas.swarmsUpdateSchemas = swarmsUpdateSchemas;

if (Meteor.isClient) {
  AutoForm.hooks({
    swarmsUpdate: {
      after: {
        'method': formNotifier('swarm update', 'swarms_list')
      }
    }
  });
}