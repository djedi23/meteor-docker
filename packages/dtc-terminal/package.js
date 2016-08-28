Package.describe({
  name: 'dtc-terminal',
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
  api.versionsFrom('1.4.1');
  api.use('ecmascript');
  api.use([
    'templating'], 'client');

  api.addFiles([
    '.npm/package/node_modules/xterm/src/xterm.css',
    'client/terminal.css'], 'client');
  api.mainModule('client/terminal.js', 'client');
});

Npm.depends({
  xterm: '1.0.0'
});


// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('dtc-terminal');
//   api.mainModule('dtc-terminal-tests.js');
// });
