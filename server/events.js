
eventHandle = function(host, event){
  // event export
  switch(event.status){
    case 'destroy':
    Containers.remove({_host: host, Id:event.id});
    ContainersInspect.remove({_host: host,Id:event.id});
    break;
    case 'delete':
    if (event.id){
      Images.remove({_host: host, Id:event.id});
      ImagesInspect.remove({_host: host, Id:event.id});
    }
    break;
    case 'create':
    case 'die':
    case 'pause':
    case 'kill':
    case 'restart':
    case 'start':
    case 'stop':
    case 'unpause':
    containerDetails(host, event.id);
    listContainers();
    startMonitoringContainer(host, event.id);
    break;
    case 'untag':
    listImages();
    imageDetail(host, event.id);
    break;
  }
};
