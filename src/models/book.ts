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
  @Column
  id!: number;

  @Column
  title: string;

  @Column({
    allowNull: true,
  })
  author?: string;

  @Column({
    allowNull: true,
  })
  editor?: string;

  @Column({
    allowNull: true,
  })
  genre?: string;

  @Column({
    allowNull: true,
  })
  dateStarted?: Date;

  @Column({
    allowNull: true,
  })
  dateRead?: Date;

  @Column({
    type: DataType.ENUM('notReadYet', 'currentlyReading', 'read', 'stoppedReading', 'takingABreak'),
  })
  @Default('notReadYet')
  status: Status;

  @Column
  @Default(false)
  onWishlist: boolean;

  @Column({
    allowNull: true,
  })
  pageCount?: number;

  @Column({
    allowNull: true,
  })
  color?: string;

  @Column({
    allowNull: true,
  })
  bookcover?: string;

  @Column({
    allowNull: true,
  })
  publisher?: string;

  @Column({
    allowNull: true,
  })
  isbn?: string;

  @Column({
    allowNull: true,
  })
  yearPublished?: number;

  @Column({
    allowNull: true,
  })
  bookFormat?: string;

  @Column({
    allowNull: true,
  })
  nationality?: string;

  @Column({
    allowNull: true,
  })
  languageReadIn?: string;

  @Column({
    allowNull: true,
  })
  originalLanguage?: string;

  @Column({
    allowNull: true,
  })
  translator?: string;

  @Column({
    allowNull: true,
  })
  tags?: string;

  @Column({
    allowNull: true,
  })
  categories?: string;

  @Column({
    allowNull: true,
  })
  rating?: number;

  @Column({
    allowNull: true,
  })
  summary?: string;

  @Column({
    allowNull: true,
  })
  commentary?: string;

  @Column({
    allowNull: true,
  })
  notes?: string;

  @Column({
    allowNull: true,
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
