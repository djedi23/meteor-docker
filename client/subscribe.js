Meteor.startup(function(){ 
  Tracker.autorun(function(){
    if (Meteor.user){
      Meteor.subscribe('hostsStatus');
      subs.subscribe('containers', Session.get('containersLimit'),Session.get('hostFilter'), Session.get('containerFilter'), Session.get('containerImgFilter'));
    }
  });
});
