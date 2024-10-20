import {generateCode} from 'shared/GenerateCode';
import {makePersistKey} from './Utils';
import {
  APP_CODE,
  CLIENT_ID,
  URL_REDIRECT_TO_SSO,
} from 'shared/constants/ConfigApp';

export const redirectToSSOFunc = () => {
  const urlObj = new URL(window.location.href);
  urlObj.hash = '';
  window.history.pushState('', '', urlObj);
  const redirectTo = window.location.href.replace(/\/$/, '');
  const code = generateCode(); // Hàm generateCode cần được định nghĩa hoặc import
  const codeVerifier = code.codeVerifier;
  localStorage.setItem(makePersistKey('codeVerifier'), codeVerifier); // Hàm makePersistKey cần được định nghĩa hoặc import
  const codeChallenge = code.codeChallenge;
  const url = `${URL_REDIRECT_TO_SSO}?redirectTo=${redirectTo}&appCode=${APP_CODE}&clientId=${CLIENT_ID}&codeChallenge=${codeChallenge}`;
  window.location.replace(url);
};
