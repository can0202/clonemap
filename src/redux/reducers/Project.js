import {
  IS_CHANGE_SUB_TYPE,
  RESET_IS_CHANGE_SUB_TYPE,
} from 'shared/constants/ActionTypes';

const initialState = {
  isChangeSubType: false,
  subType: null,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_CHANGE_SUB_TYPE:
      return {
        ...state,
        isChangeSubType: action.payload.isChangeSubType,
        subType: action.payload.subType,
      };
    case RESET_IS_CHANGE_SUB_TYPE:
      return {
        ...state,
        isChangeSubType: false,
      };
    default:
      return state;
  }
};
export default projectReducer;
