
ensureApi = function(hostId, api) {
    var host = Hosts.findOne({_id:hostId});
    if (host){
	return host.version.ApiVersion >= api;
    }
    return false;
};

Template.registerHelper('ensureApi', ensureApi);

dtcVersion = new ReactiveVar();
Template.registerHelper('dtcVersion', function() {
    return dtcVersion.get();
});
