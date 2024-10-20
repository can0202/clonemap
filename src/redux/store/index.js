import {useMemo} from 'react';
import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';
import {persistStore} from 'redux-persist';

function initStore(initialState) {
  return createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
}

export const initializeStore = (preloadedState) => {
  let _store = initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState) {
    _store = initStore({
      ...preloadedState,
    });
  }

  let persistor = persistStore(_store);

  return {_store, persistor};
};

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}
