let io;

let sockets = {}

function connect(http) {
    io = require('socket.io')(http);
       
    io.on('connection', (socket) => {
        console.log('Device connected')
        let dId = socket.handshake.query['id']
        if (dId) { sockets[dId] = socket }
        onDisconnect(socket)
        console.log(sockets)
    })
}

function onDisconnect(socket) {
    socket.on('disconnect', () => {
        console.log(socket.id)
        delete sockets[socket.id]
        console.log(sockets)
    })
}

function listenAlarm(socket) {
    socket.on('alarm', (type) => {
        console.log(type)
    })
}

function emitShutdown(clientID) {
    let socket = sockets[clientID]
    if (socket) socket.emit('shutdown')
}

function deviceWasUpdated() {
    io.emit('refreshDevicesTable', { for: 'everyone' });
}


module.exports = {
    connect,
    deviceWasUpdated,
    emitShutdown
}
