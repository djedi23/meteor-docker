
Template.header.helpers({
    isImages: function(){
	return 'images' === Router.current().route.getName()?'active':false;
    },
    isContainers: function(){
	return 'containers' === Router.current().route.getName()?'active':false;
    },
    isHost: function(){
	return 'host' === Router.current().route.getName()?'active':false;
    },
    errors: function(){
        return _.some(Hosts.find().map(function(e){return !e.status;}));
    }
});
