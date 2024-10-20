import {URL_API} from 'shared/constants/ConfigApp';

export const fetchProjectCat = async (object) => {
  try {
    const res = await fetch(
      URL_API + '/vland/posts/projects/cat?' + new URLSearchParams(object),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
