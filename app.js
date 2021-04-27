const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4100
require('dotenv').config()

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


app.use(express.static('public'))
   .use(express.urlencoded({ extended: true }))
   .set('view engine', 'ejs')
   .set('views', 'views')


app.get('/', (req, res) => {

  let firebaseData = []
  db.collection("App data").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        firebaseData.push(doc.data())
    });

    res.render('home', {
      data: firebaseData
    })
  });
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('padClick', (padChange) => {
    socket.broadcast.emit('padChange', padChange);

    let dbRow = padChange.padId.slice(0, 4);
    let dbPadId = padChange.padId;
    let dbPadValue = padChange.padValue;

    let appData = db.collection("App data").doc(dbRow);

    return appData.update({
      [dbPadId]: dbPadValue
    })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
  })

  socket.on('message', (message) => {
    socket.broadcast.emit('message', message)
  })
});

server.listen(port, () => {
  console.log(`Beatogether app listening at http://localhost:${port}`)
})