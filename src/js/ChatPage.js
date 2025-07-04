export default class ChatPage {
  constructor() {
    this.messagesContainer = null;
    this.messageForm = null;
    this.messageInput = null;
    this.socket = null;
    this.username = null;
    this.usersContainer = null;
  }

  init(container, username, socket) {
    if (!container || !username || !socket) return;

    this.username = username;
    this.socket = socket;
    container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', this.createElement());

    this.messagesContainer = document.querySelector('.messages');
    this.messageForm = document.querySelector('.message_form');
    this.messageInput = document.querySelector('.message_input');
    this.usersContainer = document.querySelector('.users_container');

    this.messageForm.addEventListener('submit', this.onSendMessage.bind(this));

    this.socket.addEventListener('message', this.onSocketMessage);
  }

  onSocketMessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'userList') {
      this.updateUserList(message.users);
    } else {
      this.renderMessage(message);
    }
  }

  renderMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');

    if (message.sender === this.username) {
        message.sender = 'You';
        msgDiv.style.textAlign = 'right';
      } else {
        msgDiv.style.textAlign = 'left';
      }

    switch(message.type) {
      case 'join':
        msgDiv.innerHTML = `<div class="message_info">${message.content}</div>`;
        break;
       case 'leave':
         msgDiv.innerHTML = `<div class="message_info">${message.content}</div>`;
         break;
      case 'message':
        const formattedTime = this.formatTime(message.time);
        
        msgDiv.innerHTML = `<div class="message_info">${message.sender}, ${formattedTime}</div>
                            <div class="message_content">${message.content}</div>`;

        if (message.sender === 'You') msgDiv.querySelector('.message_info').style.color = 'red';

        break;
      default:
        msgDiv.textContent = JSON.stringify(message);
    }

    this.messagesContainer.append(msgDiv);
    this.scrollToBottom(); 
  }

  updateUserList(users) {
    if (!this.usersContainer) return;
    this.usersContainer.innerHTML = '';

    console.log(users);

    users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.classList.add('user_item');

      userElement.insertAdjacentHTML('beforeend', this.createUser(user));
      
      if (user === this.username) {
        userElement.querySelector('.user_name').style.color = 'red';
      } 
      
      this.usersContainer.append(userElement);
    });
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
      this.messageInput.value = ''; 
    }
  }

  createElement() {
    return `
      <div class="users_container"></div>
      <div class="chat_container">
        <div class="messages"></div>
        <form class="message_form">
          <input type="text" class="message_input">
          <button type="submit" class="btn">Отправить</button>
        </form>
      </div>
    `;
  }

  createUser(user) {
    return `
        <div class="user_icon"></div>
        <div class="user_name">${user}</div>
    `;
  }

  formatTime(isoString) {
    const date = new Date(isoString);

    if(!date) return;
    
    // Автоматическое определение часового пояса пользователя
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    return new Intl.DateTimeFormat('ru-RU', options)
      .format(date)
      .replace(',', '');
  }

  // formatDateTime(isoString) {
  //   const date = new Date(isoString);
    
  //   const timezoneOffset = date.getTimezoneOffset() * 60000;
  //   const localDate = new Date(date.getTime() - timezoneOffset);
    
  //   const hours = localDate.getHours().toString().padStart(2, '0');
  //   const minutes = localDate.getMinutes().toString().padStart(2, '0');
  //   const day = localDate.getDate().toString().padStart(2, '0');
  //   const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
  //   const year = localDate.getFullYear().toString().slice(-2);
    
  //   return `${hours}:${minutes} ${day}.${month}.${year}`;
  // }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}