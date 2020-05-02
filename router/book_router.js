const express = require('express');
const router = express.Router();
const books = require('../model/books');

router.get('/books', showbookList);
router.get('/books/:bookId', showbookDetail);
router.post('/books', addbook);
router.get('/add', addbookForm);

module.exports = router;

function addbookForm(req, res) {
    res.render('booksAdd');
}

function showbookList(req, res) {
    const bookList = books.getbookList();
    //const result = { data:bookList, count:bookList.length };
    //res.send(result);
    res.render('books', {books:bookList, count:bookList.length});
}


// Async-await를 이용하기
async function showbookDetail(req, res) {
    try {
        // 상세 정보 Id
        const bookId = req.params.bookId;
        console.log('bookId : ', bookId);
        const info = await books.getbookDetail(bookId);
        res.render('booksDetail', {detail : info});
        res.send(info);
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}


// 새 책 추가
// POST 요청 분석 -> 바디 파서
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
        //res.send({msg:'success', data:result});
        res.render('addComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
