import {
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'preferences',
})
export default class Preferences extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  @Default(1200)
  windowWidth: number;

  @Column
  @Default(800)
  windowHeight: number;

  @Column
  windowX: number;

  @Column
  windowY: number;

  @Column
  @Default(false)
  windowIsMaximized: boolean;

  @Column
  @Default(false)
  windowIsFullScreen: boolean;

  @Column({
    allowNull: true,
  })
  sidebarWidth?: number;

  @Column({
    allowNull: true,
  })
  middleColumnWidth?: number;

  @Column
  @Default('light')
  theme: string;

  @Column
  @Default(true)
  fetchBookInfoFromGoogle: boolean;

  @Column
  @Default(true)
  checkForUpdates: boolean;

  @Column
  @Default(true)
  fetchBooksByAuthor: boolean;

  @Column
  @Default('en')
  fetchBooksByAuthorLanguage: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
