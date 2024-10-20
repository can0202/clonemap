import {URL_API} from 'shared/constants/ConfigApp';

export const fetchSearchPost = async (dataObject, token) => {
  try {
    const res = await fetch(
      URL_API + '/vland/posts?' + new URLSearchParams(dataObject),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': 'vi',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
