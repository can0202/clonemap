import {URL_API} from 'shared/constants/ConfigApp';

export const fetchDiscoveryRealEstate = async (lang) => {
  try {
    const res = await fetch(URL_API + `/vland/posts/re/discovery/city`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': lang || 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
