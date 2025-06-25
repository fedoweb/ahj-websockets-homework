

export default class Router {
  constructor(root, routes) {
    this.root = root;
    this.routes = routes;
    this.path = null;
    this.registerEvents();
  }

  goTo(path) {
    const createPage = this.routes[path];

    this.root.textContent = '';
    //this.root.append(createPage());
  }

  registerEvents() {
    document.addEventListener('click', (e) => {
      
      if(e.target.hasAttribute('data-route')) return;

      const { route } = e.target.dataset;
      const id = route || e.target.getAttribute('href');
      
      this.goTo(id);
      e.preventDefault();
    })
  }
}