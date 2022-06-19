import http from 'http';
import { CODES } from './codes';
import { getUsers, getUser, createUser, updateUser, removeUser } from './controller/usersController';
import * as dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.statusCode} ${req.url}`);
  try {
    if (req.method === 'GET' && req.url === '/api/users') {
      getUsers(req, res);
    } else if (req.method === 'GET' && req.url?.match(/\/api\/users\/ ?(.*)/)) {
      const id = req.url?.split('/')[3];
      getUser(req, res, id);
    } else if (req.method === 'PUT' && req.url?.match(/\/api\/users\/ ?(.*)/)) {
      const id = req.url?.split('/')[3];
      updateUser(req, res, id);
    } else if (req.method === 'DELETE' && req.url?.match(/\/api\/users\/?(.*)/)) {
      const id = req.url?.split('/')[3];
      removeUser(req, res, id);
    } else if (req.method === 'POST' && req.url === '/api/users') {
      createUser(req, res);
    } else {
      res.writeHead(CODES.NOT_FOUND, { 'Content-Type': 'application/JSON' });
      res.end(JSON.stringify({ message: 'Route not Found' }));
    }
  } catch {
    res.writeHead(CODES.INTERNET_SERVER_ERROR, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify({ message: 'Ups! something was wrong on server...' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server starts on http://localhost:${PORT}`);
});
