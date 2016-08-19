Template.swarmsUpdate.helpers({
  config: function() {
    var config = {};
    if (this && this._host){
      config.Name = this.Spec.Name;
      config.JoinTokens = this.JoinTokens;
      config.Raft = this.Spec.Raft;
      config.Dispatcher = this.Spec.Dispatcher;
      config.CAConfig = this.Spec.CAConfig;
      config.host = this._host;
      if (this.Version)
        config.version = this.Version.Index;      
    }
    console.log( config);
    return config;
  }
});