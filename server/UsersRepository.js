export default class UsersRepository {
  constructor() {
    this.users = new Map();
  }

  has(username) {
    return this.users.has(username);
  }

  get(username) {
    if (!this.has(username)) throw Error ('Пользователь не найден');

    return this.users.get(username);
  }

  getAll() {
    console.log(Array.from(this.users.values()))
    return Array.from(this.users.values());
  }

  add(user) {
    if (this.has(user.username)) throw Error ('Имя пользователя занято');

    this.users.set(user.username, user);
    console.log(this.get(user.username));
    return this.get(user.username);
  }

  remove(username) {
    if (!this.has(username)) throw Error ('Пользователь не найден');

    const user = this.get(username);
    this.users.delete(username);
    return user;
  }
}