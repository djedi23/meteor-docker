Package.describe({
  name: 'dtc-volumes',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'alanning:roles',
    'templating',
    'reactive-var',
    'iron:router',
    'gfk:notifications',
    'underscore'
  ], 'client');


  api.use([
    'djedi:modules',
    'aldeed:autoform',
    'aldeed:simple-schema',
    'check',
    'underscore',
    'minimongo', 'mongo'
  ], ['client', 'server']);


api.addFiles(['client/volumes.html','client/volumes.js',
  'client/listing.html','client/listing.js',
  'client/create.html', 'client/create.js',
  'client/inspect.html', 'client/inspect.js',
  'lib/route.js'],
  ['client']);


});

