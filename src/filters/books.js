'use strict';

const BookList = require('../elements/list/books');


module.exports = async (type, categoryId = '') => {
    let query;

    switch(type) {
        case 'all-books':
            break;
        case 'future-reading':
            query = {
                where: { notReadYet: true }
            };
            break;
        case 'category':
            query = {
                where: {
                    $or: [
                        { categories: categoryId },
                        { categories: { $like: `%${categoryId},%` } },
                        { categories: { $like: `%,${categoryId}%` } }
                    ]
                }
            };
            break;
        default:
            break;
    }

    const bookList = new BookList(query);
    await bookList.loadBooks();
    return await bookList.render();
};
