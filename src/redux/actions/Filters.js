import {SAVE_FILTERS} from 'shared/constants/ActionTypes';

export const setFilter = (filters) => {
  return (dispatch) => dispatch({type: SAVE_FILTERS, payload: filters});
};
