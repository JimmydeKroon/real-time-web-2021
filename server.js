require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http').createServer(app)
// const session = require('express-session')
const io = require('socket.io')(http)
const port = process.env.PORT || 3300
const { join } = require('path')
// const mongo = require('mongodb')



app
    .use(express.static(`${__dirname}/public`))
    .use(express.urlencoded({ extended: true }))
    .set('view engine', 'ejs')
    .set('views', join(`${__dirname}/views`))
    .get('/', (request, response) => {
        response.render('home')
    })

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('message', (message) => {
        // console.log('message: ' + message)
        io.emit('message', message)
    })

    socket.on('typing', (statusTyping) => {
      // console.log(statusTyping);
      io.emit('typing', statusTyping)
  })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

http.listen(port, function () {
    console.log(`Server listening at http://localhost:${port}`)
})
