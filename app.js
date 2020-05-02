const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const movieRouter = require('./router/book_router');
app.use(movieRouter);

module.exports = app;

