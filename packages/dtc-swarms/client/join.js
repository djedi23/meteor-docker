Template.swarmsJoin.helpers({
  config: function() {
    var config = {};
    config.host = this.host;
    config.ListenAddr =  "0.0.0.0:2377";
    return config;
  }
});
