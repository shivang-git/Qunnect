const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 8000
const UserRouter = require('../routes/UserRoute')
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)

const chatters = {}

io.on('connection', (socket) => {

    socket.on('user-joins', (user) => {
        chatters[socket.id] = user
        socket.emit('welcome-msg', "Welcome to Qunnect")
        socket.broadcast.emit('user-joined', { user: user, chatters: chatters })
        socket.emit('users-name', chatters)

    })


    socket.on('chat-send', (msg) => {
        socket.broadcast.emit('chat-recieve', { message: msg, user: chatters[socket.id] })
    })

    socket.on('typing', user => {
        socket.broadcast.emit('typing', user)
    })



    socket.on('disconnect', (msg) => {
        socket.broadcast.emit('left-chat', chatters[socket.id])
        delete chatters[socket.id]
        socket.broadcast.emit('user-left', chatters)

    })
})


const staticpath = path.join(__dirname, '../public')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(staticpath))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'));




app.use('/', UserRouter)

server.listen(port, () => {
    console.log(`server listening ${port}`);
})