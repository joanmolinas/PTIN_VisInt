const Device = require('../models/Device')
const Notification = require('../models/Notification')
const Geo = require('geo-nearby');

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
        alarm(socket)
        // fire(socket)
        // heart_attack(socket)
        // high_temp(socket)
        // low_temp(socket)
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

// Socket listener
let callbacks = {
    1: heartAttack
}

function alarm(socket) {
    socket.on('alarm', (data) => {
        let id = socket.handshake.query['id']
        data['requester'] = id
        callbacks[data.type](data).
        then(resp => {
            notificationWasUpdated()
        })
        .catch(e => {
            console.log(e)
        })
    })
}

// Private
function heartAttack(data) {
    return new Promise((resolve, reject) => {

        Promise.all([
            Device.find({'additionalInfo.type': 1, active: true}),
            Device.findById(data.requester)
        ])
        .then(([doctors, requester]) => {
            if (doctors.length == 0) {
                console.log("Metges no actius")
                reject({error: 404, message: 'Metges no disponibles'})
                return
            }

            const dataSet = Geo.createCompactSet(doctors, {id: '_id', lat: ['lastInfo', 'latitude'], lon: ['lastInfo', 'longitude']})
            const geo = new Geo(dataSet)
            let nearestDoctors = geo.limit(1).nearBy(data.latitude, data.longitude, [0, 5000])

            if (nearestDoctors.length == 0) {
                console.log("Cap metge aprop")
                reject({error: 404, message: 'Metges no disponibles'})
                return
            } 
            let doctorId = nearestDoctors[0].i
            console.log("Metge trobat => " + nearestDoctors[0].i)
            data.requester = requester
            emitToDoctor(doctorId, data)

            let doctor = doctors.filter(item => item._id === doctorId)[0]

            // let notification = new Notification({
            //     requester: requester._id,
            //     date: new Date().toISOString(),
            //     deviceAssociated: doctor._id,
            //     readed: false,
            //     typeOfAction: 1
            // })

            // notification.save()
            // .then(resolve)
            // .catch(reject)
        })
        .catch(e => {
            console.log(e)
            reject({error: 500, message: 'Error buscant a mongo'})
        })
    })
}


// Emit
function deviceWasUpdated() {
    io.emit('refreshDevicesTable', { for: 'everyone' });
}

// nil
function notificationWasUpdated() {
    io.emit('refreshNotificationsTable', "");
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

// Utils


module.exports = {
    connect,
    deviceWasUpdated,
    notificationWasUpdated,
    emitShutdown,
    emitToDoctor,
    emitToPacient
}
