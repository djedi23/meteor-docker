Package.describe({
  name: 'dtc-json2table',
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
  api.use(['ecmascript', 'templating'],
	 ['client']);
  api.addFiles(['jsonTable.html', 'jsonTable.js',
		'image.html', 'image.js'],
	       ['client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('dtc-json2table');
  api.addFiles('dtc-json2table-tests.js');
});
