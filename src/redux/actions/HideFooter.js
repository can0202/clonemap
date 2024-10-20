import {IS_HIDE_FOOTER} from 'shared/constants/ActionTypes';

export const onHideFooter = (isHideFooter) => {
  return (dispatch) => {
    dispatch({type: IS_HIDE_FOOTER, payload: {isHideFooter}});
  };
};
