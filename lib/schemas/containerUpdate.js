containerUpdateSchemas = new SimpleSchema({
  BlkioWeight: {
    type: Number,
    optional:true,
    trim: true
  },
  CpuShares: {
    type: Number,
    optional:true,
    trim: true
  },
  CpuPeriod: {
    type: Number,
    optional:true,
    trim: true
  },
  CpuQuota: {
    type: Number,
    optional:true,
    trim: true
  },
  CpusetCpus: {
    type: String,
    optional:true,
    max: 96,
    trim: true
  },
  CpusetMems: {
    type: String,
    optional:true,
    max: 96,
    trim: true
  },
  Memory: {
    type: Number,
    optional:true,
    trim: true
  },
  MemorySwap: {
    type: Number,
    optional:true,
    trim: true
  },
  MemoryReservation: {
    type: Number,
    optional:true,
    trim: true
  },
  KernelMemory: {
    type: Number,
    optional:true,
    trim: true
  },
  RestartPolicy: {
    type: RestartPolicySchema
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
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }}
});

if (modules.schemas === undefined)
  modules.schemas = {};
modules.schemas.containerUpdateSchemas = containerUpdateSchemas;

if (Meteor.isClient) {
  AutoForm.hooks({
    containerUpdateForm: {
      after: {
        'method': formNotifier('container updated', 'containersInspect')
      }
    },
  });
}
