export default class User {
  constructor() {
    this.username;
    this.baseUrl = 'http://localhost:3030';
  }

  async create(username) {
    if(!username) return { success: false, error: 'Имя пользователя не указано' };

    try {
    const response = await fetch(`${this.baseUrl}/?method=addUser`, {
      method: 'POST',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(this.createBody(username))
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    } 
    return await response.json();

    } catch (e) {
      throw new Error(e.message);
    }
  }

  async get(username) {
    if(!username) return;

    try {
    const response = await fetch(`${this.baseUrl}/?method=getUser&username=${username}`, {
      method: 'GET',
      headers: { "Content-Type": "application/json"},
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getAll() {
    try {
    const response = await fetch(`${this.baseUrl}/?method=getAllUsers`, {
      method: 'GET',
      headers: { "Content-Type": "application/json"},
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
    } catch (e) {
      throw new Error(e.message);
    }
  }
  
  async remove(username) {
    if(!username) return;

    try {
    const response = await fetch(`${this.baseUrl}/?method=deleteUser&username=${username}`, {
      method: 'DELETE',
      headers: { "Content-Type": "application/json"},
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  createBody(username) {
    if(!username) return;
    return { username: username };
  }
}