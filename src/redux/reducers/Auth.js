import {
  SET_TOKEN,
  SET_LOGIN_REDIRECT_TO,
  SET_PROFILE,
  LOG_OUT,
  SAVE_LANGUAGE_LOCALE,
  SAVE_LOCATION,
} from 'shared/constants/ActionTypes';

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  profile: null,
  currentAccount: null,
  loginRedirectTo: null,
  loginRedirectToParam: null,
  showedRenewNotify: true,
  localeLanguage: {
    languageId: 'vi',
    locale: 'vi',
    name: 'Tiếng việt',
    icon: 'vi',
  },
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_LANGUAGE_LOCALE: {
      return {
        ...state,
        localeLanguage: action.payload.localeLanguage,
      };
    }
    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        profile: null,
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case SET_LOGIN_REDIRECT_TO:
      return {
        ...state,
        loginRedirectTo: action.payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        requireReloadSSO: true,
        isRefreshTokenSuccess: true,
        error: null,
        showedRenewNotify: true,
        showedEnterpriseRenewNotify: true,
      };
    default:
      return state;
  }
};

export default authReducer;
