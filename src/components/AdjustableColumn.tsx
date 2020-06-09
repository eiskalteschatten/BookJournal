import React, { useState, useRef } from 'react';
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
  const [columnWidth, setColumWidth] = useState<number | null>(null);

  let timer: NodeJS.Timeout;

  const handleDrag = (e: any): void => {
    if (columnEl && columnEl.current) {
      clearTimeout(timer);

      // TypeScript still complains about columnEl potentially being null even with the if-statement
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const newWidth = e.pageX - columnEl.current.offsetLeft;
      setColumWidth(newWidth);

      timer = setTimeout(() => {
        ipcRenderer.send('savePreferences', {
          [dbColumn]: newWidth
        });
      }, 100);
    }
  };

  const handleStopDrag = (): void => {
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
          width: columnWidth || width
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
