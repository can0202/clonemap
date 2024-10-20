import AppPage from '@crema/hoc/AppPage';
import asyncComponent from '@crema/utility/asyncComponent';
import React from 'react';
import {fetchCategoryAll} from './api/category';
import cookie from 'cookie';
import {URL} from 'shared/constants/ConfigApp';

const SiteMap = asyncComponent(() => import('../modules/sitemap/index'), {
  ssr: true,
});
export default AppPage(({url, sitemapConfig}) => (
  <SiteMap url={url} sitemapConfig={sitemapConfig} />
));

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export const getServerSideProps = async ({req}) => {
  const cookies = parseCookies(req);
  const lang = cookies?.langServer;
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const url = `${protocol}://${req.headers.host}`;

    const resAllConfig = await fetchCategoryAll(lang);
    const subCate = resAllConfig?.data?.categories?.realEstateTypeCat || null;

    const sitemapConfig =
      resAllConfig?.data?.configurations?.landWebConfig?.sitemap || null;
    const categoryMap = subCate?.reduce((acc, curr) => {
      if (!acc[curr?.parent]) {
        acc[curr?.parent] = [];
      }
      acc[curr?.parent]?.push({
        label: curr?.fields?.menuName,
        type: 'href',
        key: curr?.fields?.slug,
        url: `${URL}/${curr?.fields?.slug}`,
      });
      return acc;
    }, {});

    const siteMapUpdate = sitemapConfig?.map((menuGroup) => {
      return menuGroup?.map((menuItem) => {
        if (categoryMap[menuItem.key]) {
          return {
            ...menuItem,
            children: [
              ...(menuItem.children || []),
              ...categoryMap[menuItem.key],
            ],
          };
        }
        return menuItem;
      });
    });

    return {
      props: {
        url,
        sitemapConfig: siteMapUpdate,
      },
    };
  } catch (error) {
    return {
      props: {error: true},
    };
  }
};
