"use strict";
var net = require('net');
var node_1 = require("./node");
var socket_handler_1 = require("./socket-handler");
var NodeManager = (function () {
    function NodeManager(port) {
        this.port = port;
        this.host = '0.0.0.0';
        //public onReceive:OnReceiveCallback;
        this.nodes = {};
    }
    NodeManager.prototype.node = function (nodeID) {
        return this.nodes[nodeID];
    };
    NodeManager.prototype.start = function () {
        var self = this;
        this.server = net.createServer(function (socket) {
            var initialConnection = true;
            var node = null;
            var socketHandler = new socket_handler_1.SocketHandler(socket, function (message) {
                //We do special handling when we first connect
                if (initialConnection) {
                    var connectData = JSON.parse(message);
                    node = new node_1.Node(connectData.id, socketHandler);
                    self.nodes[node.id] = node;
                    socketHandler.send("ACK");
                    initialConnection = false;
                }
                if (self.onConnect != null) {
                    self.onConnect(node);
                }
            });
            // We have a connection - a socket object is assigned to the connection automatically
            console.log('NODE CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
        }).listen(this.port, this.host);
        console.log('NodeServer listening on ' + this.host + ':' + this.port);
    };
    NodeManager.prototype.stop = function () {
        this.server.close(function () {
            console.log("NodeManager STOP");
        });
    };
    return NodeManager;
}());
exports.NodeManager = NodeManager;
