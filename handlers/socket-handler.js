let io;

let sockets = {}

function connect(http) {
    io = require('socket.io')(http);

    io.on('connection', (socket) => {
        console.log('Webpage connected')
        console.log(socket)
        // listenAlarm(socket)
    })
}

function listenAlarm(socket) {
    socket.on('alarm', (type) => {
        console.log(type)
    })
}

function emitShutdown(clientID) {
    // io.emit("shutdown", )
}

function deviceWasUpdated() {
    io.emit('refreshDevicesTable', { for: 'everyone' });
}

module.exports = {
    connect,
    deviceWasUpdated,
    emitShutdown
}
