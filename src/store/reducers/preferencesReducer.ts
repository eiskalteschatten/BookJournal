import { Reducer } from 'redux';

import { PreferencesActions } from '../actions/preferencesActions';
import { Preferences } from '../../main/db/models/Preferences';

export interface PreferencesState {
  all: Preferences | {};
}

export const initialState: PreferencesState = {
  all: {}
};

const navReducer: Reducer<PreferencesState, PreferencesActions> = (
  state: PreferencesState = initialState,
  action: PreferencesActions
): any => {
  switch (action.type) {
    case 'PREFERENCES_ALL':
      return {
        ...state,
        all: action.all
      };
    default:
      return state;
  }
};

export default navReducer;
