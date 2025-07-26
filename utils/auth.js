import bcrypt from 'bcryptjs';
import fs from 'browserify-fs';

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function getUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

export function saveUsers(users) {
  return new Promise((resolve, reject) => {
    fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', err => {
      if (err) reject(err);
      else resolve();
    });
  });
}
