import { v4 as uuidv4 } from 'uuid';
// import products from '../data/products.json';

type User = { id: string; username: string; age: number; hobbies: string[] };

const users: User[] = [];

export function findAll() {
  return new Promise((resolve, reject) => {
    resolve(users);
  });
}

export function findById(id: string | number) {
  return new Promise((resolve, reject) => {
    const user = users.find((p) => p.id === id);

    resolve(user);
  });
}

export function create(username: string, age: number, hobbies: string[]) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const newUser: User = { id: id, username: username, age: age, hobbies: hobbies };
    users.push(newUser);
    resolve(newUser);
  });
}

export function update(id: number | string, username: string, age: number, hobbies: string[]) {
  return new Promise((resolve, reject) => {
    const index = users.findIndex((p) => p.id === id);
    const pid = users[index].id;
    const pUsername = username || users[index].username;
    const pAge = age || users[index].age;
    const pHobbies = hobbies || users[index].hobbies;

    users[index] = { id: pid, username: pUsername, age: pAge, hobbies: pHobbies };
    resolve(users[index]);
  });
}

export function remove(id: number | string) {
  return new Promise((resolve, reject) => {
    const index = users.findIndex((p) => p.id === id);
    const deletedItem = users.splice(index, 1);
    resolve(deletedItem);
  });
}
