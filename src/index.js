const express = require('express')
const path = require('path')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const { generateMessage } = require('./utils/message')
const { generateLocation } = require('./utils/location')
const {addUser,removeUser,getUserById,getUsersByRoom } = require('./utils/user')
const server = http.createServer(app)
const port = process.env.PORT || 3000
const public_directory = path.join(__dirname,'../public')
const Filter = require('bad-words')
const io = socketio(server)
let count = 0 
app.use(express.static(public_directory))
io.on('connection',(socket)=>{
    console.log('New Websocket Connection')
      
    socket.on('join',(option,callback) => {
        const {error,user} = addUser({id:socket.id, ...option})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('welcome',generateMessage(`Welcome ${user.username} `,'Admin'))
        socket.broadcast.to(user.room).emit("welcome",generateMessage(`${user.username} has Joined`,'Admin'))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersByRoom(user.room)
        })
        callback()
        socket.on('disconnect',()=>{
            const user = removeUser(socket.id)
            if(user){
                io.emit('message',generateMessage(`${user.username} has Left`,'Admin'))
                io.to(user.room).emit('roomdata',{
                    room:user.room,
                    users:getUsersByRoom(user.room)
                }) 
            }
        })
    } )

    socket.on('message',(message,callback)=>{
        var user = getUserById(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        io.to(user[0].room).emit('message',generateMessage(message,user[0].username))
        callback()
     
    })

    socket.on('sendLocation',(lat,log,callback)=>{
        var user = getUserById(socket.id)
        io.to(user[0].room).emit('sendLocation',   generateLocation (lat,log,user[0].username))
        callback()
    })
})

server.listen(3000,()=>{
    console.log('Conected')

})