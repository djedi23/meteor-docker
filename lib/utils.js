washImageId = function(imagesId){
  if (_.isString(imagesId))
    return imagesId.replace(/^sha256:(.*)$/,'$1');
  return imagesId;
};

queryImageId = function(imagesId){
  return {$in: [imagesId, 'sha256:'+imagesId]};
};


containerFilters = function(hostFilter, containerFilter, containerImgFilter){
  var filter = {};
  if (hostFilter)
    filter = _.extend(filter,{_host:hostFilter});
  if (containerFilter)
    filter = _.extend(filter,{Names:{$regex: containerFilter}});
  if (containerImgFilter)
    filter = _.extend(filter,{Image:{$regex: containerImgFilter}});
  return filter;
};

imageFilters = function(hostFilter, imageFilter){
  var filter = {};
  if (hostFilter)
    filter = _.extend(filter,{_host:hostFilter});
  if (imageFilter)
    filter = _.extend(filter,{RepoTags:{$regex: imageFilter}});
  return filter;
};
