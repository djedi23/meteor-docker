
modules.hostIdRegExp = /^[0-9A-Za-z][-_ .0-9A-Za-z]{0,64}$/;

var formNotifier = function(action, route) {
  return function(error, result, template) {
    if (error){
      Notifications.error('Error', error);
      return null;
    }
    try{
      Notifications.success('docker '+action, result);
      $('.modal.in').modal('hide');
    } catch(e){
      console.log(e);
    }
    if (route)
      Router.go(route,{host: template.data.doc?template.data.doc.host:template.data.host, id:result});
    return result;
  };
};


runSchemas = new SimpleSchema({
  name: {
    type: String,
    optional:true,
    label: "Name",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  command: {
    type: String,
    optional:true,
    label: "Command",
    max: 512,
    trim: true
  },
  args: {
    type: [String],
    label: "Arguments",
    optional:true,
    max: 512,
    trim: true
  },
  AttachStderr: {
    type: Boolean,
    label: "Attach Stderr",
    optional:true
  },
  AttachStdin: {
    type: Boolean,
    label: "Attach Stdin",
    optional:true
  },
  AttachStdout: {
    type: Boolean,
    label: "Attach Stdout",
    optional:true
  },
  OpenStdin: {
    type: Boolean,
    label: "Opens Stdins",
    optional:true
  },
  StdinOnce: {
    type: Boolean,
    label: "Close stdin after the 1 attached client disconnects",
    optional:true
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
    optional:true
  },
  PublishAllPorts: {
    type: Boolean,
    label: "Publish all ports",
    optional:true
  },
  publish: {
    type: [Object],
    label: "Publish",
    optional:true
  },
  Labels: {
    type: [Object],
    label: "Labels",
    optional:true
  },
  links: {
    type: [Object],
    label: "Links",
    optional:true
  },
  Binds: {
    type: [String],
    label: "Volumes",
    optional:true
  },
  Env: {
    type: [String],
    label: "Env",
    regEx: /^\w+=.*$/,
    max: 200,
    optional:true
  },
  Ulimits: {
    type: [Object],
    label: "Ulimits",
    optional:true
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
  'RestartPolicy' :{
    type: Object,
    optional:true,
    label:"Restart Policy"
  },
  'Labels.$.key' :{
    type: String,
    label:"Key",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'Labels.$.value' :{
    type: String,
    label:"Value",
    optional:true,
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'links.$.container_name' :{
    type: String,
    label:"Container name",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'links.$.alias' :{
    type: String,
    label:"Alias",
    optional:true,
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
  },
  'publish.$.port' :{
    type: Object,
    label:"From"
  },
  'publish.$.port.port' :{
    type: Number,
    label:"port",
    min:1,
    max:65535
  },
  'publish.$.port.protocol' :{
    type: String,
    label:"protocol",
    allowedValues: ['tcp','udp'],
    autoform: {
      options: 'allowed',
      template:"bootstrap-horizontal"
    }
  },
  'publish.$.host.hostIp':{
    type: String,
    label:"Host Ip",
    optional:true,
    trim:true,
    regEx:SimpleSchema.RegEx.IP
  },
  'publish.$.host.hostPort':{
    type: Number,
    label:"Host Port",
    optional:true,
    min:1,
    max:65535
  },
  'Ulimits.$.Name' :{
    type: String,
    label:"Name",
    optional:true,
    max: 32,
    trim: true,
    regEx: /\/?[a-z]+/,
    allowedValues: ['cpu', 'fsize', 'data', 'stack', 'core', 'rss', 'nproc', 'nofile', 'memlock', 'as', 'locks', 'sigpending', 'msgqueue', 'nice', 'rtprio', 'rttime'],
    autoform: {
      options: 'allowed'
    }
  },
  'Ulimits.$.Soft' :{
    type: Number,
    label:"Soft",
    optional:true,
    trim: true
  },
  'Ulimits.$.Hard' :{
    type: Number,
    label:"Hard",
    optional:true,
    trim: true
  },
  'RestartPolicy.Name' :{
    type: String,
    optional:true,
    trim:true,
    label:"Name",
    allowedValues: ['always','on-failure'],
    defaultValue:'always',
    autoform: {
      options: 'allowed',
      template:"bootstrap-horizontal"
    }
  },
  'RestartPolicy.MaximumRetryCount' :{
    type: Number,
    optional:true,
    label:"Maximum Retry Count"
  }

     ,host: {
       type: String,
       autoform: {
         type: 'hidden',
         label:false
       }
     }
    ,id: {
      type: String,
      autoform: {
        type: 'hidden',
        label:false
      }
    }
});


if (Meteor.isClient){
  AutoForm.hooks({
    imageRun: {
      after: {
        'image.run': formNotifier('run', 'containersInspect')},
      before: {
        'image.run': function(doc, template) {
	      doc.host = template.data.doc.host;
	      doc.id = template.data.doc.Id;
	      return doc;
            }}}});
}


tagSchemas = new SimpleSchema({
  repo: {
    type: String,
    label: "Repository",
    max: 96,
    trim: true
  },
  tag: {
    type: String,
    label: "Tag",
    max: 96,
    trim: true
  }
            ,force: {
	      type: Boolean,
              optional:true,
	      label: "Force"
            }
   ,id: {
     type: String,
     optional:true,
     autoform: {
       type: 'hidden',
       label:false
     }
   }
    ,host: {
      type: String,
      optional:true,
      autoform: {
        type: 'hidden',
        label:false
      }
    }
});



if (Meteor.isClient){
  AutoForm.hooks({
    imageTag: {
      after: {
        'image.tag': formNotifier('tag', 'images')},
      before: {
        'image.tag': function(doc, template) {
		    doc.id = template.data.doc.Id;
		    doc.host = template.data.doc._host;
		    return doc;
                  }}}});
}


pushSchemas = new SimpleSchema({
  name: {
    type: String,
    label: "Repository/tag",
    max: 96,
    trim: true
  },
  tag: {
    type: String,
    label: "Remote Tag",
    optional: true,
    max: 96,
    trim: true
  }
    ,id: {
      type: String,
      optional:true,
      autoform: {
        type: 'hidden',
        label:false
      }
    }
       ,host: {
	 type: String,
         optional:true,
	 autoform: {
           type: 'hidden',
           label:false
	 }
       }
});


if (Meteor.isClient){
  AutoForm.hooks({
    imagePush: {
      after: {
        'image.push': formNotifier('push', 'images')},
      before: {
        'image.push': function(doc, template) {
		    doc.id = template.data.doc.Id;
		    doc.host = template.data.doc._host;
		    return doc;
                  }}}});
}



pullSchemas = new SimpleSchema({
  fromImage: {
    type: String,
    //        optional:true,
    label: "From Image",
    max: 512,
    trim: true
  },
  tag: {
    type: String,
    optional:true,
    label: "Tag",
    max: 512,
    trim: true
  },
  fromSrc: {
    type: String,
    optional:true,
    label: "From Src",
    max: 512,
    trim: true
  },
  repo: {
    type: String,
    optional:true,
    label: "Repo",
    max: 512,
    trim: true
  },
  registry: {
    type: String,
    optional:true,
    label: "Registry",
    max: 512,
    trim: true
  },
  host: {
    type: String,
    autoform: {
      options: function () {
        return Hosts.find().map(function (c, i) {
	         return {label: c.Id, value: c._id};
	       });
      }}}
});

if (Meteor.isClient){
  AutoForm.hooks({
    imagePull: {
      after: {
        'image.pull': formNotifier('pull', 'images')}
    }});
}


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
        'container.rm': formNotifier('rm','containers')}
    }});
}


containerStopSchemas = new SimpleSchema({
  t: {
    type: Number,
    optional:true,
    min:0,
    defaultValue:10,
    label: "Time"
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
    containerStopForm: {
      after: {
        'container.stop': formNotifier('stop',null)}
    },
    containerRestartForm: {
      after: {
        'container.restart': formNotifier('restart',null)}
    }});
}


containerStartSchemas = new SimpleSchema({
  a: {
    type: Boolean,
    optional:true,
    label: "Attach"
  },
  i: {
    type: Boolean,
    optional:true,
    label: "interactive"
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
    containerStartForm: {
      after: {
        'container.start': formNotifier('start',null)}
    }});
}


containerRenameSchemas = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 96,
    trim: true,
    regEx: /\/?[a-zA-Z0-9_-]+/
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
    containerRenameForm: {
      after: {
        'container.rename': formNotifier('rename',null)}
    }});
}



containerKillSchemas = new SimpleSchema({
  signal: {
    type: String,
    optional:true,
    label: "Signal",
    allowedValues: ['SIGHUP',        'SIGINT',        'SIGQUIT',       'SIGILL',        'SIGTRAP',
      'SIGABRT',       'SIGBUS',        'SIGFPE',        'SIGKILL',      'SIGUSR1',
      'SIGSEGV',      'SIGUSR2',      'SIGPIPE',      'SIGALRM',      'SIGTERM',
      'SIGSTKFLT',    'SIGCHLD',      'SIGCONT',      'SIGSTOP',      'SIGTSTP',
      'SIGTTIN',      'SIGTTOU',      'SIGURG',       'SIGXCPU',      'SIGXFSZ',
      'SIGVTALRM',    'SIGPROF',      'SIGWINCH',     'SIGIO',        'SIGPWR',
      'SIGSYS',       'SIGRTMIN',     'SIGRTMIN+1',   'SIGRTMIN+2',   'SIGRTMIN+3',
      'SIGRTMIN+4',   'SIGRTMIN+5',   'SIGRTMIN+6',   'SIGRTMIN+7',   'SIGRTMIN+8',
      'SIGRTMIN+9',   'SIGRTMIN+10',  'SIGRTMIN+11',  'SIGRTMIN+12',  'SIGRTMIN+13',
      'SIGRTMIN+14',  'SIGRTMIN+15',  'SIGRTMAX-14',  'SIGRTMAX-13',  'SIGRTMAX-12',
      'SIGRTMAX-11',  'SIGRTMAX-10',  'SIGRTMAX-9',   'SIGRTMAX-8',   'SIGRTMAX-7',
      'SIGRTMAX-6',   'SIGRTMAX-5',   'SIGRTMAX-4',   'SIGRTMAX-3',   'SIGRTMAX-2',
      'SIGRTMAX-1',   'SIGRTMAX'],
    autoform: {
      options: 'allowed'
    }
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
    containerKillForm: {
      after: {
        'container.kill': formNotifier('kill',null)}
    }});
}


imageRemoveSchemas = new SimpleSchema({
  force: {
    type: Boolean,
    optional:true,
    label: "Force"
  },
  noprune: {
    type: Boolean,
    optional:true,
    label: "No Prune"
  },
  tag: {
    type: String,
    optional:true,
    trim:true,
    label: "Tag"
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
    imageRemoveForm: {
      after: {
        'image.rm': formNotifier('remove','images')}
    }});
}





commitSchemas = new SimpleSchema({
  repo: {
    type: String,
    label: "Repository",
    max: 96,
    trim: true
  },
  tag: {
    type: String,
    label: "Tag",
    max: 96,
    trim: true
  },
  comment: {
    type: String,
    label: "Comment",
    max: 256,
    optional:true,
    trim: true
  },
  author: {
    type: String,
    label: "Author",
    max: 96,
    optional:true,
    trim: true
  },
  Config: {
    type: Object,
    label: "Config",
    optional:true
  },
  'Config.Cmd': {
    type: [String],
    label: "Command",
    max: 256,
    optional:true,
    trim: true
  },
  'Config.Entrypoint': {
    type: [String],
    label: "Entrypoint",
    max: 256,
    optional:true,
    trim: true
  },
  'Config.User': {
    type: String,
    label: "User",
    max: 256,
    optional:true,
    trim: true
  },
  'Config.WorkingDir': {
    type: String,
    label: "Working Dir",
    max: 256,
    optional:true,
    trim: true
  },
  'Config.Tty': {
    type: Boolean,
    label: "TTY",
    optional:true
  },

  container: {
    type: String,
    optional:true,
    autoform: {
      type: 'hidden',
      label:false
    }
  }
   ,host: {
     type: String,
     optional:true,
     autoform: {
       type: 'hidden',
       label:false
     }
   }
});



if (Meteor.isClient){
  AutoForm.hooks({
    containerCommit: {
      after: {
        'container.commit': formNotifier('commit', 'containers')},
      before: {
        'container.commit': function(doc, template) {
		              doc.container = template.data.doc.Id;
		              doc.host = template.data.doc.host;
		              return doc;
                            }}}});
}


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
    optional:true
  },
  AttachStdin: {
    type: Boolean,
    label: "Attach Stdin",
    optional:true
  },
  AttachStdout: {
    type: Boolean,
    label: "Attach Stdout",
    optional:true
  },
  Tty: {
    type: Boolean,
    label: "tty",
    optional:true
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
    containerExecCreateForm: {
      after: {
        'container.exec.create': formNotifier('execCreate',null)}
    }
  });
}
