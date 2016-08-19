swarmsJoinSchemas = new SimpleSchema({
  ListenAddr: {
    type: String,
    label: "Listen Address",
    //    optional:true,
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
  RemoteAddrs: {
    type: [String],
    label: "Remote Addresses",
    max: 96,
    trim: true
  },
  'RemoteAddrs.$': {
    autoform: {
      type: "select2",
      options: function () {
        return Hosts.find({'info.Swarm.Managers':1}).map(function(h){
                 return { label: h.info.Swarm.Cluster.ID, value: h.info.Swarm.RemoteManagers[0].Addr };
               });
      },
      select2Options: {tags: true}
    }
  },
  JoinToken: {
    type: String,
    label: "Join Token",
    max: 96,
    trim: true,
    autoform: {
      type: "select2",
      options: function () {
        return _.flatten(SwarmsInspect.find().map(function(s){
                           return _.map(_.keys(s.JoinTokens), function(t){
                                    return { label: s.ID +" "+t, value: s.JoinTokens[t] };
                                  });
                         }));
      },
      select2Options: {tags: true}
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
modules.schemas.swarmsJoinSchemas = swarmsJoinSchemas;

if (Meteor.isClient) {
  AutoForm.hooks({
    swarmsJoin: {
      after: {
        'method': formNotifier('swarm joined', 'swarms_list')
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
