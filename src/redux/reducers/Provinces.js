import {FETCH_PROVINCES_REQUEST} from 'shared/constants/ActionTypes';

const initialState = {
  loading: false,
  provinces: [],
  error: '',
};

const provincesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROVINCES_REQUEST:
      return {
        ...state,
        provinces: action.payload,
        loading: true,
      };
    default:
      return state;
  }
};

export default provincesReducer;
