const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4100
require('dotenv').config()




app.use(express.static('public'))
   .use(express.urlencoded({ extended: true }))
   .set('view engine', 'ejs')
   .set('views', 'views')


app.get('/', (req, res) => {
  res.render('home')
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
})
});

server.listen(port, () => {
  console.log(`Beatogether app listening at http://localhost:${port}`)
})