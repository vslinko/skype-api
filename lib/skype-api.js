/**
 * Skype API
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */


var EventEmitter = require('events').EventEmitter;
var zerorpc = require('zerorpc');
var spawn = require('child_process').spawn;
var path = require('path');
var util = require('util');


function SkypeClient(pythonPath) {
    EventEmitter.apply(this, arguments);
    this.connected = false;
    this._exitListener = this.close.bind(this);
}


util.inherits(SkypeClient, EventEmitter);


SkypeClient.prototype.getChats = function(callback) {
    this.client.invoke('get_chats', callback);
};


SkypeClient.prototype.getChat = function(chatName, callback) {
    this.client.invoke('get_chat', chatName, callback);
};


SkypeClient.prototype.getUser = function(userName, callback) {
    this.client.invoke('get_user', userName, callback);
};


SkypeClient.prototype.sendMessage = function(chatName, message, callback) {
    this.client.invoke('send_message', chatName, message, callback);
};


SkypeClient.prototype.connect = function() {
    if (!this.connected) {
        this.connected = true;
        this._runBackend();
        this._connectToBacked();
        this._subscribeMessages();
        process.on('exit', this._exitListener);
        process.on('SIGINT', this._exitListener);
    }
};


SkypeClient.prototype.close = function() {
    if (this.connected) {
        this.connected = false;
        this.backend.kill();
        this.client.close();
        process.removeListener('exit', this._exitListener);
        process.removeListener('SIGINT', this._exitListener);
    }
};


SkypeClient.prototype._runBackend = function() {
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


SkypeClient.prototype._connectToBacked = function() {
    this.client = new zerorpc.Client();
    this.client.connect('tcp://127.0.0.1:4243');
    this.client.on('error', this.emit.bind(this, 'error'));
};


SkypeClient.prototype._subscribeMessages = function() {
    this.client.invoke('stream_messages', function(err, message) {
        if (err) {
            this._subscribeMessages();
            return;
        }
        this.emit('message', message);
    }.bind(this));
};


function createClient() {
    return new SkypeClient();
}


module.exports = createClient;
module.exports.SkypeClient = SkypeClient;
