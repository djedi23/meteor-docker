Template.volumeInspect.helpers({
  multihost: function() {
    return Hosts.find().count() > 1;
  },
  hostId: function() {
    var host =  Hosts.findOne(this._host);
    if (host)
      return host.Id;
    return null;
  },
  slots: function() {
    var self = this;
    return _.compact(_.map(_.pairs(self),
      function(slot) {
        var n = slot[0];
        var p = slot[1];
        if (n === '_id' || n === '_host')
          return;
        return {
          n: n,
          p: p
        };
      }));
  }
});