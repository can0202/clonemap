import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';
import {fetchCategoryAll} from 'pages/api/category';
import cookie from 'cookie';
import {onSearchPost} from 'pages/api/vland';

const CategoryTypeMa = asyncComponent(
  () => import('../../../modules/m-a/loai-hinh/[slugType]'),
  {ssr: true},
);
export default AppPage(({postsCate, url}) => (
  <CategoryTypeMa postsCate={postsCate} url={url} />
));

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}
export const getServerSideProps = async ({req, resolvedUrl}) => {
  let urlResovled = '';
  let catSlug = '';
  if (resolvedUrl?.includes('?')) {
    urlResovled = resolvedUrl?.split('?')[0];
    catSlug = urlResovled?.split('/')[2];
  } else {
    urlResovled = resolvedUrl;
    catSlug = resolvedUrl?.split('/')[2];
  }
  const pathSegments = urlResovled.split('/');
  const typeSlug = pathSegments[1]; // Dựa vào ví dụ, "du-an"
  const subTypeSlug = pathSegments[pathSegments.length - 1]; // Dựa vào ví dụ, "can-ho-chung-cu"

  // Get token
  const cookies = parseCookies(req);
  const accessToken = cookies?.varsTkWeb;
  const lang = cookies?.langServer;

  try {
    const resCate = await fetchCategoryAll();
    const categoryList =
      (await resCate?.data?.categories?.realEstateTypeCat) ?? null;
    const currentSubType = categoryList?.filter(
      (subType) => subType?.metadata === subTypeSlug,
    );
    const currentSubTypeCode = currentSubType?.find(
      (item) => item?.parent === typeSlug,
    );
    let subTypesCode = currentSubTypeCode?.code;
    const dataParam = {
      page: 1,
      types: typeSlug,
      pageSize: 12,
      subTypes: subTypesCode,
    };
    const res = await onSearchPost(dataParam, accessToken, lang, '');
    const postsCate = (await res?.data?.elements) || null;

    const url = req.headers.host + urlResovled;

    return {
      props: {postsCate, url},
    };
  } catch (error) {
    return {
      props: {error: true},
    };
  }
};
