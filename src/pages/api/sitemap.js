import {URL_API} from 'shared/constants/ConfigApp';

export const onSitemap = async (key) => {
  try {
    const res = await fetch(URL_API + `/vhb/sitemaps?key=${key}&site=land`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
    });
    const data = await res.text();
    return data;
  } catch (err) {
    console.log(err);
  }
};
