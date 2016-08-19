modules.push('template.navbar.left.actions', 20, 'swarms_header');
modules.push('template.navbar.left.menus', 20, {menu:'Swarm', action:'swarms_header2'});

Template.swarms_header.helpers({
  isActive: function(){
    return 'swarms_list' === Router.current().route.getName()?'active':false;
  }
});
Template.swarms_header2.helpers({
  isActive: function(){
    return 'swarms_list' === Router.current().route.getName()?'active':false;
  }
});
