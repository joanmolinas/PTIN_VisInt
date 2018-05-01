let io;

function connect(http) {
    io = require('socket.io')(http);

    io.on('connection', function(socket) {
        console.log('Webpage connected')
    })

}

function deviceWasUpdated() {
    
    io.emit('refreshDevicesTable', { for: 'everyone' });
}

module.exports = {
    connect,
    deviceWasUpdated
}
