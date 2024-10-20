import React from 'react';
import AppPage from '../../@crema/hoc/AppPage';
import asyncComponent from '../../@crema/utility/asyncComponent';
import cookie from 'cookie';
import {onSearchPost} from 'pages/api/vland';

const MaBDS = asyncComponent(() => import('../../modules/m-a/index'), {
  ssr: true,
});
export default AppPage(({postsCate, url}) => (
  <MaBDS postsCate={postsCate} url={url} />
));

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}
export const getServerSideProps = async ({req, resolvedUrl}) => {
  function getURLParameters(url) {
    const queryString = url.split('?')[1];
    if (!queryString) {
      return {};
    }
    const pairs = queryString.split('&');
    const params = {};
    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value || '');
    });
    return params;
  }

  // Get Token
  const cookies = parseCookies(req);
  const accessToken = cookies?.varsTkWeb;
  const lang = cookies?.langServer;
  try {
    const dataParam = {
      page: 1,
      types: 'm-a',
      subTypes: '',
      subTypesText: '',
      provinces: '',
      districts: '',
      wards: '',
      provinceCodes: '',
      districtCodes: '',
      wardCodes: '',
      priceFrom: '',
      priceTo: '',
      areaFrom: '',
      areaTo: '',
      directions: '',
      bedrooms: '',
      investors: '',
      postBy: '',
      projects: '',
      status: '',
      subStatus: '',
      searchText: '',
      sortBy: 'default',
      isOutstanding: false,
      isPostByVARS: false,
      pageSize: 12,
    };
    let urlResolved = '';
    if (resolvedUrl?.includes('?')) {
      urlResolved = resolvedUrl?.split('?')[0];
    } else {
      urlResolved = resolvedUrl;
    }
    const urlParams = getURLParameters(resolvedUrl);
    const cloneObject = {};
    Object?.keys(dataParam)?.forEach((key) => {
      let typeOf = typeof dataParam[key];
      cloneObject[key] =
        typeOf == 'object' && dataParam[key]
          ? dataParam[key]?.join()
          : dataParam[key];
    });
    let params = {
      ...cloneObject,
      ...urlParams,
    };
    const res = await onSearchPost(params, accessToken, lang, '');
    const postsCate = (await res?.data?.elements) || null;

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const url = `${protocol}://${req.headers.host}${urlResolved}`;

    return {
      props: {postsCate, url},
    };
  } catch (error) {
    return {
      props: {error: true},
    };
  }
};
