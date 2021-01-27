import { Op, FindOptions } from 'sequelize';

import BookList from '../../elements/list/books';
import Category from '../../models/category';

export default async (type: string, term = ''): Promise<string> => {
  let query: FindOptions;

  switch (type) {
    case 'all-books':
      break;
    case 'currently-reading':
      query = {
        where: { status: 'currentlyReading' },
      };
      break;
    case 'not-read-yet':
      query = {
        where: { status: 'notReadYet' },
      };
      break;
    case 'books-read':
      query = {
        where: { status: 'read' },
      };
      break;
    case 'wishlist':
      query = {
        where: { onWishlist: true },
      };
      break;
    case 'category':
      query = {
        where: {
          [Op.or]: [
            { categories: term },
            { categories: { [Op.like]: `%${term},%` } },
            { categories: { [Op.like]: `%,${term}%` } },
          ],
        },
      };
      break;
    case 'search':
      query = {
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${term}%` } },
            { author: { [Op.like]: `%${term}%` } },
            { editor: { [Op.like]: `%${term}%` } },
            { genre: { [Op.like]: `%${term}%` } },
            { pageCount: { [Op.like]: `%${term}%` } },
            { publisher: { [Op.like]: `%${term}%` } },
            { isbn: { [Op.like]: `%${term}%` } },
            { yearPublished: { [Op.like]: `%${term}%` } },
            { bookFormat: { [Op.like]: `%${term}%` } },
            { nationality: { [Op.like]: `%${term}%` } },
            { languageReadIn: { [Op.like]: `%${term}%` } },
            { originalLanguage: { [Op.like]: `%${term}%` } },
            { translator: { [Op.like]: `%${term}%` } },
            { tags: { [Op.like]: `%${term}%` } },
            { summary: { [Op.like]: `%${term}%` } },
            { commentary: { [Op.like]: `%${term}%` } },
            { notes: { [Op.like]: `%${term}%` } },
          ],
        },
      };

      const categories = await Category.findAll({
        where: {
          name: { [Op.like]: `%${term}%` },
        },
      });

      for (const category of categories) {
        if (query.where['Op.or']) {
          query.where['Op.or'].push(
            { categories: category.id },
            { categories: { [Op.like]: `%${category.id},%` } },
            { categories: { [Op.like]: `%,${category.id}%` } }
          );
        }
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
