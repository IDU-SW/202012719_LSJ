const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const book_router = require('./router/book_router');
app.use(book_router);

app.use(express.static("book_img"));

module.exports = app;
