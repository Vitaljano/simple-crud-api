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
    const index = between(0, resLength);
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
// test('Testing GET 200 response status code', () => {
//   http.get('http://localhost:5080/api/users', (res) => {
//     const statusCode = res.statusCode;
//     expect(statusCode).toBe(200);
//   });
// });

// test('Testing GET 400 response status code', () => {
//   http.get('http://localhost:5080/api/users/dsad', (res) => {
//     const statusCode = res.statusCode;
//     expect(statusCode).toBe(400);
//   });
// });

// test('Testing  GET 404 response status code', () => {
//   http.get('http://localhost:5080/api/users/9cfbd9a5-3057-4b4e-8957-7b92752caae5', (res) => {
//     const statusCode = res.statusCode;
//     expect(statusCode).toBe(404);
//   });
// });

// test('Test POST 201 response status code', (done) => {
//   const data = JSON.stringify({
//     username: 'Vitalij',
//     age: 23,
//     hobbies: ['sport', 'music'],
//   });

//   const options = {
//     hostname: 'localhost',
//     port: 5080,
//     path: '/api/users',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(data),
//     },
//   };
//   const req = http
//     .request(options, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });
//       res.on('end', (res) => {
//         done();
//       });

//       expect(res.statusCode).toBe(201);
//     })
//     .on('error', (err) => {
//       console.log('Error: ', err.message);
//     });
//   req.write(data);
//   req.end(() => {});
// });

// test('Test POST 400 response status code', (done) => {
//   const data = JSON.stringify({
//     username: 'Vitalij',
//     age: 23,
//   });

//   const options = {
//     hostname: 'localhost',
//     port: 5080,
//     path: '/api/users',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(data),
//     },
//   };
//   const req = http
//     .request(options, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });
//       res.on('end', (res) => {
//         done();
//       });

//       expect(res.statusCode).toBe(400);
//     })
//     .on('error', (err) => {
//       console.log('Error: ', err.message);
//     });
//   req.write(data);
//   req.end(() => {});
// });

// test('Test PUT 400 response status code', (done) => {
//   const data = JSON.stringify({
//     username: 'Vitalij',
//     age: 23,
//     hobbies: ['music'],
//   });

//   const options = {
//     hostname: 'localhost',
//     port: 5080,
//     path: '/api/users/dddddsa',
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(data),
//     },
//   };
//   const req = http
//     .request(options, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });
//       res.on('end', (res) => {
//         done();
//       });

//       expect(res.statusCode).toBe(400);
//     })
//     .on('error', (err) => {
//       console.log('Error: ', err.message);
//     });
//   req.write(data);
//   req.end(() => {});
// });

// test('Test PUT 404 response status code', (done) => {
//   const data = JSON.stringify({
//     username: 'Vitalij',
//     age: 23,
//     hobbies: ['music'],
//   });

//   const options = {
//     hostname: 'localhost',
//     port: 5080,
//     path: '/api/users/9cfbd9a5-3057-4b4e-8957-7b92752caae5',
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(data),
//     },
//   };
//   const req = http
//     .request(options, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });
//       res.on('end', (res) => {
//         done();
//       });

//       expect(res.statusCode).toBe(404);
//     })
//     .on('error', (err) => {
//       console.log('Error: ', err.message);
//     });
//   req.write(data);
//   req.end(() => {});
// });

// test('Create test', (done) => {
//   const data = JSON.stringify({
//     username: 'John',
//     age: 18,
//     hobbies: ['music', 'football'],
//   });

//   const options = {
//     hostname: 'localhost',
//     port: 5080,
//     path: '/api/users',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(data),
//     },
//   };
//   const req = http
//     .request(options, (res) => {
//       let responseData = '';

//       res.on('data', (chunk) => {
//         responseData += chunk.toString();
//       });
//       res.on('end', (res) => {
//         console.log(res.getHeaders());

//         done();
//         console.log(responseData);
//       });

//       expect(responseData).toEqual({
//         username: 'John',
//         age: 18,
//         hobbies: ['music', 'football'],
//       });
//     })
//     .on('error', (err) => {
//       console.log('Error: ', err.message);
//     });
//   req.write(data);
//   req.end(() => {});
// });
