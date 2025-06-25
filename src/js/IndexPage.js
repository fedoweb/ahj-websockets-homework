export default class IndexPage {
  constructor() {
    //this.user = user;
    this.container = null;
  }

  init(container) {
    if(!container) return;
    this.container = container;

    this.container.insertAdjacentHTML('beforeend', this.createElement());
  }


  closeModal() {
    const modal = this.container.querySelector('.modal');
    if(!modal) return;

    modal.remove();
  }

  createElement() {
    return `
      <form class="modal" id="modal">
        <h2 for="username" class="modal_title">Выберите псевдоним</h2>
        <input id="username" name="username" type="text" class="modal_content">
        <button type="submit" class="modal_btn">Продолжить</button>
      </form>
    `;
  }

  showError(message) {
    const error = this.container.querySelector('.error');
    if(error) error.remove();

    const form = this.container.querySelector('form');
    if(form) form.insertAdjacentHTML('beforeend', this.errorElement(message));
  }

  errorElement(message) {
    return `
    <div class="error">${message}</div>
    `;
  }
}