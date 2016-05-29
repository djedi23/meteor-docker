washImageId = function(imagesId){
  if (_.isString(imagesId))
    return imagesId.replace(/^sha256:(.*)$/,'$1');
  return imagesId;
}

queryImageId = function(imagesId){
  return {$in: [imagesId, 'sha256:'+imagesId]};
}