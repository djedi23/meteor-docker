modules.push('template.navbar.left.actions', 20, 'tasks_header');
modules.push('template.navbar.left.menus', 20, {menu:'Swarm', action:'tasks_header2'});

Template.tasks_header.helpers({
  isActive: function(){
    return 'tasks_list' === Router.current().route.getName()?'active':false;
  }
});
Template.tasks_header2.helpers({
  isActive: function(){
    return 'tasks_list' === Router.current().route.getName()?'active':false;
  }
});
