/**
 * Skype API
 *
 * Copyright (c) 2013 Vyacheslav Slinko
 * Licensed under the MIT License
 */


var EventEmitter = require('events').EventEmitter;
var zerorpc = require('zerorpc');
var spawn = require('child_process').spawn;
var path = require('path');
var util = require('util');


function SkypeClient(pythonPath) {
    EventEmitter.apply(this, arguments);
    this.run();
}


util.inherits(SkypeClient, EventEmitter);


SkypeClient.prototype.getChats = function(callback) {
    this.client.invoke('chats', callback);
};


SkypeClient.prototype.getChat = function(chatName, callback) {
    this.client.invoke('chat', chatName, callback);
};


SkypeClient.prototype.getUser = function(userName, callback) {
    this.client.invoke('user', userName, callback);
};


SkypeClient.prototype.sendMessage = function(chatName, message, callback) {
    this.client.invoke('send_message', chatName, message, callback);
};


SkypeClient.prototype.run = function() {
    this.closed = false;
    this.runBackend();
    this.connectToBacked();
    this.subscribeMessages();
    process.on('exit', this.close.bind(this));
};


SkypeClient.prototype.runBackend = function() {
    var command = 'python',
        args = [path.join(__dirname, '..', 'bin', 'skype-zerorpc')],
        options = {};

    if (process.platform === 'darwin') {
        command = 'arch';
        args = ['-i386', 'python'].concat(args);
        options.env = {VERSIONER_PYTHON_PREFER_32_BIT: 'yes'};
    }

    this.backend = spawn(command, args, options);
    this.backend.on('error', this.emit.bind(this, 'error'));
};


SkypeClient.prototype.connectToBacked = function() {
    this.client = new zerorpc.Client();
    this.client.connect('tcp://127.0.0.1:4243');
    this.client.on('error', this.emit.bind(this, 'error'));
};


SkypeClient.prototype.subscribeMessages = function() {
    this.client.invoke('streaming_messages', function(err, message) {
        if (err) {
            this.subscribeMessages();
            return;
        }
        this.emit('message', message);
    }.bind(this));
};


SkypeClient.prototype.close = function() {
    if (!this.closed) {
        this.closed = true;
        this.backend.kill();
        this.client.close();   
    }
};


function createClient() {
    return new SkypeClient();
}


module.exports = createClient;
module.exports.SkypeClient = SkypeClient;
