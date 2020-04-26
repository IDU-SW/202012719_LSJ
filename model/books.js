const fs = require('fs');


class book {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data)
    }

    // Promise 예제
    getbookList() {
        if (this.data) {
            return this.data;
        }
        else {
            return [];
        }
    }

    addbook(title, director, year, type) {
        return new Promise((resolve, reject) => {
            let last = this.data[this.data.length - 1];
            let id = last.id + 1;

            let newbook = {id:id, title:title, director:director, year:year, type:type};
            this.data.push(newbook);

            resolve(newbook);
        });
    }

    // Promise - Reject
    getbookDetail(bookId) {
        return new Promise((resolve, reject) => {
            for (var book of this.data ) {
                if ( book.id == bookId ) {
                    resolve(book);
                    return;
                }
            }
            reject({msg:'Can not find book', code:404});
        });
    }
}

module.exports = new book();