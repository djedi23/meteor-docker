eventHandle = function(host, event){
  // event attach, commit, copy, exec_create, exec_start, export, oom, rename, resize, top
/*
Docker containers report the following events:
attach, copy, exec_create, exec_start, export, oom, resize, top
*/
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
  case 'rename':
    containerDetails(host, event.id);
    listContainers();
    startMonitoringContainer(host, event.id);
    break;
  case 'commit':
  case 'import':
  case 'pull':
  case 'push':
  case 'untag':
  case 'tag':
    listImages();
    imageDetail(host, event.id);
    break;
  default:
    console.log("unhandled EVENT",event);
  }
  modules.calls('events.'+event.status+'.'+event.id, this, host, event);
};