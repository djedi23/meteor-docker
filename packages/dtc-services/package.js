Package.describe({
  name: 'dtc-services',
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
    'underscore',
    'dtc-json2table'
  ], 'client');


  api.use([
    'djedi:modules',
    'aldeed:autoform',
    'aldeed:simple-schema',
    'check',
    'underscore',
    'minimongo', 'mongo'
  ], ['client', 'server']);


api.addFiles(['client/services.html','client/services.js',
  'client/listing.html','client/listing.js',
  'client/inspect.html', 'client/inspect.js',
  'client/create.html', 'client/create.js',
  'client/update.html', 'client/update.js',
  'lib/route.js'],
  ['client']);


});

