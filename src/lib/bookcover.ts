import path from 'path';

import config from '../config';

export const pruneCoverPath = (bookcoverPath: string): string => {
  bookcoverPath = 'file:///' + path.join(config.bookcovers.path, bookcoverPath);
  return bookcoverPath.replace(/\\/g, '/');
};
