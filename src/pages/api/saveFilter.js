import {URL_API} from 'shared/constants/ConfigApp';
import axios from 'axios';
import {notification} from 'antd';

export const saveFilter = async (payload, accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    };
    const res = await axios.post(
      `${URL_API}/vland/posts/filters`,
      payload,
      config,
    );
    return res?.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
