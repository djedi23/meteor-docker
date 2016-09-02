eventHandle = function(host, event){
  /*
   Docker containers report the following events:
   copy, exec_create, exec_start, export, oom
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
    if (modules.hostIdRegExp.test(event.id))
      imageDetail(host, event.id);
    break;
  case 'top':
  case 'attach':
  case 'detach':
  case 'resize':
    break;
  default:
    console.log("unhandled EVENT (API < 22)",event);
  }
  modules.calls('events.'+event.status+'.'+event.id, this, host, event);
};



eventHandle1_22 = function(host, event){
  /*
   Docker containers report the following events:
   copy, exec_create, exec_start, export, oom
   */
  switch(event.Type){
  case 'image':
  case 'container':
    switch(event.Action){
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
      if (modules.hostIdRegExp.test(event.id))
	imageDetail(host, event.id);
      break;
    case 'top':
    case 'attach':
    case 'detach':
    case 'resize':
    case 'exec_detach':
      break;
    default:
      if (event.Action.startsWith('exec_create') ||
	  event.Action.startsWith('exec_start')){
      } else
	console.log("unhandled image or container EVENT (API >= 22)",event);
    }
    break;
  case 'network':
    switch(event.Action) {
    case 'connect':
    case 'disconnect':
      listNetworks();
      break;
    default:
      console.log("unhandled network EVENT (API >= 22)",event);
    }
    break;
  case 'volume':
    switch(event.Action) {
    case 'mount':
    case 'unmount':
      listVolumes();
      break;
    default:
      console.log("unhandled volume EVENT (API >= 22)",event);
    }
    break;
  default:
    console.log("unhandled EVENT (API >= 22)",event.Type,event);
  }
  modules.calls('events.'+event.status+'.'+event.id, this, host, event);
};

