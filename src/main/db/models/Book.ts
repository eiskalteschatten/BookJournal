import { Sequelize, Model, Op, DataTypes } from 'sequelize';

import sequelize from '../';

export class Book extends Model {
  id!: number;
  title: string;
  author: string;
  editor: string;
  genre: string;
  dateStarted: string;
  dateRead: Date;
  status: string;
  onWishlist: boolean;
  pageCount: number;
  color: string;
  bookcover: string;
  publisher: string;
  isbn: string;
  yearPublished: number;
  bookFormat: string;
  nationality: number;
  languageReadIn: string;
  originalLanguage: string;
  translator: string;
  tags: string;
  categories: string;
  rating: number;
  summary: string;
  commentary: string;
  notes: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  async getAllSorted(sortBy = 'title', sortOrder = 'ASC'): Promise<void> {
    return await Book.findAll({
      order: [
        [
          Sequelize.fn('lower', Sequelize.col(sortBy)),
          sortOrder
        ]
      ]
    });
  }

  async getSortesequelizeyQuery(query: any, sortBy = 'title', sortOrder = 'ASC'): Promise<void> {
    query.order = [
      [
        Sequelize.fn('lower', Sequelize.col(sortBy)),
        sortOrder
      ]
    ];

    return await Book.findAll(query);
  }

  async getByYear(year: number): Promise<void> {
    return await sequelize.query(`SELECT * FROM books where strftime('%Y', dateRead) IN('${year}');`);
  }

  async getByMonthYear(monthDigit: number, year: number): Promise<void> {
    let month = monthDigit.toString();

    if (monthDigit < 10) {
      month = `0${month}`;
    }

    return await sequelize.query(`SELECT * FROM books where strftime('%Y-%m', dateRead) IN('${year}-${month}');`);
  }

  async getHasBeenRead(title: string, authors: string[], isbns: string[]): Promise<string> {
    return await Book.findOne({
      where: {
        [Op.or]: [
          {
            title: { [Op.like]: `%${title}%` },
            author: { [Op.like]: `%${authors}%` },
            status: 'read',
            dateRead: {
              [Op.ne]: null,
              [Op.notLike]: 'Invalid%'
            }
          },
          {
            isbn: isbns,
            status: 'read',
            dateRead: {
              [Op.ne]: null,
              [Op.notLike]: 'Invalid%'
            }
          }
        ]
      }
    });
  }
}

Book.init({
  title: DataTypes.STRING,
  author: {
    type: DataTypes.STRING,
    allowNull: true
  },
  editor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateStarted: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  dateRead: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM,
    values: ['notReadYet', 'currentlyReading', 'read', 'stoppedReading', 'takingABreak'],
    defaultValue: 'notReadYet'
  },
  onWishlist: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pageCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bookcover: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  yearPublished: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bookFormat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true
  },
  languageReadIn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  originalLanguage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  translator: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categories: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  commentary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'book'
});

Book.sync();

export default Book;
