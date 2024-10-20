import React from 'react';
import fetchIntercept from 'fetch-intercept';
import axios from 'axios';
import {getCookie} from 'cookies-next';

/**
 * FIX: SET DEFAULT LANGUAGE
 */
fetchIntercept.register({
  request: function (url, config = {}) {
    // Khởi tạo headers nếu chưa có
    config.headers = config.headers || {};

    if (typeof window != 'undefined') {
      const cookieLang = getCookie('lang');
      const lang = cookieLang && JSON.parse(cookieLang);
      config.headers['Accept-Language'] = lang ? lang?.languageId : 'vi';
    }
    return [url, config];
  },
});

axios.interceptors.request.use(
  function (config) {
    if (typeof window != 'undefined') {
      const cookieLang = getCookie('lang');
      const lang = cookieLang && JSON.parse(cookieLang);
      config.headers['Accept-Language'] = lang ? lang?.languageId : 'vi';
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

const AppLoader = () => {
  return (
    <div className='loading'>
      <div className='loading-inner'></div>
    </div>
  );
};

export default AppLoader;
