
Containers._ensureIndex({_host:1}, { background: true });
Containers._ensureIndex({Id:1,_host:1}, { background: true });

ContainersInspect._ensureIndex({Id:1,_host:1}, { background: true });
ContainersStats._ensureIndex({Id:1,_host:1}, { background: true });
ContainersStats._ensureIndex({Id:1,_host:1,read:-1}, { background: true });
Hosts._ensureIndex({disabled:1}, { background: true });

Images._ensureIndex({_host:1}, { background: true });
Images._ensureIndex({Id:1,_host:1}, { background: true });

ImagesInspect._ensureIndex({Id:1,_host:1}, { background: true });

