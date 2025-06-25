export default class ChatPage {
  constructor() {
    this.messagesContainer = null;
    this.messageForm = null;
    this.messageInput = null;
    this.socket = null;
    this.username = null;
  }

  init(container, username) {
    if (!container || !username) return;
    this.username = username;
    container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', this.createElement());

    this.messagesContainer = document.querySelector('.messages');
    this.messageForm = document.querySelector('.message-form');
    this.messageInput = document.querySelector('.message-input');

    this.messageForm.addEventListener('submit', this.onSendMessage.bind(this));

    this.connectWebsocket(username);
  }

  renderMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');

  // Позиционируем сообщения в зависимости от отправителя
  if (message.sender === this.username) {
    message.sender = 'you';
    msgDiv.style.textAlign = 'right';
  } else {
    msgDiv.style.textAlign = 'left';
  }

  switch(message.type) {
    case 'join':
      msgDiv.innerHTML = `<em>${message.sender} присоединился к чату</em>`;
      break;
    case 'leave':
      msgDiv.innerHTML = `<em>${message.content}</em>`;
      break;
    case 'message':
      msgDiv.innerHTML = `<strong>${message.sender}:</strong> ${message.content}, ${message.time}`;
      break;
    default:
      msgDiv.textContent = JSON.stringify(message);
  }

  this.messagesContainer.appendChild(msgDiv);
  this.scrollToBottom(); // Прокручиваем список сообщений вниз
}

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  connectWebsocket(username) {
    this.socket = new WebSocket("ws://localhost:3030/ws");

    this.socket.onopen = () => {
      console.log("Подключён к сокету!");

      this.sendMessage({
        type: 'join', 
        data: username,
        sender: username
      }); // Сообщаем о подключении нового пользователя
    };

    this.socket.onmessage = (e) => {
      let message = JSON.parse(e.data);
      console.log('message', message);
      this.renderMessage(message);
    };

    this.socket.onclose = () => {
      console.log("Отключился от сокета.");
    };

    this.socket.onerror = err => {
      console.error("Ошибка сокета:", err);
    };
  }

  sendMessage(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  onSendMessage = (e) => {
    e.preventDefault();
    const text = this.messageInput.value.trim();
    console.log(text);
    if (text.length > 0) {
      this.sendMessage({type: 'message', sender: this.username, content: text});
      this.messageInput.value = ''; // Очищаем поле ввода
    }
  }

  createElement() {
    return `
      <div class="chat-container">
        <div class="messages"></div>
        <form class="message-form">
          <input type="text" class="message-input">
          <button type="submit">Отправить</button>
        </form>
      </div>
    `;
  }
}