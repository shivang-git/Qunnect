const socket = io();

let user
let key
do {
    user = prompt('Enter your name:');

} while (!user);

const userhead = document.getElementById("userhead");
userhead.innerHTML = `${user}`;


const form = document.getElementById('chat-form');;
const textarea = document.getElementById('textarea');;
const chat_messages = document.querySelector('.chat-messages');
const rec_audio = new Audio('./audio/receive.mp3')
const send_audio = new Audio('./audio/send.mp3')



// const chat_message_center = document.getElementById('chat-center');       
// const chat_message_right = document.getElementById('chat-right');       
// const chat_message_left = document.getElementById('chat-left');       


// function display_center(message);        {
//     const chat_center = document.createElement('div');       
//     chat_center.innerText = message
//     chat_message_center.appendChild(chat_center);       
// }

// function display_right(message);        {
//     const chat_right = document.createElement('div');       
//     chat_right.innerText = message
//     chat_message_right.append(chat_right);       

// }

// function display_left(message);        {
//     const chat_left = document.createElement('div');       
//     chat_left.innerText = message
//     chat_message_left.append(chat_left);       
// }

function display_msg(messages, position) {
    const chat_messages = document.querySelector('.chat-messages')
    const msg = document.createElement('div');
    msg.classList.add(position);
    dates = `<div class='text-muted small text-center align-items-end' > ${moment().format('LT')}</div>`;
    msg.innerHTML = messages + dates
    chat_messages.append(msg);


    if (position == 'chat-message-left') {
        rec_audio.play()
    } else if (position == 'chat-message-right') {
        send_audio.play()
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const send_message = textarea.value
    if (send_message) {
        // display_right(`You: ${send_me}`)
        display_msg(`<strong>You</strong>: ${send_message}&nbsp`, 'chat-message-right');
        socket.emit('chat-send', send_message);
        textarea.focus()
        textarea.value = ''
        scrolls()

    }
});

function scrolls() {
    chat_messages.scrollTop = chat_messages.scrollHeight

}

// typing status
textarea.addEventListener('keydown', (e) => {
    socket.emit('typing', user)
})

const typingele = document.getElementById("typing")
const timerid = null

function debounce(func, timer) {
    if (timerid) {
        clearTimeout(timerid)
    }
    timerid = setTimeout(() => {
        func()
    }, timer)
}



socket.emit('user-joins', user);

socket.on('user-joined', user => {
    // display_center(`${user} joined the chat.`);       
    display_msg(`<div style="font-weight: 600;">${user} joined the chat.</div>`, 'chat-message-center');
});


socket.on('chat-recieve', data => {
    // display_left(`${data.user} : ${data.message}`);       
    display_msg(`<strong>${data.user}</strong> : ${data.message}&nbsp`, 'chat-message-left');
    scrolls()

});

socket.on('typing', user => {
    typingele.innerText = `${user} is typing...`;
    debounce(function() {
        typingele.innerText = ''
    }, 3000)

})


socket.on('left-chat', (msg) => {
    // display_center(`${msg} left the chat.`);       
    display_msg(`<div style="font-weight: 600;">${msg} left the chat.</div>`, 'chat-message-center');

});