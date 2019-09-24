const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const { join } = require('path');
const kebab2Pascal = require('../tools/kebabCase2PascalCase');
require('dotenv').config();

const models = {};

mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, {
  poolSize: 4,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log('mongodb:::connection successful'))
  .catch(console.error);

readdirSync(__dirname)
  .filter(file => /.+\.schema\.js$/.test(file))
  .forEach(file => {
    const modelName = kebab2Pascal(file, '.schema.js');
    models[modelName] = mongoose.model(modelName, require(join(__dirname, file)));
  });

createAdminAccount();

module.exports = models;

async function createAdminAccount() {
  const { User } = models;

  const count = await User.countDocuments();
  if (count === 0) {
    const admin = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME,
      role: 'admin'
    };
    await User.create(admin);
  }
}
