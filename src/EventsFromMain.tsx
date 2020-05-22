import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IpcRendererEvent } from 'electron';

import { preferencesSetAll } from './store/actions/preferencesActions';
import Preferences from './main/db/models/Preferences';

const { ipcRenderer } = window.require('electron');

const EventsFromMain: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.on('preferencesSetAll', (event: IpcRendererEvent, preferences: Preferences): any => dispatch(preferencesSetAll(preferences)));
  }, [dispatch]);

  return null;
};

export default EventsFromMain;
