import {URL_API} from 'shared/constants/ConfigApp';

export const getProjectRelated = async (dataObject, token) => {
  try {
    const res = await fetch(
      URL_API +
        '/vland/posts/projects/related?' +
        new URLSearchParams(dataObject),
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
