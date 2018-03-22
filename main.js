const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');

const port = 8000;

const connections = [];
const users = [];
const messages = [];

app.get('/', (req, res) => {
        res.sendfile(path.join(__dirname, 'auth.html'));
    });

app.get('/:id', (req, res) => {
    if (req.params.id == 'client.js') {
        res.sendfile(path.join(__dirname, 'client.js'));
    }
    else if (req.params.id == 'favicon.ico') {
        res.sendStatus(404);
    }
    else {
        users.push(req.params.id);
        res.sendfile(path.join(__dirname, 'index.html'));
    }
})

io.on('connection', socket => {
    connections.push(socket);
    console.log(users);
    console.log('Connected: %s sockets connected', connections.length);
    
    socket.on('disconnect', data => {
        let index = connections.indexOf(socket)
        let deletedItem = connections.splice(index, 1);
        users.splice(index, 1);
        io.sockets.emit('users loaded', {users: users })
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', data => {
        messages.push(data);
        io.sockets.emit('chat message', data);
    });
    socket.on('load users', () => {
        console.log(users);
        io.sockets.emit('users loaded', {users: users})
    });
    socket.on('load messages', () => {
        socket.emit('messages loaded', { messages: messages})
    })
    socket.emit('new user', {name: users[users.length - 1]});
    
})
        server.listen(port, () => {
            console.log('app running on port ' + port);
})