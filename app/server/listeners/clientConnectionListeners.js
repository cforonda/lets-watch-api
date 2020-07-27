
handleClientUpdate = (io, socketRoom='community', event = '') => {

    return new Promise((resolve, reject) => {
        io.of('/').in(socketRoom).clients((error, clients) => {
            resolve(clients);
          });
    }).then(clients => {
        if(event) {
            console.log(event);
        }
        // notify all users of the event
        io.to(socketRoom).emit('updateClients', { 
            message: event,
            numClients: clients.length
        });
    })
}

const addNewClientConnectListener = (socket, io) => {
    const event = 'New Client Connected!'
    handleClientUpdate(io, null, event);
}

const handleClientDisconnect = (socket, io) => {
    const event = 'Client Disconnected!'
    handleClientUpdate(io, null, event);
    socket.broadcast.emit('leave-room', socket.nickname);
}

const addNumClientsListener = (socket, io) => {
    socket.on('getNumClients', clientRoom => {
        handleClientUpdate(io, clientRoom);
    });
}

const addClientDisconnectListener = (socket, io, connectedClients) => {
    socket.on("disconnect", () => {
        handleClientDisconnect(socket, io);
    });
}

const addClientNicknameListener = (socket) => {
    socket.on('update-nickname', nickname => {
        console.log('retrieved a nickname!: ', nickname)
        socket.nickname = nickname;
    });
}

module.exports = {
    setupClientConnectionListeners: (socket, io, connectedClients) => {
        addNewClientConnectListener(socket, io);
        addClientNicknameListener(socket);
        addNumClientsListener(socket, io);
        addClientDisconnectListener(socket, io, connectedClients);
    }    
}