
Template.home.helpers({
    host: function() {
        return Hosts.find().count() > 0;
    },
    image: function() {
        return Images.find().count() > 0;
    }
});

Template.hostFilter.helpers({
    multihost: function() {
        return Hosts.find().count() > 1;
    },
    hosts: function() {
        return Hosts.find();
    },
    isSelected: function() {
	return Session.equals('hostFilter',this._id)?'selected':null;
    }
});


Template.hostFilter.events({
    'change #hostSelect': function(e,tpl){
        var host =  Hosts.findOne({Id:$(e.target).val()});
        
        if (host)
	    Session.set('hostFilter',host._id);
        else
	    Session.set('hostFilter',undefined);
    }
});
