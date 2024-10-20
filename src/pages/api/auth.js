import axios from 'axios';
import {URL_AUTH_AJAX_SSO} from 'shared/constants/ConfigApp';

export const onCheckSessionInSSO = async () => {
  try {
    const res = await axios.get(`${URL_AUTH_AJAX_SSO}`, {
      withCredentials: true,
    });
    return res?.data?.code === 200;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};
