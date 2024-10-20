import {URL_API} from 'shared/constants/ConfigApp';

export const fetchPostDetail = async (dataLink, object, accessToken, lang) => {
  const url =
    URL_API +
    `/vland/posts/detail?permalink=${dataLink}&` +
    new URLSearchParams(object);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang || 'vi',
      },
    });
    const data = await res.json();
    if (data?.data === null || data?.data === undefined) {
      console.log('Error: Post data not found, returning 404 status code');
      return {statusCode: 404, data: null};
    }

    return data;
  } catch (err) {
    console.log(err);
  }
};
