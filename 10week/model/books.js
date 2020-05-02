const fs = require('fs');
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/example';
var ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }
    // connection을 할 때에 database명을 명시해야함
    db = database.db('example');
});



class Book {}

// Read (전체 조회)
Book.getBookList = async () => {
    return await db.collection('book').find({}).toArray();
}

// Read Detail (id값 별 상세 조회)
Book.getBookDetail = async (bookId) => {
    return await db.collection('book').findOne({ _id: new ObjectID(bookId) });
}

// Add
Book.addBook = async (book, kind, explanation) => {
    const data = { book, kind, explanation };
    try {
        const returnValue = await dataOneAdd(data);
        return returnValue;
    } catch (error) {
        console.error(error);
    }
}

// Add 
async function dataOneAdd(book) {
    try {
        let bookData = await db.collection('book').insertOne({
            book: book.book,
            kind: book.kind,
            explanation: book.explanation
        }, { logging: false });
        const newBook = bookData;
        console.log('입력된 데이터 : ', newBook);
        return newBook;
    } catch (error) {
        console.log(error);
    }
}

// Delete
Book.deleteBook = async (bookId) => {
    try {
        let result = await db.collection('book').deleteOne({ _id: new ObjectID(bookId) });
        console.log('삭제한 id : ', _id);
    } catch (error) {
        console.log(error);
    }
}

// Update
Book.updateBook = async (bookId, book, kind, explanation) => {
    try {
        let ret = await db.collection('book').updateOne({_id: new ObjectID(bookId)}, {$set : {book: book, kind: kind, explanation: explanation}});
        console.log('ret 값 : ', ret);
        return ret;
    } catch (error) {
        console.log(error);
    }
}

module.exports = new Book();