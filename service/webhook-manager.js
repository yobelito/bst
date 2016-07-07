var webhook_request_1 = require("./webhook-request");
var net = require("net");
var WebhookManager = (function () {
    function WebhookManager(port) {
        this.port = port;
        this.onWebhookReceived = null;
        this.host = "0.0.0.0";
    }
    WebhookManager.prototype.start = function () {
        var self = this;
        this.server = net.createServer(function (socket) {
            var message = "";
            socket.on('data', function (data) {
                console.log('Webhook From ' + socket.remoteAddress);
                console.log('Webhook Payload ' + data.toString());
                var webhookRequest = new webhook_request_1.WebhookRequest();
                webhookRequest.append(data);
                if (webhookRequest.done()) {
                    if (webhookRequest.isPing()) {
                        socket.write("HTTP/1.0 200 OK\r\nContent-Length: 10\r\n\r\nbst-server");
                        socket.end();
                    }
                    else {
                        self.onWebhookReceived(socket, webhookRequest);
                    }
                }
            });
            // We have a connection - a socket object is assigned to the connection automatically
            console.log('WEBHOOK CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
        }).listen(this.port, this.host);
        console.log('WebhookServer listening on ' + this.host + ':' + this.port);
    };
    return WebhookManager;
})();
exports.WebhookManager = WebhookManager;
//# sourceMappingURL=webhook-manager.js.map