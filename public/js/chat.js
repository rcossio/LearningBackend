const socket = io();
socket.emit('userIdentified', username);

socket.on('chatHistory', (messages) => {
  const chatHistory = document.getElementById('chatHistory');

  chatHistory.innerHTML = ''
  messages.forEach(message => {
    chatHistory.innerHTML += `<p>${message}</p>`;
  });
});

const chatForm = document.getElementById('chatForm');
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const chatInput = document.getElementById('chatInput');
  const newMessage = `${new Date().toLocaleString()}  -  ${username.toUpperCase()}: ${chatInput.value}`;
  socket.emit('newMessage', username, newMessage);
  chatInput.value = '';
});