// import ssoSdkJs from '../../../vars-id';
import {
  SET_TOKEN,
  SET_LOGIN_REDIRECT_TO,
  SET_PROFILE,
  LOG_OUT,
} from 'shared/constants/ActionTypes';

export const setProfile = ({data}) => {
  return (dispatch) => {
    const profile = data;
    dispatch({
      type: SET_PROFILE,
      payload: profile,
    });
  };
};

export const onSetToken = ({data}) => {
  return (dispatch) => {
    const accessToken = data?.data?.accessToken;
    const refreshToken = data?.data?.refreshToken;
    dispatch({
      type: SET_TOKEN,
      payload: {accessToken, refreshToken},
    });
  };
};

export const onSetRedirectTo = (url) => {
  return (dispatch) => {
    dispatch({type: SET_LOGIN_REDIRECT_TO, payload: url});
  };
};

export const onLogOut = () => {
  return (dispatch) => {
    dispatch({
      type: LOG_OUT,
    });
  };
};
