import { Op, fn, col, FindOptions } from 'sequelize';

import {
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  Default,
  CreatedAt,
  UpdatedAt,
  DataType,
} from 'sequelize-typescript';

import { sequelize } from '../db';

type Status = 'notReadYet' |'currentlyReading' |'read' |'stoppedReading' |'takingABreak';

export interface BookAttributes {
  id?: number;
  title: string;
  author?: string;
  editor?: string;
  genre?: string;
  dateStarted?: Date;
  dateRead?: Date;
  status?: Status;
  onWishlist?: boolean;
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
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

@Table({
  modelName: 'book',
})
export default class Book extends Model implements BookAttributes {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  author?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  editor?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  genre?: string;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  dateStarted?: Date;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  dateRead?: Date;

  @Default('notReadYet')
  @Column({
    type: DataType.ENUM('notReadYet', 'currentlyReading', 'read', 'stoppedReading', 'takingABreak'),
  })
  status: Status;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  onWishlist: boolean;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  pageCount?: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  color?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  bookcover?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  publisher?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  isbn?: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  yearPublished?: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  bookFormat?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  nationality?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  languageReadIn?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  originalLanguage?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  translator?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  tags?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  categories?: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  rating?: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  summary?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  commentary?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  notes?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  subtitleField?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

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

  static async getHasBeenRead(title: string, authors: string[], isbns: string[]): Promise<Book> {
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
