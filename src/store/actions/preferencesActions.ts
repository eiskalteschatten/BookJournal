import {  Action } from 'redux';

import { Preferences } from '../../main/db/models/Preferences';

export interface PreferencesSetAll extends Action<'PREFERENCES_ALL'> {
  all: Preferences;
}

export type PreferencesActions = PreferencesSetAll;

export const preferencesSetAll = (all: Preferences): PreferencesSetAll => ({ type: 'PREFERENCES_ALL', all });
