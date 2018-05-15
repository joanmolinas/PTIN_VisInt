from socketIO_client import SocketIO, BaseNamespace

def show_menu():
    print "==== MENU ===="
    print "1) emit"
    print "2) wait 5s to shutdown"
    print "0) exit"
    choice = raw_input("-> ")

    return choice

def emit():
    print "=== Alert type === "
    print "1) Fire"
    choice = raw_input("-> ")
    print choice
    socketIO.emit('alarm', {'type': 1})

def wait():
    socketIO.wait(seconds=5)

menu_choices = {
    '1': emit,
    '2': wait
}

# Main
socketIO = SocketIO('localhost', 3000, {"id": "12345"})
def shutDown(*args):
    print 'shut down received'

socketIO.on('shutdown', shutDown)

choice = show_menu()

while choice != '0':
    menu_choices[choice]()
    choice = show_menu()
