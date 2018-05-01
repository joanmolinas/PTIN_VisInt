let io;

function connect(http) {
    io = require('socket.io')(http);

    io.on('connection', (socket) => {
        console.log('Webpage connected')
        listenAlarm(socket)


        setTimeout(() => {
            io.emit('shutdown')
        }, 3000);
    })
}

function listenAlarm(socket) {
    socket.on('alarm', (type) => {
        console.log(type)
    })
}

function deviceWasUpdated() {
    io.emit('refreshDevicesTable', { for: 'everyone' });
}

module.exports = {
    connect,
    deviceWasUpdated
}
