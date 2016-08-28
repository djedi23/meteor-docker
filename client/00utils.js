filterChars = function (string){
  return string.replace(/U\+FF0E/g,'.');
};


eventsForFilters = function(sessionname) {
  return {
    'keypress': function(evt, tpl){
      if (evt.keyCode === 13){
	evt.preventDefault();
	evt.stopPropagation();
      }
    },
    'keyup': function(evt, tpl){
      var val = tpl.$('input').val().trim();
      if (!Session.equals(sessionname,val))
	Session.set(sessionname, val);
    },
    'click .filterClean': function(){
      Session.set(sessionname, undefined);
    }
  };
};


installScrollHandler = function(collection, session){
  return function(){
    var lastScroll = new Date().getTime();
    $(window).scroll(function(evt){
      if($(window).scrollTop() + $(window).height() >= $(document).height()-200) {
	var time = new Date().getTime();
	if ((time - lastScroll) > 500 && modules.collections[collection].find({},{limit: Session.get(session)}).count() === Session.get(session)){
	  lastScroll = time;
	  Session.set(session, scrollLimit + Session.get(session));
	}
      }
    });
  };
};

modules.scroll = modules.scroll?modules.scroll:{};
modules.scroll.installHandler = installScrollHandler;
