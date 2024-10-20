import {URL_API} from 'shared/constants/ConfigApp';

export const fetchSearchPolygon = async (dataPolygon, token) => {
  try {
    const res = await fetch(URL_API + '/vland/posts/search/polygon', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
      body: JSON.stringify(dataPolygon),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
