import axios from 'axios';
import {URL_API} from 'shared/constants/ConfigApp';

export const fetchCategoryAll = async (lang) => {
  try {
    const res = await fetch(URL_API + `/vhb/app/params`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'Accept-Language': 'vi',
        'Accept-Language': lang || 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onProvinces = async (lang) => {
  try {
    const res = await fetch(URL_API + `/vhb/address/provinces`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': lang || 'vi',
      },
    });
    const data = await res.json();
    return data?.data;
  } catch (err) {
    console.log(err);
  }
};

export const onGetProfileUser = async (token) => {
  try {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
        Authorization: `Bearer ${token}`,
      },
    };
    const data = await axios.get(`${URL_API}/vcms/users/me`, config);
    return data?.data;
  } catch (err) {
    console.log('err', err);
    return null;
  }
};
