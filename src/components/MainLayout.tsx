import React from 'react';
import { createUseStyles } from 'react-jss';

import Theme from '../theme/interface';

const useStyles = createUseStyles<Theme>((theme: Theme): any => ({
  background: {
    background: theme.mainBg,
    color: theme.mainFontColor,
    fontSize: 15,
    overflow: 'hidden',
    height: '100%',
    width: '100%'
  }
}));

const MainLayout: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      test
    </div>
  );
};

export default MainLayout;
