const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) =>{
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    
    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt, 
    }

    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        })
        response.code(201);
        return response;
    };
}

const getAllBooksHandler = (request, h) =>{
    const { name, reading, finished } = request.query;

    if(name !== undefined){
        const cekName = books.filter((book) => book.name.toLowerCase() === name.toLowerCase());
        const response = h.response({
            status: 'success',
            data: {
                books: cekName.map((book) =>({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    }
    //  || Gagal terus
    //  V 
    // else if(name === 'Dicoding'){
    //     const optionalCek = books.filter((book) => book.name === name);
    //     const response = h.response({
    //         status: 'success',
    //         data: {
    //             books: optionalCek.map((book) =>({
    //                 id: book.id[`$id`],
    //                 name: book.name,
    //                 publisher: book.publisher,
    //             }))
    //         }
    //     })
    //     response.code(200);
    //     return response;
    // }
    else if(reading !== undefined){
        const cekRead = books.filter((book) => book.reading === Boolean(+reading));
        const response = h.response({
            status: 'success',
            data: {
                books: cekRead.map((book) =>({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    }
    else if(finished !== undefined){
        const cekStatus = books.filter((book) => book.finished === Boolean(+finished));
        const response = h.response({
            status: 'success',
            data: {
                books: cekStatus.map((book) =>({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    }
    else{
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) =>({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    }
};

const getBooksByIdHandler = (request, h) =>{
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if(book !== undefined){
        const response = h.response({
            status: 'success',
            data: {
                book,
            }
        })
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    })
    response.code(404);
    return response;
}

const updateBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }
    else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }
    else if(index !== -1){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })
        response.code(200);
        return response;
    }
    else{
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        response.code(404);
        return response;
    }
}

const deleteBooksByIdHandler = (request, h) =>{
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        })
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    response.code(404);
    return response;
}

module.exports = { addBooksHandler, getAllBooksHandler, getBooksByIdHandler, updateBooksByIdHandler, deleteBooksByIdHandler };