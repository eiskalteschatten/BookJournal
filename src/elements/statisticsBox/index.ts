import path from 'path';
import { promises as fsPromises } from 'fs';
import nunjucks from '../../nunjucks';

export default class StatisticsBox {
  // TODO: add interface!
  private statistics;
  private template: string;

  // TODO: add interface!
  constructor(statistics) {
    this.statistics = statistics;
    this.template = path.join(__dirname, '../templates/statisticsBox.njk');
  }

  async render(): Promise<string> {
    try {
      const templateString = await fsPromises.readFile(this.template, 'utf8');
      return nunjucks.renderString(templateString, await this.getNunjucksRenderObject());
    }
    catch (error) {
      console.error(error);
    }
  }

  async getNunjucksRenderObject(): Promise<any> {
    return Promise.resolve({
      statistics: this.statistics,
    });
  }
}
