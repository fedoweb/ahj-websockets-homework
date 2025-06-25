export default class ChatRepository {
  constructor() {
    this.db = [];
  }

  addMessage(message) {
    this.db.push(message);
  }

  getAll() {
    return this.db.slice();
  }
}