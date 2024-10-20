import {CLEAR_LOCATION, SAVE_LOCATION} from 'shared/constants/ActionTypes';

const initialState = {
  location: {
    lat: '',
    lng: '',
  },
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_LOCATION: {
      return {
        ...state,
        location: action.payload.location,
      };
    }

    case CLEAR_LOCATION:
      return {
        ...state,
        location: action.payload.location,
      };
    default:
      return state;
  }
};

export default locationReducer;
