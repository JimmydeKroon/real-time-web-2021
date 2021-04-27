const socket = io()

const rows = document.querySelectorAll('.pads > .padsgroup')
const pads = document.querySelectorAll('.padsgroup input')
const labels = document.querySelectorAll('.padsgroup label')

const playButton = document.querySelector('.play-btn')
const playIcon = document.querySelector('.play-icon')

let playing = false;

// Play/pause on playbutton click
playButton.addEventListener('click', function() {
  if (playing == false) {
    loop();
    playing = true
  } else {
    clearInterval(startLoop);
    playing = false
  }

  playIcon.classList.toggle('pause');
})

// The actual step sequencer logic
let startLoop;
let step = 0;

function loop() {
  startLoop =  setInterval(function() {
    if (step > 7) {step = 0}

    labels.forEach(function(label) {
      label.classList.remove('playindicator')
    })

    for (let i = 0; i < rows.length; i++) {

      const row = rows[i];
      const input = row.querySelector(`input:nth-of-type(${step + 1})`);
      
      input.nextElementSibling.classList.add('playindicator')

      if (input.checked) {
        let rowNumber = input.id.slice(0, 4);
        
        if (rowNumber == 'row1') {
          new Audio('sounds/kick.wav').play()
        }
        
        if (rowNumber == 'row2') {
          new Audio('sounds/snareclap.wav').play()
        }
        
        if (rowNumber == 'row3') {
          new Audio('sounds/basspluck.wav').play()
        }
      }
    }
    step++;
  }, 600);
}

// Send changes in the selected pads trough a socket
pads.forEach(function(pad) {
  pad.addEventListener('change', function() {
    let padId = this.id

    if (this.checked) {
      socket.emit('padClick', { padId: padId, padValue: 'checked' })
    } else {
      socket.emit('padClick', { padId: padId, padValue: '' })
    }
  })
})

// Handle changes from other clients from the socket
socket.on('padChange', (padChange) => {
  checkoruncheck(padChange.padId, padChange.padValue);
})

function checkoruncheck(padid, padvalue) {
  let padToChange = document.querySelector('#' + padid);
  padToChange.checked = !padToChange.checked
}

//-------
// CHAT
//-------

//username

let username = '';
const userColors = ['#42C6EB', '#428EEB', '#42EB66', '#6642EB', '#C6EB42', '#BB42EB'];
const random = Math.floor(Math.random() * userColors.length);
const ownColor = userColors[random];

const usernameInput = document.querySelector('#username');
const usernameConfirm = document.querySelector('#username-button');

usernameConfirm.addEventListener('click', function(event) {
  event.preventDefault();

  username = usernameInput.value
  
  document.querySelectorAll('.hide')[0].classList.remove('hide');
  document.querySelectorAll('.hide')[0].classList.remove('hide');

  usernameInput.remove();
  usernameConfirm.remove();

  const welcomemessage = document.createElement('h2')
  welcomemessage.textContent = 'Hi, ' + username + '!'
  welcomemessage.className = 'welcomemessage';
  document.querySelector('main').appendChild(welcomemessage);
});

// Send messages
const sendButton = document.querySelector('#send-button');

sendButton.addEventListener('click', function(event) {
  event.preventDefault()

  let messageToSend = document.querySelector('#message').value;
  
  if (messageToSend != '') {
    socket.emit('message', { username: username, message: messageToSend, usercolor: ownColor })
    
    renderMessage(username, messageToSend)
  }

  document.querySelector('#message').value = '';
})

// Receive messages
socket.on('message', (message) => {
  console.log(message.username, message.message, message.usercolor);
  renderMessage(message.username, message.message, message.usercolor)
})

// Render messages
const chat = document.querySelector('.chat');

function renderMessage(user, message, usercolor) {
  const span = document.createElement('span')
  const listItem = document.createElement('li')

  span.textContent = message
  listItem.textContent = user

  listItem.appendChild(span)
  chat.appendChild(listItem)

  chat.scrollTop = chat.scrollHeight
  
  if (user == username) {
    listItem.className = 'own-message';
    listItem.style.color = ownColor
  } else {
    listItem.className = 'socket-message';
    listItem.style.color = usercolor
  }
}

// Chat
const chatButton = document.querySelector('.chat-button')
const chatBox = document.querySelector('.chat-box')

let chatHidden = true;

chatButton.addEventListener('click', function() {
  if (chatHidden == true) {
    chatHidden = false;

    chatBox.classList.remove('chat-slideout');
    chatBox.classList.add('chat-slidein');
    chatBox.classList.remove('hide');

  } else {
    chatBox.classList.remove('chat-slidein');
    chatBox.classList.add('chat-slideout');
    setTimeout(() => {
      chatBox.classList.add('hide');
    }, 300);

    chatHidden = true;
  }
})

// Panels
const panelLinkbutton = document.querySelector('.panel-linkbutton')
const panelChatbutton = document.querySelector('.panel-chatbutton')

panelLinkbutton.addEventListener('click', function() {
  navigator.clipboard.writeText(window.location.href);
  panelLinkbutton.textContent = 'Copied! ✅'
})

panelChatbutton.addEventListener('click', function() {
  if (chatHidden == true) {
    chatHidden = false;

    chatBox.classList.remove('chat-slideout');
    chatBox.classList.add('chat-slidein');
    chatBox.classList.remove('hide');

  }
})