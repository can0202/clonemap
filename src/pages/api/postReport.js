import {URL_API} from 'shared/constants/ConfigApp';

export const postReport = async (dataReport, token) => {
  try {
    const res = await fetch(URL_API + '/vhb/reports/me', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
      body: JSON.stringify(dataReport),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
