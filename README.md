# Docker Total Controller

Docker Total Controller is an UI for Docker.com build with Meteor.com

Docker Total Controller can drive your docker installations:
* image management: pull, run, inspect, remove, update, ...;
* container management: start, stop, pause, remove, ...;
* host management: multiple hosts with SSL.
* swarm management: init, join, leave, update, ...
* node management: inspect, remove, ...
* service management: create, inspect, remove, update, tasks listing, ...

Docker Total Controller reacts to docker status. The above video show how it reacts to `fig` launching many containers.

[![Docker Total Controller](http://img.youtube.com/vi/KCJvhXHmcZg/0.jpg)](http://www.youtube.com/watch?v=KCJvhXHmcZg)

## Install and run

### Run From Docker

1. Install Docker. DTC is compatible with docker 1.12
1. Pull and run a mongo container
```shell
	docker run --name dtcmongodb -d mongo:3.2
```
1. Pull and run Docker Total Controller:
```shell
	docker run --name dtc --link dtcmongodb:mongo --volume /var/run/docker.sock:/var/run/docker.sock -p 3000:3000 -d djedi/dtc:latest
```
1. Connect to localhost:3000
1. Create an user.
1. Have Fun !


### Run from sources

1. Install meteor: https://www.meteor.com/install
1. Clone this repository
1. Go to the working directory and run meteor
```shell
	meteor npm install bcrypt
	meteor
```
1. Connect to localhost:3000
1. Create an user.
1. Have Fun !

