import {IS_HIDE_FOOTER} from 'shared/constants/ActionTypes';

const initialState = {
  isHideFooter: false,
};

const hideFooterReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_HIDE_FOOTER:
      return {
        ...state,
        isHideFooter: action.payload.isHideFooter,
      };
    default:
      return state;
  }
};
export default hideFooterReducer;
