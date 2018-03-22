const socket = io.connect('http://localhost:8000/');
let user = '';

window.onload = () => {
    let users_container = document.getElementById('userlist');
    let message_container = document.getElementById('messages');

    message_container.style.height = window.innerHeight - 200 + 'px';
    
    let btn = document.getElementById('btn');
    let message_input = document.getElementById('inp');
    
    socket.emit('load users');
    socket.on('users loaded', data => {
        let display_users =data.users.map((username) => {
            return `<li>${username}</li>`;
        });
        users_container.innerHTML = display_users.join(' ');
    });

    socket.emit('load messages');
    socket.on('messages loaded', data => {
        let display_messages = data.messages.map( msg => {
            return (`<div class ="panel well">
                        <h4>${msg.author}</h4>
                        <h5>${msg.text}</h5>
                        </div>`)
        });
        message_container.innerHTML = display_messages.join(' ');
    });

    socket.on('chat message', message => {
        console.log(message);
        let display_message = `<div class ="panel well">
                                    <h4>${message.author}</h4>
                                    <h5>${message.text}</h5>
                                    </div>`
        message_container.innerHTML += display_message;
        
    })

    socket.on('new user', data => {
        user = data.name;
    })
    btn.onclick = () => {
        socket.emit('send message',{text: message_input.value, author: user});
    }
}