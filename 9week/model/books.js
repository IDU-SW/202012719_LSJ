const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('example', 'root', 'cometrue', {dialect:'mysql', host:'127.0.0.1'});

class Books extends Sequelize.Model {}
Books.init({
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    director: Sequelize.STRING,
    year: Sequelize.STRING,
    type: Sequelize.STRING,
}, {tableName:'book', sequelize, timestamps: false});


class BookImage extends Sequelize.Model {}
BookImage.init({
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    book_id: Sequelize.INTEGER,
    image: Sequelize.STRING
}, {tableName:'bookImage', sequelize, timestamps: false});


class Book {
    constructor() {
        try {
            this.prepareModel(); 
        } catch (error) {
            console.error(error);    
        }
    }
    
    async prepareModel() {
        try {
            await Books.sync({force:true});
            await BookImage.sync({force:true});

            Books.hasOne(BookImage, {
                foreignKey:'book_id',
                onDelete:'cascade'
            });

            await this.allDataInsert();
        }
        catch (error) {
            console.log('Error', error);
        }
    }

    async allDataInsert() {
        const data = fs.readFileSync('./model/data.json');
        const books = JSON.parse(data);
        for (var book of books ) {
            await this.oneDataInsert(book);
        }
    }

    async oneDataInsert(book) {
        try {
            let bookData = await Books.create({ 
                            title : book.title, 
                            director : book.director, 
                            year : book.year, 
                            type : book.type 
                        }, {logging:false});
            let imageData = await BookImage.create({
                            image : book.book_img
                        }, {logging:false});
            const newData = bookData.dataValues;
            
            await bookData.setBookImage(imageData);

            return newData;
        } catch (error) {
            console.error(error);
        }
    }

    //   목록
    async getBookList() {
        let returnValue;
        await Books.findAll({})
        .then( results => {
            for (var item of results) {

            }
            returnValue = results;
        })
        .catch( error => {
            console.error('Error :', error);
        });
        return returnValue;
    }

    //   추가
    async addBook(title, director, year, type, book_img) {
        const newBook = {title, director, year, type, book_img};
        try {
            const returnValue = await this.oneDataInsert(newBook);
            return returnValue;
        } catch (error) {
            console.error(error);
        }
    }

    //   상세보기
    async getBookDetail(bookId) {
        try {
            const ret = await Books.findAll({
                where:{id:bookId},
                include: [{model:BookImage}]
            });

            if ( ret ) {
                return ret[0];
            }
            else {
                console.log('데이터 없음');
            }
        }
        catch (error) {
            console.log('Error :', error);
        }
    }

    //   수정
    async updateBook(bookId, title, director, year, type, book_img) {
        try {
            let book = await this.getBookDetail(bookId);
            book.dataValues.title = !title ? book.title : title;
            book.dataValues.director = !director ? book.director : director;
            book.dataValues.year = !year ? book.year : year;
            book.dataValues.type = !type ? book.type : type;
            if(book_img)
            {
                const imageData = await BookImage.findByPk(book.BookImage.dataValues.id);
                imageData.image = book_img;
                await imageData.save();

                book.BookImage.dataValues.image = book_img;
            }
            let ret = await book.save();
            return ret;      
        } catch (error) {
            console.error(error);  
        }
    }

    //   삭제
    async deleteBook(bookId) {
        try {
            let result = await Books.destroy({where: {id:bookId}});
        } catch (error) {
            console.error(error);  
        }
    }
}

module.exports = new Book();