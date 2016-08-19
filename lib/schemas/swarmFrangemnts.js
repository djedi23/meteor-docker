raftSchemas = new SimpleSchema({
  SnapshotInterval: {
    type: Number,
    optional:true,
    trim: true
  },
  KeepOldSnapshots: {
    type: Number,
    optional:true,
    trim: true
  },
  LogEntriesForSlowFollowers: {
    type: Number,
    optional:true,
    trim: true
  },
  HeartbeatTick: {
    type: Number,
    optional:true,
    trim: true
  },
  ElectionTick: {
    type: Number,
    optional:true,
    trim: true
  }
});


caConfig = new SimpleSchema({
  "NodeCertExpiry": {
    type: Number,
    optional:true,
    trim: true
  },
  "ExternalCA.Protocol": {
    type: String,
    optional:true,
    trim: true
  },
  "ExternalCA.URL": {
    type: String,
    optional:true,
    trim: true
  },
  "ExternalCA.Options": {
    type: String,
    optional:true,
    trim: true
  }
});
