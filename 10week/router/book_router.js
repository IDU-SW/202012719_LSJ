const express = require('express');
const router = express.Router();
const books = require('../model/bookModel');


router.get('/books', async (req, res) => {
    const data = await books.getBookList();

    res.render('book', {books:data, count:data.length});
});

router.get('/book/add', addBookForm);
router.get('/books/:bookId', showBookDetail);
router.post('/books', addBook);
router.delete('/books/:bookId', deleteBook);
router.post('/books/delete', deleteBook);
router.get('/book/detail/:bookId', updateBookform);
router.post('/books/edit', updateBook);
module.exports = router;



async function showBookDetail(req, res) {
    try {
        
        const bookId = req.params.bookId;
        console.log('bookId : ', bookId);
        const info = await books.getBookDetail(bookId);

        res.render('bookDel', {detail:info});
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

async function addBook(req, res) {
    const book = req.body.book;

    if (!book) {
        res.status(400).send({error:'누락'});
        return;
    }

    const kind = req.body.kind;
    const explanation = req.body.explanation;
    

    try {
        const result = await books.addBook(book, kind, explanation);
        res.render('addComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
function addBookForm(req, res) {
    res.render('bookAdd');
}


async function updateBookform(req, res) {
    try {
       
        const bookId = req.params.bookId;
        console.log('bookId : ', bookId);
        const info = await books.getBookDetail(bookId);

        res.render('bookUpdate', {detail:info});
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

async function updateBook(req, res) {

    const id = req.body.id; // id 가져오기
    const book = req.body.book;

    if (!book) {
        res.status(400).send({error:'book 누락'});
        return;
    }
    const kind = req.body.kind;
    const explanation = req.body.explanation;
  

    try {
        const result = await books.updateBook(id, book, kind, explanation);
        console.log(result);
        res.render('updateComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

async function deleteBook(req, res) {
    try {
        const id = req.body.id; 
        const result = await books.deleteBook(id);
        res.render('delComplete');
    }
    catch ( error ) {
        res.status(400).send({error:'삭제실패'});
    }
}
