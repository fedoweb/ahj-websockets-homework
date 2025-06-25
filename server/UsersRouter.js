export default class UsersRouter {
  constructor(controller) {
    this.controller = controller;
  }

  async handleRequest(ctx) {
    const method = ctx.request.query.method;

    switch(method) {
      case 'addUser':
        return await this.controller.addUser(ctx);

      case 'getAllUsers':
        return await this.controller.getAllUsers(ctx);

      case 'getUser':
        return await this.controller.getUser(ctx);

      case 'deleteUser':
        return await this.controller.deleteUser(ctx);

      default:
        ctx.status = 405;
        ctx.body = { error: 'Метод не поддерживается' };
    }
  }
}