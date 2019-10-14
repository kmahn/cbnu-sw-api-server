const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const { join } = require('path');
const router = require('./routes');
const { uploads } = require('./config');

require('dotenv').config();
require('./passport')(passport);

const PORT = +(process.env.PORT || 4000);
const app = express();

app.enable('trust proxy');
app.use('/uploads', express.static(uploads));
app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize(undefined));
app.use(router);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
