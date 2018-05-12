let io;

let sockets = {}

function connect(http) {
    io = require('socket.io')(http);
       
    io.on('connection', (socket) => {
        console.log('Device connected')
        let dId = socket.handshake.query['id']
        if (dId) { sockets[dId] = socket }
        onDisconnect(socket)
    })
}

function onDisconnect(socket) {
    socket.on('disconnect', () => {
        console.log(socket.id)
        delete sockets[socket.id]
        console.log(sockets)
    })
}


function deviceWasUpdated() {
    io.emit('refreshDevicesTable', { for: 'everyone' });
}

function emitShutdown(clientID) {
    let socket = sockets[clientID]
    if (socket) socket.emit('shutdown')
}

function emitToDoctor(clientID, message) {
    let socket = sockets[clientID]
    if (socket) socket.emit('pacientLocation', message)
}

function emitToPacient(clientID, message) {
    let socket = sockets[clientID]
    if (socket) socket.emit('location', message)
}

module.exports = {
    connect,
    deviceWasUpdated,
    emitShutdown,
    emitToDoctor,
    emitToPacient
}
