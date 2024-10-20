import {URL_API_NEW} from 'shared/constants/ConfigApp';

export const onSearchNews = async (object, lang) => {
  try {
    const res = await fetch(
      URL_API_NEW + `/vnews/posts/search?` + new URLSearchParams(object),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': lang || 'vi',
        },
      },
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};
