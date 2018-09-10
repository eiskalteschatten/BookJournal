'use strict';

const BookList = require('../elements/list/books');


module.exports = async (type, term = '') => {
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
                        { categories: term },
                        { categories: { $like: `%${term},%` } },
                        { categories: { $like: `%,${term}%` } }
                    ]
                }
            };
            break;
        case 'search':
            query = {
                where: {
                    $or: [
                        { title: { $like: `%${term}%` } },
                        { author: { $like: `%${term}%` } },
                        { genre: { $like: `%${term}%` } },
                        { pageCount: { $like: `%${term}%` } },
                        { publisher: { $like: `%${term}%` } },
                        { isbn: { $like: `%${term}%` } },
                        { yearPublished: { $like: `%${term}%` } },
                        { nationality: { $like: `%${term}%` } },
                        { languageReadIn: { $like: `%${term}%` } },
                        { originalLanguage: { $like: `%${term}%` } },
                        { translator: { $like: `%${term}%` } },
                        { tags: { $like: `%${term}%` } },
                        { categories: { $like: `%${term}%` } },
                        { summary: { $like: `%${term}%` } },
                        { commentary: { $like: `%${term}%` } }
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
