const socket = io()
const messages = document.querySelector('section ol')
const input = document.querySelector('input')
const form = document.querySelector('form')
const typingText = document.querySelector('.typing')
const statusTypingText = 'Someone is typing';
var timeout  = setTimeout(function(){}, 0);
console.log(typingText);

input.addEventListener('keypress', function(){
  clearTimeout(timeout); /// clear timeout if user is typing
  socket.emit('typing', statusTypingText);
  timeout = setTimeout(function() 
    { socket.emit('typing', '') }, 1500 /// Time in milliseconds
)}
)

form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (input.value) {
        socket.emit('message', input.value)
        input.value = ''
    }
})

socket.on('message', function (message) {
    const element = document.createElement('li')
    element.textContent = message
    messages.appendChild(element)
    messages.scrollTop = messages.scrollHeight 
})

socket.on('typing', function (statusTyping) {
  typingText.textContent = statusTyping
})