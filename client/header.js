Template.header.helpers({
  isImages: function(){
    if (Router.current() && Router.current().route)
      return 'images' === Router.current().route.getName()?'active':false;
    return false;
  },
  isContainers: function(){
    if (Router.current() && Router.current().route)
      return 'containers' === Router.current().route.getName()?'active':false;
    return false;
  },
  isHost: function(){
    if (Router.current() && Router.current().route)
      return 'host' === Router.current().route.getName()?'active':false;
    return false;
  },
  errors: function(){
    return _.some(Hosts.find().map(function(e){return !e.status;}));
  },
  menus: function(){
    var menus = {};
    _.each(modules.list('template.navbar.left.menus'),function(m){
      if (!menus[m.menu])
        menus[m.menu]=[];
      menus[m.menu].push(m.action);
    });
    return _.pairs(menus);
  },
  itemTitle:function(){
    return this[0];
  },
  menuItems:function(){
    return this[1];
  },
  isActive: function(){
    return _.some(_.map(this[1],function(i){
                    return Template[i].__helpers[' isActive']();
                  }))?'active':null;
  }
});