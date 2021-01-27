import { fn, col } from 'sequelize';
import {
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

export interface CategoryAttributes {
  id?: number;
  name?: string;
  color?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

@Table({
  modelName: 'category',
})
export default class Category extends Model implements CategoryAttributes {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name: string;

  @Column
  color: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  static async getAllSorted(): Promise<Category[]> {
    return await Category.findAll({
      order: [
        [
          fn('lower', col('name')),
          'ASC',
        ],
      ],
    });
  }
}
