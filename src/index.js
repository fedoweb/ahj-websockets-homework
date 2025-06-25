import './css/style.css';
import App from './js/App.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.app');

  const app = new App(root);
  app.init();
})
