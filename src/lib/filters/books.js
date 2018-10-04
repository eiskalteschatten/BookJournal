'use strict';

const BookList = require('../../elements/list/books');

const Category = require('../../models/category');


module.exports = async (type, term = '') => {
    let query;

    switch(type) {
        case 'all-books':
            break;
        case 'not-read-yet':
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
                        { summary: { $like: `%${term}%` } },
                        { commentary: { $like: `%${term}%` } }
                    ]
                }
            };

            const categories = await Category.findAll({
                where: {
                    name: { $like: `%${term}%` }
                }
            });

            for (const category of categories) {
                query.where.$or.push(
                    { categories: category.id },
                    { categories: { $like: `%${category.id},%` } },
                    { categories: { $like: `%,${category.id}%` } }
                );
            }

            break;
        default:
            break;
    }

    const sortBy = localStorage.getItem('sortBy');
    const sortOrder = localStorage.getItem('sortOrder');
    const bookList = new BookList(query);

    await bookList.loadBooks(sortBy, sortOrder);
    return await bookList.render();
};
