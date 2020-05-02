const pool = require('./dbConnection');

class BooksModel {}

BooksModel.getbookList = async () => {
    const sql = 'SELECT * FROM books';

    let conn;
    try {
        conn = await pool.getConnection();
        const [rows, metadata] = await conn.query(sql);
        conn.release();
        console.log("TESTLOG");
        console.log(rows);
        
        return rows;
    } catch (error) {
        console.error(error);
    } finally {
        if ( conn ) conn.release();
    }
}    

BooksModel.addbook = async (title, director, year, type) => {
    const sql = 'INSERT INTO books SET ?';
    const data= {title, director, year, type};

    let conn;
    try {
        conn = await pool.getConnection();
        const ret = await conn.query(sql, data);
        console.log(ret);
        const bookId = ret[0]['insertId'];
        return bookId;
    } catch (error) {
        console.error(error);
    } finally {
        if ( conn ) conn.release();
    }
}

BooksModel.getbookDetail = async (bookId) => {
    const sql = 'SELECT * FROM books WHERE id = ?';
    let conn;
    try {        
        conn = await pool.getConnection();
        const [rows, metadata] = await conn.query(sql, bookId);
        conn.release();
        return rows[0];
    } catch (error) {
        console.error(error);
    } finally {
        if ( conn ) conn.release();
    }
}

BooksModel.editbook = async(id, title, director, year, type) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = 'UPDATE Books SET title = ?, director = ?, year = ?, type = ? WHERE id = ?';
        await conn.query(sql, [title, director, year, type, id]);
        return this.getbookDetail(id);
    } catch (error){
        console.error(error);
    } finally {
        if(conn){
            conn.release();
        }
    }
}

// BooksModel.updatebook = async (id, title, director, year, type) => {
//     const sql = 'UPDATE books SET ? WHERE id = ?';
//     const data = {id, title, director, year, type};
//     const condition = id;

//     let conn;
//     try {
//         conn = await pool.getConnection();
//         const ret = await conn.query(sql, [data, condition] );
//         const info = ret[0];
//         return data;
//     } catch (error) {
//         console.error(error);  
//     } finally {
//         if ( conn ) conn.release();
//     }
// }

BooksModel.deletebook = async (id) => {
    const sql = 'DELETE FROM books WHERE id = ?';
    let conn;
    try {
        conn = await pool.getConnection();        
        const ret = await conn.query(sql, parseInt(id));
        return ret[0]['affectedRows'];
    } catch (error) {
        console.error(error);  
    } finally {
        if ( conn ) conn.release();
    }
}

BooksModel.initModel = async () => {
    const sql = 'drop table if exists books; create table books ( id int primary key auto_increment, title varchar(20), director varchar(50), year INT, type varchar(40));';
    await pool.query(sql);
}

module.exports = BooksModel;