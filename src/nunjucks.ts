import path from 'path';
import nunjucks from 'nunjucks';
import allLanguages from 'iso-639-1';

const pathToViews = path.join(__dirname, '/templates');
const fileSystemLoader = new nunjucks.FileSystemLoader(pathToViews);
const nunjucksEnv = new nunjucks.Environment(fileSystemLoader);

nunjucksEnv.addFilter('getLanguageName', (code: string): string =>
  allLanguages.getName(code)
);

nunjucksEnv.addFilter('getLanguageNativeName', (code: string): string =>
  allLanguages.getNativeName(code)
);

export default nunjucksEnv;
