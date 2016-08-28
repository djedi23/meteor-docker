import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import Terminal from 'xterm';
import 'xterm/addons/attach/attach.js';
import 'xterm/addons/fit/fit.js';

import './terminal.html';


Template.terminal.onCreated(function () {
  this.cols= new ReactiveVar();
  this.lines= new ReactiveVar();
});

Template.terminal.onRendered(function () {
  var terminalNode = this.$('.terminal-container')[0];
  this.autorun(function(){
    var data = Template.currentData();
    var wsKey = Session.get('attachKey');
    if (data.id && wsKey) {
      Session.set('attachKey',undefined);
      term = new Terminal({
	cursorBlink: true
      });
      Template.instance().term = term;
      var protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
      var socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/attach/'+wsKey+'/websocket';
      socket = new WebSocket(socketURL);
      term.open(terminalNode);
      term.fit();
      Meteor.call('container.resize',data.host,data.id,term.cols,term.rows);
      Template.instance().cols.set(term.cols);
      Template.instance().lines.set(term.rows);
      socket.onopen = runRealTerminal;
    }
  });
});

Template.terminal.onDestroyed(function(){
  socket.close();
});

function runRealTerminal() {
  term.attach(socket);
  term._initialized = true;
}


Template.terminal.helpers({
  cols: function(){
    return Template.instance().cols.get();
  },
  lines: function(){
    return Template.instance().lines.get();
  }
});

Template.terminal.events({
  'submit':function(e,tpl){
    e.preventDefault();
    var cols = Number.parseInt(tpl.$('#columns').val());
    var lines = Number.parseInt(tpl.$('#lines').val());

    tpl.term.resize(cols,lines);
    Meteor.call('container.resize',this.host,this.id,cols,lines);
    tpl.cols.set(cols);
    tpl.lines.set(lines);
  },
  'click #fit':function(e,tpl){
    e.preventDefault();
    var term = tpl.term;

    term.fit();
    Meteor.call('container.resize',this.host,this.id,term.cols,term.rows);
    tpl.cols.set(term.cols);
    tpl.lines.set(term.rows);
  }
});
