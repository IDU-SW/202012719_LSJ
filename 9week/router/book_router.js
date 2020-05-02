const express = require('express');
const router = express.Router();

const books = require('../model/books');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./book_img')
    },
    filetitle: function (req, file, cb) {
      cb(null, file.originaltitle)
    }
  });

const upload = multer({ storage : storage });

router.get('/Book', showBookList);

router.get('/BookAdd', showAddForm);
router.post('/Book', upload.single('book_img'), addBook);

router.get('/Book/:bookId', showBookDetail);

router.get('/Book/update/:bookId', showUpdateForm);
router.post('/Book/update/:bookId', upload.single('book_img'), updateBook);

router.post('/Book/delete/:bookId', deleteBook);

module.exports = router;

// 리스트
async function showBookList(req, res) {
    try {
        const bookList = await books.getBookList();
        const result = { data:bookList, count:bookList.length };
        res.render('BookList', { data:bookList });
    } catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

//추가 폼
function showAddForm(req, res) {
    res.render('AddBook');
}

// 추가
async function addBook(req, res) {
    const title = req.body.title;
    const director = req.body.director;
    const year = req.body.year;
    const type = req.body.type;

    if (!title || !director || !year || !type) {
        res.status(400).send({error:'모든 정보를 다 입력하세요.'});
        return;
    }

    const image = req.file;
    if(!image) {
        res.status(400).send({error:'이미지가 없습니다.'});
        return;
    }
    const book_img = image.originaltitle;

    try {
        const result = await books.addBook(title, director, year, type, book_img);
        showBookList(req, res);
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// 상세보기
async function showBookDetail(req, res) {
    try {
        const bookId = req.params.bookId;
        const info = await books.getBookDetail(bookId);
        res.render('BookDetail', { data:info.dataValues, image:info.BookImage.dataValues });
    } catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 수정 폼
async function showUpdateForm(req, res) {
    try {
        const bookId = req.params.bookId;
        const info = await books.getBookDetail(bookId);
        res.render('UpdateBook', { data:info.dataValues, image:info.BookImage.dataValues });
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 수정
async function updateBook(req, res) {
    
    const id = req.params.bookId;
    const title = req.body.title;
    const director = req.body.director;
    const year = req.body.year;
    const type = req.body.type;

    if (!title || !director || !year || !type) {
        res.status(400).send({error:'모든 정보를 다 입력하세요.'});
        return;
    }

    const image = req.file;
    const book_img = !image ? null : image.originaltitle;

    try {
        const result = await books.updateBook(id, title, director, year, type, book_img);
        res.render('BookUpdateComplete', { data:result.dataValues, image:result.BookImage.dataValues });
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// 삭제
async function deleteBook(req, res) {
    try {
        const id = req.params.bookId;
        const result = await books.deleteBook(id);
        res.render('BookDeleteComplete', {data:result})
    }
    catch(error) {
        res.status(500).send(error.msg);
    }
}