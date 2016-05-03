module.exports = {
    attachConsole:function(server) {
        var io = require('socket.io')(server);
        io.on('connection', function (socket) {
            socket.on('console', function (type,data) {
                switch(type) {
                    case 'warn' :
                        server.emit('log', '[console.warn]'.yellow, data);
                        break;
                    case 'assert' :
                        server.emit('log', '[console.assert]'.yellow, data);
                        break;
                    case 'error' :
                        server.emit('log', '[console.error]'.red, data);
                        break;
                    case 'log' : // intentional fallthrough
                    default : 
                        server.emit('log', '[console.log]'.green, data);
                        break;
                }
            });
        });
    }
}