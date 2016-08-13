Template.volumeCreate.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host = Hosts.findOne(Session.get('hostFilter'));
    if (host && Session.get('hostFilter'))
      return host.Id;
    return null;
  },
  config: function() {
    var config = {};
    var host = Session.get('hostFilter') && Hosts.findOne(Session.get('hostFilter'));
    if (host)
      config.host = host._id;
    config.Driver='local';
    return config;
  }
});