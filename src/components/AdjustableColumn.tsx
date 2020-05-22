import React from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles } from 'react-jss';

import Theme from '../theme/interface';
import { State } from '../store';

const useStyles = createUseStyles<Theme>((theme: Theme): any => ({
  column: {

  }
}));

interface Props {
  children?: any;
}

const AdjustableColumn: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const preferences = useSelector((state: State) => state.preferences.all);

  return (
    <div className={classes.column}>
      {children}
    </div>
  );
};

export default AdjustableColumn;
