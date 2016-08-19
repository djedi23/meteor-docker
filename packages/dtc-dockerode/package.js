/* Meteor package information for package Dockerode*/
Package.describe({
  name: "dtc-dockerode",
  summary: "Docker remote API. Wraps the dockerode package for Meteor.",
  description: "this package is a fork from ongoworks:dockerode. Original https://github.com/ongoworks/meteor-dockerode",
  version: "2.3.0",
  git: ""
});

Npm.depends({
    "dockerode":"git+https://github.com/djedi23/dockerode.git" 
});

Package.on_use(function (api) {
  api.export('Docker');
  api.add_files('dockerode.js', 'server');
});
