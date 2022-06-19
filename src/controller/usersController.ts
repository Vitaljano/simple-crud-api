import * as Users from '../models/usersModel';
import { CODES } from '../codes';
import http from 'http';
import { validate as uuidValidate, validate } from 'uuid';

export async function getUsers(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const users = await Users.findAll();

    res.writeHead(CODES.SUCCESS, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify(users));
  } catch (err) {
    console.log(err);
    res.writeHead(CODES.INTERNET_SERVER_ERROR, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify({ message: 'Ups! something was wrong on server...' }));
  }
}

export async function getUser(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
  try {
    const isValid = uuidValidate(id);
    if (!isValid) {
      res.writeHead(CODES.BAD_REQUEST, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify({ message: 'User Id is invalid' }));
    }

    const user = await Users.findById(id);

    if (!user) {
      res.writeHead(CODES.NOT_FOUND, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify({ message: 'User Not Found' }));
    } else {
      res.writeHead(CODES.SUCCESS, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify(user));
    }
  } catch (err) {
    console.log(err);
    res.writeHead(CODES.INTERNET_SERVER_ERROR, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify({ message: 'Ups! something was wrong on server...' }));
  }
}

export async function createUser(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const { username, age, hobbies } = JSON.parse(body);
      if (!username || !age || !hobbies) {
        res.writeHead(CODES.BAD_REQUEST, { 'Content-Type': 'application/JSON' });
        res.end(JSON.stringify({ message: 'body does not contain required fields' }));
      } else {
        const usersResponse = await Users.create(username, age, hobbies);
        res.writeHead(CODES.CREATED, { 'Content-Type': 'application/JSON' });
        res.end(JSON.stringify(usersResponse));
      }
    });
  } catch (err) {
    console.log(err);
    res.writeHead(CODES.INTERNET_SERVER_ERROR, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify({ message: 'Ups! something was wrong on server...' }));
  }
}

export async function updateUser(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
  try {
    const isValid = uuidValidate(id);
    if (!isValid) {
      res.writeHead(CODES.BAD_REQUEST, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify({ message: 'User Id is invalid' }));
    }
    const user = await Users.findById(id);
    if (!user) {
      res.writeHead(CODES.NOT_FOUND, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify({ message: 'User Not Found' }));
    } else {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const { username, age, hobbies } = JSON.parse(body);
        const udpResponse = await Users.update(id, username, age, hobbies);
        res.writeHead(CODES.SUCCESS, { 'Content-Type': 'application/JSON' });
        res.end(JSON.stringify(udpResponse));
      });
    }
  } catch (err) {
    console.log(err);
    res.writeHead(CODES.INTERNET_SERVER_ERROR, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify({ message: 'Ups! something was wrong on server...' }));
  }
}

export async function removeUser(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
  try {
    const isValid = validate(id);
    if (!isValid) {
      res.writeHead(CODES.BAD_REQUEST, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify({ message: 'User Id is invalid' }));
    }
    const user = await Users.findById(id);

    if (!user) {
      res.writeHead(CODES.NOT_FOUND, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify({ message: 'User Not Found' }));
    } else {
      const remResponse = await Users.remove(id);
      res.writeHead(CODES.NO_CONTENT, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify(remResponse));
    }
  } catch (err) {
    console.log(err);
    res.writeHead(CODES.INTERNET_SERVER_ERROR, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify({ message: 'Ups! something was wrong on server...' }));
  }
}
