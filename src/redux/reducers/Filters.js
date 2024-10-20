import {SAVE_FILTERS} from 'shared/constants/ActionTypes';

const initialState = {
  filters: [],
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_FILTERS:
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
};

export default filtersReducer;
