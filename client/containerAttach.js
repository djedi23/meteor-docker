Template.containerAttach.helpers({
  IdShort: function() {
    if (this.Id)
      return this.Id.substring(0, 12);
    return undefined;
  },
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host = Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  }
});
