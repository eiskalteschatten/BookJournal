import { AnyAction, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';

import preferences, { PreferencesState } from './reducers/preferencesReducer';

const devExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;  // eslint-disable-line no-undef

const composeEnhancers = devExtension && process.env.NODE_ENV === 'development' ? devExtension : compose;

const reducer = combineReducers({
  preferences
});

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunk),
  )
);

export interface State {
  preferences: PreferencesState;
}

// Shortcuts
export const dispatch: ThunkDispatch<any, any, AnyAction> = store.dispatch.bind(store);
export const getState = store.getState.bind(store);

export default store;
