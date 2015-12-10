/* Meteor package information for package Dockerode*/
Package.describe({
  name: "aboire:dockerode",
  summary: "Docker remote API. Wraps the dockerode package for Meteor.",
  version: "2.2.7",
  git: "https://github.com/ongoworks/meteor-dockerode"
});

Npm.depends({
  "dockerode": "2.2.7"
});

Package.on_use(function (api) {
  api.export('Docker');
  api.add_files('dockerode.js', 'server');
});
