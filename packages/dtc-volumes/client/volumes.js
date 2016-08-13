modules.push('template.navbar.left.actions', 20, 'volume_header');
modules.push('template.navbar.left.menus', 20, {menu:'Extras', action:'volume_header2'});

Template.volume_header.helpers({
  isActive: function(){
    return 'volumes_list' === Router.current().route.getName()?'active':false;
  }
});
Template.volume_header2.helpers({
  isActive: function(){
    return 'volumes_list' === Router.current().route.getName()?'active':false;
  }
});
