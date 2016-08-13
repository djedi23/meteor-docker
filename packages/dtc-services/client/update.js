Template.servicesUpdate.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host =  Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  config: function() {
    var config = this.Spec;
    if (config){
      config.host = this._host;
      config.ID = this.ID;
      config.version = this.Version.Index;
    }
    return config;
  }
});