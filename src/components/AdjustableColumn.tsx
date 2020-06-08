import React, { useState, useRef, useEffect } from 'react';
import { createUseStyles } from 'react-jss';

import Theme from '../theme/interface';

const { ipcRenderer } = window.require('electron');

const useStyles = createUseStyles<Theme>((): any => ({
  column: {
    flex: '0 0 auto',
    flexDirection: 'column'
  },
  dragbar: {
    cursor: 'col-resize',
    flex: '0 0 auto',
    width: 2
  }
}));

interface Props {
  minWidth: number;
  width: number;
  dbColumn: string;
  children?: any;
}

const AdjustableColumn: React.FC<Props> = ({ minWidth, width, dbColumn, children }) => {
  const classes = useStyles();
  const columnEl = useRef(null);
  const [columnWidth, setColumWidth] = useState<number>(width);

  useEffect(() => {
    setColumWidth(width);
  }, [width]);

  const handleDrag = (e: any): void => {
    if (columnEl && columnEl.current) {
      // TypeScript still complains about columnEl potentially being null even with the if-statement
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const newWidth = e.pageX - columnEl.current.offsetLeft;
      setColumWidth(newWidth);
    }
  };

  const handleStopDrag = (): void => {
    ipcRenderer.send('savePreferences', {
      [dbColumn]: columnWidth
    });

    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', handleStopDrag);
  };

  const handleStartDrag = (): void => {
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleStopDrag);
  };

  return (
    <>
      <div
        className={classes.column}
        style={{
          minWidth,
          width: columnWidth
        }}
        ref={columnEl}
      >
        {children}
      </div>
      <div
        className={classes.dragbar}
        onMouseDown={handleStartDrag}
      />
    </>
  );
};

export default AdjustableColumn;
