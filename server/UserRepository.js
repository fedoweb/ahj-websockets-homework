export default class UserRepository {
  constructor() {
    this.users = new Map();
  }

  hasUsername(username) {
    return Array.from(this.users.values()).includes(username);
  }

  hasSocket(socket) {
    return this.users.has(socket);
  }

  get(socket) {
    return this.users.get(socket);
  }

  getAll() {
    return [...this.users.values()];
  }

  add(socket, username) {
    this.users.set(socket, username);
  }

  remove(socket) {
    this.users.delete(socket);
  }
}