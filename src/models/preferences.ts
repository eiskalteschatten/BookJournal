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

export interface PreferencesAttributes {
  id?: number;
  windowWidth?: number;
  windowHeight?: number;
  windowX?: number;
  windowY?: number;
  windowIsMaximized?: boolean;
  windowIsFullScreen?: boolean;
  sidebarWidth?: number;
  middleColumnWidth?: number;
  theme?: string;
  fetchBookInfoFromGoogle?: boolean;
  checkForUpdates?: boolean;
  fetchBooksByAuthor?: boolean;
  fetchBooksByAuthorLanguage?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

@Table({
  modelName: 'preferences',
})
export default class Preferences extends Model implements PreferencesAttributes {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @Default(1200)
  @Column({
    type: DataType.INTEGER,
  })
  windowWidth: number;

  @Default(800)
  @Column({
    type: DataType.INTEGER,
  })
  windowHeight: number;

  @Column({
    type: DataType.INTEGER,
  })
  windowX: number;

  @Column({
    type: DataType.INTEGER,
  })
  windowY: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  windowIsMaximized: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  windowIsFullScreen: boolean;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  sidebarWidth?: number;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  middleColumnWidth?: number;

  @Default('light')
  @Column({
    type: DataType.STRING,
  })
  theme: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  fetchBookInfoFromGoogle: boolean;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  checkForUpdates: boolean;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  fetchBooksByAuthor: boolean;

  @Default('en')
  @Column({
    type: DataType.STRING,
  })
  fetchBooksByAuthorLanguage: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
