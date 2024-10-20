import {URL_API} from 'shared/constants/ConfigApp';

export const getReRelated = async (dataParam, token, lang) => {
  try {
    const res = await fetch(
      URL_API + `/vland/posts/re/related?` + new URLSearchParams(dataParam),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': lang || 'vi',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
