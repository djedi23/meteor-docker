
Tracker.autorun(function(){
  if (Meteor.user){
    Meteor.subscribe('hostsStatus');
    subs.subscribe('containers');
  }
});
