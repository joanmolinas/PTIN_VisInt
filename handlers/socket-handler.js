const Device = require('../models/Device')

let io;

let sockets = {}

function connect(http) {
    io = require('socket.io')(http);
       
    io.on('connection', (socket) => {
        console.log('Device connected')
        let dId = socket.handshake.query['id']
        console.log(dId)
        if (dId) { 
            sockets[dId] = socket 
            // TODO: Mirar si el dispositiu està habilitat
            Device.findByIdAndUpdate(dId, {
                $set: { active: true }
            }).exec()
            
        }
        onDisconnect(socket)
        fire(socket)
        heart_attack(socket)
        high_temp(socket)
        low_temp(socket)
    })
}

function onDisconnect(socket) {
    socket.on('disconnect', () => {
        let dId = socket.handshake.query['id']
        delete sockets[dId]
        Device.findByIdAndUpdate(dId, {
            $set: { active: false }
        }).exec()
    })
}

// listen and receive fire notification
function fire(socket) {
    socket.on('fire', () => {
        console.log('Fire notification received')
    })
}

// listen and receive heart attack notification
function heart_attack(socket) {
    socket.on('heart_attack', () => {
        // Crear notificació
        // Buscar el metge més proper
        // 
    })
}

// listen and receive high temperature notification
function high_temp(socket) {
    socket.on('high_temp', () => {
	    console.log('High temperature notification received')
    })
}

// listen and receive low temperature notification
function low_temp(socket) {
    socket.on('low_temp', () => {
	    console.log('Low temperature notification received')
    })
} 

function deviceWasUpdated() {
    io.emit('refreshDevicesTable', { for: 'everyone' });
}

// nil
function notificationWasUpdated() {
    io.emit('refreshNotificationsTable', { for: 'everyone' });
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
    notificationWasUpdated,
    emitShutdown,
    emitToDoctor,
    emitToPacient
}
