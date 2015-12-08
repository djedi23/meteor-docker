Template.volumeCreate.helpers({
  hostId: function() {
    var host = Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  config: function() {
    var config = {};
    var host = Hosts.findOne();
    if (host)
      config.host = host._id; // FIXME : this._host;
    config.Driver='local';
    return config;
  }
});