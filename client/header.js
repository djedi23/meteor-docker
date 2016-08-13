Template.header.helpers({
  isImages: function(){
    return 'images' === Router.current().route.getName()?'active':false;
  },
  isContainers: function(){
    return 'containers' === Router.current().route.getName()?'active':false;
  },
  isHost: function(){
    return 'host' === Router.current().route.getName()?'active':false;
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