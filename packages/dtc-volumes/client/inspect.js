Template.volumeInspect.helpers({
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