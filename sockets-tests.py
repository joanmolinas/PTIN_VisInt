from socketIO_client_nexus import SocketIO

with SocketIO('localhost', 3000) as socketIO:
    socketIO.emit('alarm')
    socketIO.wait(seconds=3)