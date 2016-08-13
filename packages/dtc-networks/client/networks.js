modules.push('template.navbar.left.actions', 20, 'network_header');
modules.push('template.navbar.left.menus', 20, {menu:'Extras', action:'network_header2'});

Template.network_header.helpers({
  isActive: function(){
    return 'networks_list' === Router.current().route.getName()?'active':false;
  }
});
Template.network_header2.helpers({
  isActive: function(){
    return 'networks_list' === Router.current().route.getName()?'active':false;
  }
});
