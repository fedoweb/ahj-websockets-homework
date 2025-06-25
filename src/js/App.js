//import Router from "./router.js";
//import { routes } from './routes.js';
import IndexPage from "./IndexPage.js";
import ChatPage from "./ChatPage.js";
import User from "./UserName.js";

export default class App {
  constructor(root) {
    this.root = root;
    this.router = null;
    this.user = new User();
    this.indexPage = new IndexPage();
    this.chatPage = new ChatPage();
    //this.socket = null;


    this.formData = null;
    this.form = null;
  }

  async init() {
    this.indexPage.init(this.root);

    this.form = this.root.querySelector('form');
    this.form.addEventListener('submit', this.onSubmit);
    }

    onSubmit = async (e) => {
    e.preventDefault();

    this.formData = new FormData(this.form);
    const username = this.formData.get('username');

    try {
      const user = await this.user.create(username);
      this.indexPage.closeModal();
      this.chatPage.init(this.root, user.username);

      //this.connectWebsocket(user.username);
    } catch (error) {
      this.indexPage.showError(error.message);
    }
  }  
}