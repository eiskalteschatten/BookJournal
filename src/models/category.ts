import { Model, DataTypes, fn, col } from 'sequelize';

import { sequelize } from '../db';

export class Category extends Model {
  id!: number;
  name: string;
  color: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

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

Category.init({
  name: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'category',
});

Category.sync();

export default Category;
