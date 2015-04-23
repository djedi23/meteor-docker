
filter_content = function(host, content){
  if (content.n === 'Image'){
    if (/^[0-9a-z]{64}$/.test(content.p))
      content.link = '/images/'+host+'/'+content.p+'/inspect';
    else {
        var image = Images.findOne({_host:host, RepoTags:this.Image});
        if (image)
          content.link = '/images/'+host+'/'+image.Id+'/inspect';
    }
  }

  if (! (_.isString(content.p) || _.isNumber(content.p)))
    content.p = EJSON.stringify(content.p);
  if (_.isEmpty(content.p) && ! _.isNumber(content.p))
    content.p = '--';

  return content;    
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
