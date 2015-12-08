
Template.jsonImageValue.helpers({
  host: function() {
    if (!this ||  !this.config.json)
      return null;

    var image = Images.findOne({
      Id: this.config.json
    });
    return image?image._host:null;
  }
});