

Template.host.helpers({
    haveData: function () {
	return this && this.count &&
	    this.count() > 0 &&
	    this.fetch()[0].info;
    },
    errors: function(){
        if (this.lastError)
            return _.map(_.pairs(this.lastError),
                         function(e){
                             return {e: e[0], v:e[1]};
                         });
        return null;
    },
  hostConfiguration:function(){
    return {
      json: this.info,
      ignore:['Images', 'Containers', 'Debug']
//       templates:{
//         'Image': 'jsonImageValue'
//       }
    };
  }
});
