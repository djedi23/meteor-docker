
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
        'method': formNotifier('tag', 'images')},
      before: {
        'method': function(doc) {
                    doc.id = this.template.data.doc.Id;
                    doc.host = this.template.data.doc._host;
                    return doc;
                  }}}});
}

