const express = require('express');
const router = express.Router();
//const books = require('../model/books');
const books = require('../model/booksDb');

// router.get('/books', showbookList);
// router.get('/books/:bookId', showbookDetail);
router.post('/books', addbook);
router.get('/add', addbookForm);
router.post('/books/delete', deletebook);
router.get('/books/detail/:bookId', editbookForm);
router.post('/books/edit', editbook);


module.exports = router;

function addbookForm(req, res) {
    res.render('booksAdd');
}

router.get('/books', async (req, res) => {
    const bookList = await books.getbookList();
    res.render('books', {books:bookList, count:bookList.length})
});


router.get('/books/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;
        console.log('bookId : ', bookId);
        const info = await books.getbookDetail(bookId);

        res.render('booksDetail', {detail:info});
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
});

// 새 책 추가
async function addbook(req, res) {
    const title = req.body.title;

    if (!title) {
        res.status(400).send({error:'title 누락'});
        return;
    }

    const director = req.body.director;
    const year = parseInt(req.body.year);
    const type = req.body.type;

    try {
        const result = await books.addbook(title, director, year, type);
        res.render('addComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// 책 수정 폼
async function editbookForm(req, res) {
    try {
        const bookId = req.params.bookId;
        console.log('bookId : ', bookId);
        const info = await books.getbookDetail(bookId);

        res.render('booksEdit', {detail:info});
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}



// 책 수정
async function editbook(req, res) {

    const id = req.body.id;
    const title = req.body.title;

    if (!title) {
        res.status(400).send({error:'제목 입력 하세요.'});
        return;
    }
    
    const director = req.body.director;
    const year = req.body.year;
    const type = req.body.type;

    try {
        const result = await books.editbook(id, title, director, year, type);
        res.render('booksEditInfo',{title: title, id: id});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}



// 책 제거
async function deletebook(req, res) {
    try {
        const id = req.body.id;
        console.log('delete bookId : ', id);
        const result = await books.deletebook(id);
        res.render('booksDel');
        
    }
    catch ( error ) {
        res.status(400).send({error:'정보 삭제 Fail'});
    }
}
