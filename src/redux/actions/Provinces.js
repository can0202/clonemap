import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  FETCH_PROVINCES_REQUEST,
} from 'shared/constants/ActionTypes';
import {URL_API} from 'shared/constants/ConfigApp';

export const fetchProvinces = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    fetch(URL_API + '/vhb/address/provinces')
      .then((data) => data.json())
      .then((data) => {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: FETCH_PROVINCES_REQUEST, payload: data.data});
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
