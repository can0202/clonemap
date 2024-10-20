import {CLEAN_APP_STATE, SHOW_MESSAGE} from 'shared/constants/ActionTypes';

const initialState = {
  toastProps: {
    type: '',
    message: '',
    description: '',
  },
  loadingApp: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MESSAGE: {
      return {
        toastProps: action.payload,
      };
    }
    case CLEAN_APP_STATE:
      return initialState;
    default:
      return state;
  }
};
export default appReducer;
