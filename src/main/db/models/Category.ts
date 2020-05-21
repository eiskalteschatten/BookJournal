import { Sequelize, Model, DataTypes } from 'sequelize';

import sequelize from '../';

export class Category extends Model {
  id!: number;
  name: string;
  color: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  async getAllSorted() {
    return await Category.findAll({
      order: [
        [
          Sequelize.fn('lower', Sequelize.col('name')),
          'ASC'
        ]
      ]
    });
  }
}


Category.init({
  name: DataTypes.STRING,
  color: DataTypes.STRING
}, {
  sequelize,
  modelName: 'category'
});

Category.sync();

export default Category;
