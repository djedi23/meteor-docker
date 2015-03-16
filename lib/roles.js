
if (modules.rolesList === undefined)
    modules.rolesList = [];
modules.rolesList.push(
    {role: 'container.view', category:'container', label:'View a container'},
    {role: 'container.list', category:'container', label:'List the containers'},
    {role: 'container.rm', category:'container', label:'Remove a container'},
    {role: 'container.run', category:'container', label:'Run a container'},
    {role: 'container.pause', category:'container', label:'Pause a container'},
    {role: 'container.unpause', category:'container', label:'Unpause a container'},
    {role: 'container.start', category:'container', label:'Start a container'},
    {role: 'container.stop', category:'container', label:'Stop a container'},
    {role: 'container.kill', category:'container', label:'Kill a container'},
    {role: 'container.restart', category:'container', label:'Restart a container'},
    {role: 'container.commit', category:'container', label:'Commit a container'},
//    {role: 'container.copy', category:'container', label:'Copy files from a container'},
    {role: 'container.rename', category:'container', label:'Rename a container'},
    {role: 'exec.create', category:'container', label:'Exec a command in a container'},
    {role: 'host.view', category:'host', label:'View hosts'},
    {role: 'host.new', category:'host', label:'Add a new host'},
    {role: 'host.remove', category:'host', label:'Remove an host'},
    {role: 'host.rename', category:'host', label:'Rename an host'},
    {role: 'host.enable', category:'host', label:'Disable/Enable an host'},
    {role: 'image.view', category:'image', label:'View an image'},
    {role: 'image.list', category:'image', label:'List images'},
    {role: 'image.pull', category:'image', label:'Pull an image from a registry'},
    {role: 'image.push', category:'image', label:'Push an image to a registry'},
    {role: 'image.rm', category:'image', label:'Remove an image'},
    {role: 'image.run', category:'image', label:'Run an image'},
    {role: 'image.tag', category:'image', label:'Tag an image'},
    {role: 'roles.edit', category:'role', label:'Edit roles'}
//    {role: 'admin',category:'admin', label:'Admin (All Permissions)'}
);
