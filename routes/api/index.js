const { Router } = require('express');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const router = Router();

readdirSync(__dirname)
  .filter(file => statSync(join(__dirname, file)).isDirectory())
  .forEach(file => router.use(`/${file}`, require(join(__dirname, file))));

module.exports = router;
