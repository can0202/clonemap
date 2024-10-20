import { URL_API } from 'shared/constants/ConfigApp';

export const fetchTopProject = async (token, lang) => {
  try {
    const res = await fetch(URL_API + `/vland/posts/projects/top`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        // 'Accept-Language': 'vi',
        'Accept-Language': lang || 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
