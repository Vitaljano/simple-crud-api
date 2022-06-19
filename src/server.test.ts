const request = require('supertest');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 8080;

const address = `http://localhost:${PORT}`;

describe('Check is array returned', () => {
  test('Is array returned', async () => {
    const response = await request(address).get('/api/users').send();
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('Check is created objects', () => {
  test('Is created', async () => {
    const response = await request(address).get('/api/users').send();
    let objCount = response.body.length;

    const req1 = await request(address)
      .post('/api/users')
      .send({
        username: 'Jura',
        age: 50,
        hobbies: ['work', 'sport'],
      });
    const req2 = await request(address)
      .post('/api/users')
      .send({
        username: 'Damian',
        age: 23,
        hobbies: ['work', 'sport', 'music'],
      });
    const req3 = await request(address)
      .post('/api/users')
      .send({
        username: 'Tomas',
        age: 23,
        hobbies: [, 'sport', 'programing'],
      });
    const req4 = await request(address)
      .post('/api/users')
      .send({
        username: 'Etan',
        age: 18,
        hobbies: ['sport'],
      });
    const req5 = await request(address)
      .post('/api/users')
      .send({
        username: 'Victoria',
        age: 18,
        hobbies: ['music', 'sport'],
      });
    const req6 = await request(address)
      .post('/api/users')
      .send({
        username: 'Gena',
        age: 33,
        hobbies: ['sport'],
      });
    expect(req1.statusCode).toBe(201);
    expect(req2.statusCode).toBe(201);
    expect(req3.statusCode).toBe(201);
    expect(req4.statusCode).toBe(201);
    expect(req5.statusCode).toBe(201);
    expect(req6.statusCode).toBe(201);

    const addResponse = await request(address).get('/api/users').send();

    expect(addResponse.body.length).toBe(objCount + 6);
  });

  test('Test get obj by id', async () => {
    function between(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const response = await request(address).get('/api/users').send();
    const resLength = response.body.length;
    const index = between(0, resLength - 1);
    const randomObj = response.body[index];
    const id = randomObj.id;

    const resCheck = await request(address).get(`/api/users/${id}`).send();

    expect(resCheck.body).toStrictEqual(randomObj);
  });
});

describe('Check status codes', () => {
  test('Test add user status code', async () => {
    const response = await request(address)
      .post('/api/users')
      .send({
        username: 'petro',
        age: 234,
        hobbies: ['hello'],
      });
    expect(response.status).toBe(201);
  });

  test('Test add user if does not require field', async () => {
    const response = await request(address)
      .post('/api/users')
      .send({
        username: 'petro',
        hobbies: ['hello'],
      });
    expect(response.status).toBe(400);
  });

  test('Test get user status code', async () => {
    const response = await request(address).get('/api/users').send();
    expect(response.status).toBe(200);
  });
  test('Test get user 404 status code', async () => {
    const response = await request(address).get('/api/usersddd').send();
    expect(response.status).toBe(404);
  });
  test('Test get user 400 status code', async () => {
    const response = await request(address).get('/api/users/ddd3sdaasd').send();
    expect(response.status).toBe(400);
  });
});
describe('Check delete objects', () => {
  test('Delete object', async () => {
    await request(address)
      .post('/api/users')
      .send({
        username: 'petro',
        age: 234,
        hobbies: ['hello'],
      });

    const response = await request(address).get('/api/users').send();
    const objCount = response.body.length;

    if (objCount > 0) {
      const id = response.body[0].id;
      const del = await request(address).delete(`/api/users/${id}`).send();
      const remResponse = await request(address).get(`/api/users`).send();
      expect(del.statusCode).toBe(204);
      expect(remResponse.body.length).toBe(objCount - 1);
    } else {
      return;
    }
  });
});
