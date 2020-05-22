import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IpcRendererEvent } from 'electron';

import { appSetPlatform } from './store/actions/appActions';
import { preferencesSetAll } from './store/actions/preferencesActions';
import Preferences from './main/db/models/Preferences';

const { ipcRenderer } = window.require('electron');

const EventsFromMain: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.on('appSetPlatform', (event: IpcRendererEvent, platform: string): any => dispatch(appSetPlatform(platform)));
    ipcRenderer.on('preferencesSetAll', (event: IpcRendererEvent, preferences: Preferences): any => dispatch(preferencesSetAll(preferences)));
  }, [dispatch]);

  return null;
};

export default EventsFromMain;
