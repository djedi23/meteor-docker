

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
    infos: function(){
	if (this.info){
	    var hostId = this._id;
	    var infos = this.info;
	    delete infos.Images;
	    delete infos.Containers;
	    delete infos.Debug;
	    return _.map(_.pairs(infos),
			 function(c){
			     return filter_content(hostId, {n:c[0],p:c[1]});
			 });
	}
	return null;
    }
});
