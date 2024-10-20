import {IS_LOADING_APP} from 'shared/constants/ActionTypes';

export const onLoadingApp = (isLoadingApp) => {
  return (dispatch) => {
    dispatch({type: IS_LOADING_APP, payload: {isLoadingApp}});
  };
};
