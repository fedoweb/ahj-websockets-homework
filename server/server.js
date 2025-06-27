import Koa from 'koa';
import cors from '@koa/cors';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import ChatRepository from './ChatRepository.js';
import UserRepository from './UserRepository.js';

const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3030,
};

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocketServer({ server });
const chatRepository = new ChatRepository();
const users = new UserRepository();

app.use(cors({
  origin: '*',
  credentials: true
}));


wss.on('connection', socket => {
  console.log('Новый клиент подключился!');

  socket.on('message', async rawMsg => {

    try {
      const message = JSON.parse(rawMsg);
      message.time = new Date().toISOString();
      console.log('Получено от клиента:', message);

      if(message.type === 'register') {
        const username = message.username;

        if(users.hasUsername(username)) {
          socket.send(JSON.stringify({
            type: 'register',
            success: false,
            message: 'Имя пользователя уже занято'
          }));
          return;
        }

        users.add(socket, username);

        socket.send(JSON.stringify({
          type: 'register',
          success: true,
          username: username
        }));

        const messages = chatRepository.getAll();
        messages.forEach((message) => {
          socket.send(JSON.stringify(message)); 
        });

        broadcastUserList();

        sendMessage({
          type: 'join',
          sender: username,
          content: `${username} присоединился к чату`,
          time: message.time
        });

        return;
      }
      
      if (message.type === 'message') {
        const username = users.get(socket);
        if (!username) return;
        
        const msgData = {
          type: 'message',
          sender: username,
          content: message.content,
          time: new Date().toISOString()
        };
        
        chatRepository.addMessage(msgData);
        sendMessage(msgData);
      }
    } catch (err) {
      console.error('Ошибка обработки сообщения:', err);
    }
  });

  socket.on('close', () => {
    console.log('Клиент отключился.');

    if (users.hasSocket(socket)) {
      const username = users.get(socket);
      users.remove(socket);

      broadcastUserList();

      sendMessage({
        type: 'leave',
        sender: username,
        content: `${username} покинул чат`
      });
    }
  });

  socket.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });
});

function sendMessage(message) {

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message)); 
    }
  });
}

function broadcastUserList() {
  const usersList = users.getAll();
  const message = JSON.stringify({
    type: 'userList',
    users: usersList
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(config.port, () => { 
  console.log('Server started on port', config.port);
});
