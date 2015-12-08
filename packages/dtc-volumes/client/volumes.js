modules.push('template.navbar.left.actions', 20, 'volume_header');

Template.volume_header.helpers({
  isVolume: function(){
    return 'volumes_list' === Router.current().route.getName()?'active':false;
  }
});
