import {FETCH_CATEGORIES_REQUEST} from 'shared/constants/ActionTypes';

const initialState = {
  loading: false,
  categories: [],
  error: '',
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        categories: action.payload,
        loading: true,
      };
    default:
      return state;
  }
};

export default categoryReducer;
