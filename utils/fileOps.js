import fs from 'browserify-fs';

export function readJSON(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

export function writeJSON(path, obj) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(obj, null, 2), 'utf8', err => {
      if (err) reject(err);
      else resolve();
    });
  });
}
