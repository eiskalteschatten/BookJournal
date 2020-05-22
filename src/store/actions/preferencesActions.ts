import { Action } from 'redux';

export interface PreferencesTheme extends Action<'PREFERENCES_THEME'> {
  theme: string;
}

export type PreferencesActions = PreferencesTheme;

export const preferencesSetTheme = (theme: string): PreferencesTheme => ({ type: 'PREFERENCES_THEME', theme });
