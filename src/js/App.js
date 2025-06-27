import IndexPage from "./IndexPage.js";
import ChatPage from "./ChatPage.js";
export default class App {
  constructor(root) {
    this.root = root;
    this.indexPage = new IndexPage();
    this.chatPage = new ChatPage();
    this.form = null;
    this.socket = null;
  }

  async init() {
    this.socket = new WebSocket("ws://localhost:3030/ws");

    this.indexPage.init(this.root);

    this.form = this.root.querySelector('form');
    this.form.addEventListener('submit', this.onSubmit);

    this.socket.addEventListener('message', this.onSocketMessage);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const username = this.form.querySelector('input').value.trim();
    
    if (!username) return;

    this.socket.send(JSON.stringify({
      type: 'register',
      username: username
    }));
  }

  onSocketMessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'register') {
      if (message.success) {
       
        this.indexPage.closeModal();
        this.chatPage.init(this.root, message.username, this.socket);
      } else {
        
        this.indexPage.showError(message.message);
      }
    }
  }
}