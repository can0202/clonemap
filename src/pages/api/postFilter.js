import {URL_API} from 'shared/constants/ConfigApp';

export const postFilter = async (accessToken) => {
  try {
    const res = await fetch(URL_API + `/vland/posts/filters`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};
