import {SAVE_POST_TYPE} from 'shared/constants/ActionTypes';

export const setPostTypeText = (postTypeText) => {
  return (dispatch) => dispatch({type: SAVE_POST_TYPE, payload: postTypeText});
};
