import {URL_API} from 'shared/constants/ConfigApp';

export const onMarketReport = async (token, lang) => {
  try {
    const params = {
      page: 1,
      pageSize: 10,
      // type: 1,
    };
    const res = await fetch(
      URL_API + '/vhb/market-reports?' + new URLSearchParams(params),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          // 'Accept-Language': 'en',
          'Accept-Language': lang || 'vi',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onSearchPost = async (dataObject, token, lang) => {
  try {
    const res = await fetch(
      URL_API + '/vland/posts?' + new URLSearchParams(dataObject),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          // 'Accept-Language': 'vi',
          'Accept-Language': lang || 'vi',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onRecommendRealEstate = async (dataPage, token) => {
  try {
    const res = await fetch(
      URL_API + '/vland/posts/re/recommend?' + new URLSearchParams(dataPage),
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
  } catch (err) {
    console.log(err);
  }
};

export const onGetNotificationGroup = async (token) => {
  try {
    const res = await fetch(URL_API + '/vcms/notifications/groups', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onGetNotifications = async (params, token) => {
  try {
    const res = await fetch(
      URL_API + '/vcms/notifications?' + new URLSearchParams(params),
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
  } catch (err) {
    console.log(err);
  }
};
export const onReadAllNotifications = async (token) => {
  try {
    const res = await fetch(URL_API + '/vcms/notifications/me/read', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onReadIdNotifications = async (id, token) => {
  try {
    const res = await fetch(URL_API + '/vcms/notifications/me/read/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onDeletedIdNotifications = async (id, token) => {
  try {
    const res = await fetch(URL_API + '/vcms/notifications/me/' + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onDeletedAllNotifications = async (token) => {
  try {
    const res = await fetch(URL_API + '/vcms/notifications/me', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onProjectDiscovery = async () => {
  try {
    const res = await fetch(URL_API + `/vland/posts/projects/discovery`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onDiscoveryRealEstate = async () => {
  try {
    const res = await fetch(URL_API + `/vland/posts/re/discovery/city`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onRepresentatives = async (lang) => {
  try {
    const res = await fetch(
      URL_API + `/vcms/exchanges/representatives?page=1&pageSize=10`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // 'Accept-Language': 'vi',
          'Accept-Language': lang || 'vi',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onFavorite = async (idPost, dataFavorite, token) => {
  try {
    const response = await fetch(
      URL_API + `/vland/posts/me/favorite/${idPost}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': 'vi',
        },
        body: JSON.stringify({isFavorite: dataFavorite}),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const onSendEmail = async (dataEmail) => {
  try {
    const response = await fetch(URL_API + `/vhb/emails`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      body: JSON.stringify({email: dataEmail}),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const onPostReport = async (dataReport, token) => {
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

export const onRealEstatePriceAnalytics = async (
  typeCode,
  provinceCode,
  districtCode,
  wardCode,
  street,
  token,
) => {
  try {
    const res = await fetch(
      URL_API +
        `/vland/analytics/real-estate-price?type.code=${typeCode}&province.code=${provinceCode}&district.code=${districtCode}&ward.code=${wardCode}&street=${street}`,
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
    return data?.data;
  } catch (err) {
    console.log(err);
  }
};

export const onNearBy = async (lat, lng, categories, lang) => {
  try {
    const res = await fetch(
      URL_API +
        `/vmap/places/getNearBy?lat=${lat}&lng=${lng}&categories=${categories}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': lang || 'vi',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onProvincesId = async (id) => {
  try {
    const res = await fetch(URL_API + `/vhb/address/provinces/${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onGetPostDetailById = async (idPost) => {
  const url = URL_API + `/vland/posts/` + idPost;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onGetInviteEmployees = async () => {
  const url = URL_API + `/vcms/users/me/invites`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onApproveInvite = async (id, status) => {
  const url = URL_API + `/vcms/internal/users/crm-approve`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      body: JSON.stringify({id: id, status: status}),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
