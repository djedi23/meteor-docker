modules.push('template.navbar.left.actions', 20, 'network_header');

Template.network_header.helpers({
  isNetwork: function(){
    return 'networks_list' === Router.current().route.getName()?'active':false;
  }
});
