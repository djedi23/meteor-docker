# Docker Total Controller

Docker Total Controller is an UI for Docker.com build with Meteor.com


[![Docker Total Controller](http://img.youtube.com/vi/KCJvhXHmcZg/0.jpg)](http://www.youtube.com/watch?v=KCJvhXHmcZg)

## Install and run

### Run From Docker

1. Install Docker
1. Pull and run a mongo container

	docker run --name dtcmongodb -d mongo:2.4.12

1. Pull and run Docker Total Controller:

	docker run --name dtc --link dtcmongodb:dtcmongodb --volume /var/run/docker.sock:/var/run/docker.sock -p 3000:3000 -d djedi/dtc

1. Connect to localhost:3000

1. Create an user.

1. Have Fun !


### Run from sources

1. Install meteor

1. Clone this repository

1. Run

	meteor

