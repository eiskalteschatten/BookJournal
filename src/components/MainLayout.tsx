import React from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Theme from '../theme/interface';
import { State } from '../store';

import Titlebar from './Titlebar';
import AdjustableColumn from './AdjustableColumn';

const useStyles = createUseStyles<Theme>((theme: Theme): any => ({
  background: {
    background: theme.mainBg,
    color: theme.mainFontColor,
    fontSize: 15,
    overflow: 'hidden',
    height: '100%',
    width: '100%'
  },
  isDarwin: {
    paddingTop: 22
  }
}));

const MainLayout: React.FC = () => {
  const classes = useStyles();
  const platform = useSelector((state: State) => state.app.platform);

  return (
    <div
      className={clsx({
        [classes.background]: true,
        [classes.isDarwin]: platform === 'darwin'
      })}
    >
      {platform === 'darwin' && (<Titlebar />)}

      <div className='d-flex'>
        <AdjustableColumn>
          sidebar
        </AdjustableColumn>

        <AdjustableColumn>
          middle
        </AdjustableColumn>

        <div>
          book information
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
