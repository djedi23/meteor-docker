filterChars = function (string){
  return string.replace(/U\+FF0E/g,'.');
};


var dataMapping = function() {
  var config = this.config;
  var json = config.json;

  if (json === undefined)
    return null;

  return _.compact(_.map(_.pairs(json),
    function(c) {
      var parent = (config.parent?config.parent:'^')+'.' + c[0];
      if (_.contains(config.ignore, c[0]) || _.contains(config.ignore, parent))
        return undefined;
      var template = 'jsonValue';

      if (config.templates && config.templates[c[0]] !== undefined)
        template = config.templates[c[0]];
      else if (_.isArray(c[1]))
        template = 'jsonArray';
      else if (_.isObject(c[1]))
        template = 'json';

      val = {
        config: _.clone(config)
      };
      val.config.json = c[1];
      val.config.parent = parent;
      return {
        kv: filterChars(c[0]),
        val: val,
        template: template
      };
    }));
};

Template.json.helpers({
  slots: dataMapping
});
Template.jsonArray.helpers({
  slots: dataMapping,
  empty: function() {
    return _.isEmpty(this.config.json);
  }
});


Template.jsonValue.helpers({
  value: function() {
    var config = this.config;
    var json = config.json;
    if (json === null)
      return "null";
    else if (json === {})
      return '{}';
    else if (_.isEmpty(json) && !_.isNumber(json) && !_.isBoolean(json))
      return '--';
    var self = json.toString();
    //  console.log(self, this);
    return self;
  }
});
