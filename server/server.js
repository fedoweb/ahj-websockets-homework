import Koa from 'koa';
import koaJson from 'koa-json';
import koaBodyPackage from 'koa-body';
const koaBody = koaBodyPackage.default || koaBodyPackage;
import cors from '@koa/cors';
import http from 'http'; // Импортируем модуль HTTP для работы с WebSocket
//import WebSocket from 'ws'; // Используем WebSocket сервер
import { WebSocket, WebSocketServer } from 'ws';

import UserstRepository from './UsersRepository.js';
import UsersController from './UsersController.js';
import UsersRouter from './UsersRouter.js';
import ChatRepository from './ChatRepository.js';

const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3030,
};

const app = new Koa();
const server = http.createServer(app.callback()); // Создаем HTTP-сервер
//const wsServer = new WS.Server({ server });
//const wss = new WebSocket.Server({ server }); // Настраиваем WebSocket поверх HTTP-сервера
const wss = new WebSocketServer({ server });


const usersRepository = new UserstRepository();
const usersController = new UsersController(usersRepository);
const router = new UsersRouter(usersController);
const chatRepository = new ChatRepository();

app.use(cors());
app.use(koaBody({
  parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'], // Добавляем DELETE
}));
app.use(koaJson());

app.use(async (ctx) => {
  if (ctx.request.path === '/') {
    await router.handleRequest(ctx);
  } else {
    ctx.throw(404);
  }
});

wss.on('connection', socket => {
  console.log('Новый клиент подключился!');

  const messages = chatRepository.getAll();
  messages.forEach((message) => {
    socket.send(JSON.stringify(message)); 
  });

  socket.on('message', async rawMsg => {
    try {
      const message = JSON.parse(rawMsg);
      message.time = new Date().toLocaleString();
      console.log('Получено от клиента:', message);
      
      if (message.type === 'join') {
        sendMessage({
          type: 'join',
          sender: message.sender,
          content: `${message.sender} присоединился к чату`
        }, socket);
      } else if (message.type === 'message') {
        chatRepository.addMessage(message);

        sendMessage({
          type: 'message',
          sender: message.sender,
          content: message.content,
          time: message.time
        }, socket);
      }
    } catch (err) {
      console.error('Ошибка обработки сообщения:', err);
    }
  });

  socket.on('close', () => {
    console.log('Клиент отключился.');
    sendMessage({
      type: 'leave',
      sender: 'Система',
      content: 'Пользователь покинул чат'
    });
  });

  socket.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });
});

function sendMessage(message) {

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message)); // Отправляем сообщение каждому клиенту
    }
  });
}

server.listen(config.port, () => { // Changed from app.listen to server.listen
  console.log('Server started on port', config.port);
});

//app.listen(config.port);
//console.log('Server started on port', config.port);