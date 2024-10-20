import {URL_API} from 'shared/constants/ConfigApp';

export const fetchRating = async (dataRating, token) => {
  try {
    const res = await fetch(
      URL_API + '/vcms/ratings?' + new URLSearchParams(dataRating),
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
  } catch (error) {
    console.log(error);
  }
};

// Post
export const updateRating = async (dataRating, token) => {
  try {
    const res = await fetch(URL_API + '/vcms/ratings/me', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
      body: JSON.stringify(dataRating),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
