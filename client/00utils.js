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

  if (_.isArray(content.p)){	// Si on a un tableau alors on cherche s'il est de la forme [KEY=VAL, ...]
    var p = _.map( content.p,
      function(i){
        if (_.isString(i)){
          var var_ = i.split("=");
          if (var_.length > 1)
            content.a = true;
          return {v:var_[0], vv:var_[1]};
        }
        else if (_.isArray(i) && i.length ===2){
          content.a = true;
          return {v:i[0], vv:i[1]};
        }
        else
          return i;
      });
    if (content.a)
      content.p = p;
    else
      content.p = EJSON.stringify(content.p);
  }
  else if (_.isObject(content.p)){	// Si on a un object alors on le remet en forme
    var p = _.map( _.keys(content.p),
      function(k){
        content.a = true;
        return {v:filterChars(k), vv: EJSON.stringify(content.p[k]) };
      });
    if (content.a)
      content.p = p;
    else
      content.p = EJSON.stringify(content.p);
  }
  else if (! (_.isString(content.p) || _.isNumber(content.p)))
    content.p = EJSON.stringify(content.p);
  if (_.isEmpty(content.p) && ! _.isNumber(content.p))
    content.p = '--';

  return content;
};

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
