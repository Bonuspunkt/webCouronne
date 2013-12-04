var WebSocket = require('ws');
var crypto = require('crypto');

function WebSocketHelper(req, socket, head) {

  return {
    request: req,

    accept: function() {

      // handshake
      var key = req.headers['sec-websocket-key'];
      var shasum = crypto.createHash('sha1');
      shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
      key = shasum.digest('base64');

      var headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + key,
        '',
        ''
      ];
      socket.setTimeout(0);
      socket.setNoDelay(true);
      try {
        socket.write(headers.join('\r\n'));
      }
      catch (e) {
        // if the upgrade write fails, shut the connection down hard
        try { socket.destroy(); } catch (e) {}
        return;
      }

      var webSocket = new WebSocket([req, socket, head, {}]);
      return webSocket;
    },

    close: function() {
      var response = [
        'HTTP/1.1 400 Bad Request',
        'Content-type: text/html',
        '',
        ''
      ];
      socket.write(response.join('\r\n'));
      socket.destroy();
    }
  };
}

module.exports = WebSocketHelper;