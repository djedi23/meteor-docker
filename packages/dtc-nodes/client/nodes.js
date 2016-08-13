modules.push('template.navbar.left.actions', 20, 'nodes_header');
modules.push('template.navbar.left.menus', 20, {menu:'Swarm', action:'nodes_header2'});

Template.nodes_header.helpers({
  isActive: function(){
    return 'nodes_list' === Router.current().route.getName()?'active':false;
  }
});
Template.nodes_header2.helpers({
  isActive: function(){
    return 'nodes_list' === Router.current().route.getName()?'active':false;
  }
});
