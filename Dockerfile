FROM node:4.4.7

MAINTAINER moise.valvassori@gmail.com 
 
WORKDIR /opt/bundle/
# ENV MONGO_URL mongodb://$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/meteor
# ENV MONGO_OPLOG_URL mongodb://$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/local

## You need to link dtc to a container named 'mongo' or change this variable
ENV MONGO_URL mongodb://mongo:27017/meteor
## If you don't need oplog unset this variable
ENV MONGO_OPLOG_URL mongodb://mongo:27017/local
ENV PORT 3000


## This is your app built with `meteor build`
ADD app.tar.gz /opt/
#RUN (cd /opt/bundle/programs/server && rm -rf npm/npm-bcrypt && npm install bcrypt && npm install && rm -rf /tmp/*)
RUN (cd /opt/bundle/programs/server && npm install && rm -rf /tmp/*)

LABEL dtc=dtc

ENV ROOT_URL http://dtc.valvassori.info/

EXPOSE 3000
CMD node main.js --raw-logs

