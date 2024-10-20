import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  FETCH_CATEGORIES_REQUEST,
  IS_LOADING_APP,
} from 'shared/constants/ActionTypes';
import {URL_API} from 'shared/constants/ConfigApp';
import {onLoadingApp} from './LoadingApp';

export const fetchAllCategories = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    dispatch(onLoadingApp(true));
    fetch(URL_API + '/vhb/app/params')
      .then((data) => data.json())
      .then((data) => {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: FETCH_CATEGORIES_REQUEST, payload: data.data});
        dispatch(onLoadingApp(false));
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.message});
        dispatch(onLoadingApp(false));
      });
  };
};
