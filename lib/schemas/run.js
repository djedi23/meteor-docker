runSchemas = new SimpleSchema({
  name: {
    type: String,
    optional: true,
    label: "Name",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  command: {
    type: String,
    optional: true,
    label: "Command",
    max: 512,
    trim: true
  },
  args: {
    type: [String],
    label: "Arguments",
    optional: true,
    max: 512,
    trim: true
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
  OpenStdin: {
    type: Boolean,
    label: "Opens Stdins",
    optional: true
  },
  StdinOnce: {
    type: Boolean,
    label: "Close stdin after the 1 attached client disconnects",
    optional: true
  },
  Entrypoint: {
    type: [String],
    label: "Entrypoint",
    optional: true,
    //	regEx: /^\w+$/,
    max: 200,
    trim: true
  },
  Tty: {
    type: Boolean,
    label: "tty",
    optional: true
  },
  PublishAllPorts: {
    type: Boolean,
    label: "Publish all ports",
    optional: true
  },
  publish: {
    type: [Object],
    label: "Publish",
    optional: true
  },
  Labels: {
    type: [Object],
    label: "Labels",
    optional: true
  },
  links: {
    type: [Object],
    label: "Links",
    optional: true
  },
  Binds: {
    type: [String],
    label: "Volumes",
    optional: true
  },
  Env: {
    type: [String],
    label: "Env",
    regEx: /^\w+=.*$/,
    max: 200,
    optional: true
  },
  Ulimits: {
    type: [Object],
    label: "Ulimits",
    optional: true
  },
  User: {
    type: String,
    label: "User",
    optional: true,
    regEx: /^\w+$/,
    max: 200,
    trim: true
  },
  WorkingDir: {
    type: String,
    label: "Working Dir",
    optional: true,
    //	regEx: /^\w+$/,
    max: 200,
    trim: true
  },
  Memory: {
    type: Number,
    label: "Memory",
    optional: true,
    trim: true
  },
  MemorySwap: {
    type: Number,
    label: "Memory Swap",
    optional: true,
    trim: true
  },
  'RestartPolicy': {
    type: Object,
    optional: true,
    label: "Restart Policy"
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
  'links.$.container_name': {
    type: String,
    label: "Container name",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'links.$.alias': {
    type: String,
    label: "Alias",
    optional: true,
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'publish.$.port': {
    type: Object,
    label: "From"
  },
  'publish.$.port.port': {
    type: Number,
    label: "port",
    min: 1,
    max: 65535
  },
  'publish.$.port.protocol': {
    type: String,
    label: "protocol",
    allowedValues: ['tcp', 'udp'],
    autoform: {
      options: 'allowed',
      template: "bootstrap-horizontal"
    }
  },
  'publish.$.host.hostIp': {
    type: String,
    label: "Host Ip",
    optional: true,
    trim: true,
    regEx: SimpleSchema.RegEx.IP
  },
  'publish.$.host.hostPort': {
    type: Number,
    label: "Host Port",
    optional: true,
    min: 1,
    max: 65535
  },
  'Ulimits.$.Name': {
    type: String,
    label: "Name",
    optional: true,
    max: 32,
    trim: true,
    regEx: /\/?[a-z]+/,
    allowedValues: ['cpu', 'fsize', 'data', 'stack', 'core', 'rss', 'nproc', 'nofile', 'memlock', 'as', 'locks', 'sigpending', 'msgqueue', 'nice', 'rtprio', 'rttime'],
    autoform: {
      options: 'allowed'
    }
  },
  'Ulimits.$.Soft': {
    type: Number,
    label: "Soft",
    optional: true,
    trim: true
  },
  'Ulimits.$.Hard': {
    type: Number,
    label: "Hard",
    optional: true,
    trim: true
  },
  'RestartPolicy.Name': {
    type: String,
    optional: true,
    trim: true,
    label: "Name",
    allowedValues: ['always', 'on-failure'],
    defaultValue: 'always',
    autoform: {
      options: 'allowed',
      template: "bootstrap-horizontal"
    }
  },
  'RestartPolicy.MaximumRetryCount': {
    type: Number,
    optional: true,
    label: "Maximum Retry Count"
  }

  ,
  host: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  id: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false
    }
  }
});


if (Meteor.isClient) {
  AutoForm.hooks({
    imageRun: {
      after: {
        'method': formNotifier('run', 'containersInspect', function(doc) {
          return {
            host: doc.host,
            id: doc.Id
          };
        })
      },
      before: {
        'method': function(doc) {
          doc.host = this.template.data.doc.host;
          doc.id = this.template.data.doc.Id;
          return doc;
        }
      }
    }
  });
}
