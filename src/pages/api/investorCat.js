import {URL_API} from 'shared/constants/ConfigApp';

export const fetchInvestorCat = async (object) => {
  try {
    const res = await fetch(
      URL_API + '/vland/investors?' + new URLSearchParams(object),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
