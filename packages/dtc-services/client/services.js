modules.push('template.navbar.left.actions', 20, 'services_header');
modules.push('template.navbar.left.menus', 20, {menu:'Swarm', action:'services_header2'});

Template.services_header.helpers({
  isActive: function(){
    return 'services_list' === Router.current().route.getName()?'active':false;
  }
});
Template.services_header2.helpers({
  isActive: function(){
    return 'services_list' === Router.current().route.getName()?'active':false;
  }
});
