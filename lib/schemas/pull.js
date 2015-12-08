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
    optional: true,
    label: "Tag",
    max: 512,
    trim: true
  },
  fromSrc: {
    type: String,
    optional: true,
    label: "From Src",
    max: 512,
    trim: true
  },
  repo: {
    type: String,
    optional: true,
    label: "Repo",
    max: 512,
    trim: true
  },
  registry: {
    type: String,
    optional: true,
    label: "Registry",
    max: 512,
    trim: true
  },
  host: {
    type: String,
    autoform: {
      options: function() {
        return Hosts.find().map(function(c, i) {
          return {
            label: c.Id,
            value: c._id
          };
        });
      }
    }
  }
});

if (Meteor.isClient) {
  AutoForm.hooks({
    imagePull: {
      after: {
        'method': formNotifier('pull', 'images')
      }
    }
  });
}
