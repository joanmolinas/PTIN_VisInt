from socketIO_client_nexus import SocketIO

with SocketIO('localhost', 3000, {query:"id=1234"}) as socketIO:
    socketIO.emit('alarm')
    socketIO.wait(seconds=3)
