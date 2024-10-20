import {SAVE_POST_TYPE} from 'shared/constants/ActionTypes';

const initialState = {
  postTypeText: '',
};

const postTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_POST_TYPE:
      return {
        ...state,
        postTypeText: action.payload,
      };
    default:
      return state;
  }
};

export default postTypeReducer;
