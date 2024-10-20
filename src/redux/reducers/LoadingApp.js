import {IS_LOADING_APP} from 'shared/constants/ActionTypes';

const initialState = {
  isLoadingApp: true,
};

const loadingAppReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING_APP:
      return {
        ...state,
        isLoadingApp: action.payload.isLoadingApp,
      };
    default:
      return state;
  }
};
export default loadingAppReducer;
