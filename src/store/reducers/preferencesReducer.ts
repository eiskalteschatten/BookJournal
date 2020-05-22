import { Reducer } from 'redux';
import { PreferencesActions } from '../actions/preferencesActions';

export interface PreferencesState {
  theme: string;
}

export const initialState: PreferencesState = {
  theme: ''
};

const navReducer: Reducer<PreferencesState, PreferencesActions> = (
  state: PreferencesState = initialState,
  action: PreferencesActions
): any => {
  switch (action.type) {
    case 'PREFERENCES_THEME':
      return {
        ...state,
        theme: action.theme
      };
    default:
      return state;
  }
};

export default navReducer;
