import { Model, DataTypes, Op, fn, col, FindOptions } from 'sequelize';

import { sequelize } from '../db';

export class Book extends Model {
  id!: number;
  title: string;
  author?: string;
  editor?: string;
  genre?: string;
  dateStarted?: Date;
  dateRead?: Date;
  status: 'notReadYet' |'currentlyReading' |'read' |'stoppedReading' |'takingABreak';
  onWishlist: boolean;
  pageCount?: number;
  color?: string;
  bookcover?: string;
  publisher?: string;
  isbn?: string;
  yearPublished?: number;
  bookFormat?: string;
  nationality?: string;
  languageReadIn?: string;
  originalLanguage?: string;
  translator?: string;
  tags?: string;
  categories?: string;
  rating?: number;
  summary?: string;
  commentary?: string;
  notes?: string;
  subtitleField?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  static async getAllSorted(sortBy = 'title', sortOrder = 'ASC'): Promise<Book[]> {
    return await Book.findAll({
      order: [
        [
          fn('lower', col(sortBy)),
          sortOrder,
        ],
      ],
    });
  }

  static async getSortedByQuery(query: FindOptions, sortBy = 'title', sortOrder = 'ASC'): Promise<Book[]> {
    query.order = [
      [
        fn('lower', col(sortBy)),
        sortOrder,
      ],
    ];

    return await Book.findAll(query);
  }

  static async getByYear(year: number): Promise<Book[]> {
    return await sequelize.query(`SELECT * FROM books where strftime('%Y', dateRead) IN('${year}');`, { model: this });
  }

  static async getByMonthYear(month: number, year: number): Promise<Book[]> {
    let monthString = month.toString();

    if (month < 10) {
      monthString = `0${month}`;
    }

    return await sequelize.query(`SELECT * FROM books where strftime('%Y-%m', dateRead) IN('${year}-${monthString}');`, { model: this });
  }

  static async getHasBeenRead(title: string, authors: string, isbns: string): Promise<Book> {
    return await Book.findOne({
      where: {
        [Op.or]: [
          {
            title: { [Op.like]: `%${title}%` },
            author: { [Op.like]: `%${authors}%` },
            status: 'read',
            dateRead: {
              [Op.ne]: null,
              [Op.notLike]: 'Invalid%',
            },
          },
          {
            isbn: isbns,
            status: 'read',
            dateRead: {
              [Op.ne]: null,
              [Op.notLike]: 'Invalid%',
            },
          },
        ],
      },
    });
  }
}

Book.init({
  title: {
    type: DataTypes.STRING,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  editor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateStarted: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  dateRead: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('notReadYet', 'currentlyReading', 'read', 'stoppedReading', 'takingABreak'),
    defaultValue: 'notReadYet',
  },
  onWishlist: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pageCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bookcover: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  yearPublished: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bookFormat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  languageReadIn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  originalLanguage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  translator: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categories: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  commentary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'book',
});

Book.sync();

export default Book;
