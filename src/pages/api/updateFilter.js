import {URL_API} from 'shared/constants/ConfigApp';
import {notification} from 'antd';

export const updateFilter = async (id_filer, params, accessToken) => {
  try {
    const res = await fetch(URL_API + `/vland/posts/filters/${id_filer}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    notification.error({
      message: 'Lỗi không thể lưu bộ lọc',
      description: '',
      className: 'bg-error',
      placement: 'bottomRight',
      duration: 5,
    });
  }
};
