import React from 'react';
import AppPage from '../../@crema/hoc/AppPage';
import asyncComponent from '../../@crema/utility/asyncComponent';
import {fetchPostDetail} from 'pages/api/postDetail';
import {getReRelated} from 'pages/api/reRelated';
import cookie from 'cookie';
import {onSearchNews} from 'pages/api/news';

const MaDetail = asyncComponent(() => import('../../modules/m-a/[slug]'), {
  ssr: true,
});
export default AppPage(
  ({postsData, relatedBottomData, isWaitingToken, url, newsData}) => (
    <MaDetail
      postsData={postsData}
      relatedBottomData={relatedBottomData}
      isWaitingToken={isWaitingToken}
      url={url}
      newsData={newsData}
    />
  ),
);

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export const getServerSideProps = async ({req, resolvedUrl}) => {
  const cookies = parseCookies(req);
  const accessToken = cookies?.varsTkWeb;
  const lang = cookies?.langServer;

  function getURLParameters(url) {
    const queryString = url.split('?')[1];
    if (!queryString) {
      return {};
    }
    const pairs = queryString?.split('&');
    const params = {};
    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value || '');
    });
    return params;
  }
  const urlParams = getURLParameters(resolvedUrl);

  let urlResovled = '';
  if (resolvedUrl?.includes('?')) {
    urlResovled = resolvedUrl?.split('?')[0];
  } else {
    urlResovled = resolvedUrl;
  }

  function filterParams(params, keys) {
    const filteredParams = {};
    keys.forEach((key) => {
      if (params?.hasOwnProperty(key)) {
        filteredParams[key] = params[key];
      }
    });
    return filteredParams;
  }
  const desiredKeys = ['preview'];
  const filteredParams = filterParams(urlParams, desiredKeys);
  const hasPreviewParam =
    'preview' in filteredParams && filteredParams['preview'] === '1';

  if (!accessToken && hasPreviewParam) {
    const isWaitingToken = true;
    return {
      props: {
        isWaitingToken,
      },
    };
  }

  try {
    const apiObject = hasPreviewParam
      ? {...filteredParams, preview: '1'}
      : filteredParams;

    const res = await fetchPostDetail(
      urlResovled,
      apiObject,
      accessToken,
      lang,
      '',
    );
    const postsData = await res?.data;
    if (res.statusCode === 404) {
      return {
        notFound: true,
      };
    }
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const url = `${protocol}://${req.headers.host}${urlResovled}`;

    // Tin Tức
    const paramsNews = {
      page: 1,
      pageSize: 8,
      category: 'hot-news',
    };
    const resNews = await onSearchNews(paramsNews, lang);
    const newsData = resNews?.data?.elements || [];

    // Get Related Bottom
    const dataParam = {
      postId: postsData?.id,
    };
    const resRelatedBottom = await getReRelated(
      dataParam,
      accessToken,
      lang,
      '',
    );
    const relatedBottomData = resRelatedBottom?.data?.elements || null;

    return {
      props: {postsData, relatedBottomData, url, newsData},
    };
  } catch (error) {
    return {
      props: {error: true},
    };
  }
};
