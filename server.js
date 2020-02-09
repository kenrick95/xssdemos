const Express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const express = new Express();

const router = express.Router();

const KvDb = (pathToFile, initialData) => {
  if (!fs.existsSync(pathToFile)) {
    fs.writeFileSync(pathToFile, JSON.stringify(initialData), 'utf8');
  }

  return {
    get: async (key) => {
      const content = await readFile(pathToFile, 'utf8');
      const parsed = JSON.parse(content);
      return parsed[key];
    },
    set: async (key, value) => {
      const content = await readFile(pathToFile, 'utf8');
      const parsed = JSON.parse(content);
      parsed[key] = value;
      await writeFile(pathToFile, JSON.stringify(parsed), 'utf8');
      return value;
    }
  };
};

router.get('/01-cms', (req, res) => {
  res.send();
});

router.static('/02-ref');

router.static('/03-ref');


router.get('/logger', (req, res) => {
  console.log(req.text());
  res.sendStatus(200)
})
router.get('/font-logger', (req, res) => {
  console.log(req.text());
  res.sendStatus(404)
})

