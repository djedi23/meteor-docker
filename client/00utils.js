
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

