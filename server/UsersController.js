export default class UsersController {
  constructor(repository) {
    this.repository = repository;
  }

  async addUser(ctx) {
    try {
      const user = await this.repository.add(ctx.request.body);
      ctx.status = 200;
      ctx.body = user;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }

  async getAllUsers(ctx) {
    try {
      const users = await this.repository.getAll();
      ctx.status = 200;
      ctx.body = users;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }

  async getUser(ctx) {
    try {
      const user = await this.repository.get(ctx.query.username);
      ctx.status = 200;
      ctx.body = user;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }

  async deleteUser(ctx) {
    try {
      const user = await this.repository.remove(ctx.query.username);
      ctx.status = 200;
      ctx.body = user;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }
}