import AppPage from '@crema/hoc/AppPage';
import asyncComponent from '@crema/utility/asyncComponent';
import React from 'react';
import cookie from 'cookie';
import {onSearchPost} from './api/vland';
import {URL, URL_API, URL_API_NEW} from 'shared/constants/ConfigApp';

const Home = asyncComponent(() => import('../modules/home/index'), {
  ssr: true,
});
export default AppPage(
  ({
    url,
    menus,
    subCate,
    postsData,
    topData,
    realEstateData,
    reportData,
    varsRealData,
    recommendRealData,
    realEstateBigData,
    newsData,
    sectionConfig,
    representativesData,
    categoryFooter,
    provinces,
  }) => (
    <Home
      url={url}
      menus={menus}
      subCate={subCate}
      postsData={postsData}
      topData={topData}
      realEstateData={realEstateData}
      reportData={reportData}
      varsRealData={varsRealData}
      recommendRealData={recommendRealData}
      realEstateBigData={realEstateBigData}
      newsData={newsData}
      sectionConfig={sectionConfig}
      representativesData={representativesData}
      categoryFooter={categoryFooter}
      provinces={provinces}
    />
  ),
);

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export const getServerSideProps = async ({req}) => {
  const cookies = parseCookies(req);
  const accessToken = cookies?.varsTkWeb;
  const lang = cookies.langServer;

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const url = `${protocol}://${req.headers.host}`;

    //Params
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: accessToken,
      'Accept-Language': lang || 'vi',
    };

    const [
      dataNews,
      dataCategory,
      dataProvinces,
      dataRepresentatives,
      dataReport,
      dataVars,
      dataProjects,
      dataDiscovery,
    ] = await Promise.all([
      // Tin Tức
      fetch(
        URL_API_NEW + `/vnews/posts/search?page=1&pageSize=8&category=hot-news`,
        {
          method: 'GET',
          headers: headers,
        },
      ),
      // All Category
      fetch(URL_API + `/vhb/app/params`, {
        method: 'GET',
        headers: headers,
      }),
      // provinces
      fetch(URL_API + `/vhb/address/provinces`, {
        method: 'GET',
        headers: headers,
      }),
      // Sàn giao dịch BĐS tiêu biểu
      fetch(URL_API + `/vcms/exchanges/representatives?page=1&pageSize=10`, {
        method: 'GET',
        headers: headers,
      }),
      // Báo cáo thị trường
      fetch(URL_API + '/vhb/market-reports?page=1&pageSize=10', {
        method: 'GET',
        headers: headers,
      }),
      // Bài viết của VARs
      fetch(
        URL_API +
          '/vland/posts?page=1&pageSize=10&isPostByVARS=true&types=bds-ban',
        {
          method: 'GET',
          headers: headers,
        },
      ),
      // Dự án nổi bật
      fetch(URL_API + '/vland/posts/projects/top', {
        method: 'GET',
        headers: headers,
      }),
      // Bất động sản theo khu vực
      fetch(URL_API + '/vland/posts/re/discovery/city', {
        method: 'GET',
        headers: headers,
      }),
    ]);

    const [
      newsResults,
      categoryResults,
      provinceResults,
      representativesResults,
      reportResults,
      varsResults,
      projectsResults,
      discoveryResults,
    ] = await Promise.all([
      dataNews.json(),
      dataCategory.json(),
      dataProvinces.json(),
      dataRepresentatives.json(),
      dataReport.json(),
      dataVars.json(),
      dataProjects.json(),
      dataDiscovery.json(),
    ]);

    // All Category
    const subCate =
      categoryResults?.data?.categories?.realEstateTypeCat || null;
    const provinces = provinceResults?.data || null;
    const provinceReConfig =
      categoryResults?.data?.configurations?.provinceReConfig || null;
    const menus =
      categoryResults?.data?.configurations?.landWebConfig?.headerMenu ?? [];
    const sectionConfig =
      categoryResults?.data?.configurations?.landWebConfig?.sections ?? [];
    const postsData = null;
    const categoryFooter = sectionConfig?.varsLandIntroduction?.menu || [];
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
    const categoryFooterUpdate = categoryFooter?.map((menuItem) => {
      if (categoryMap[menuItem?.key]) {
        return {
          ...menuItem,
          children: [
            ...(menuItem?.children || []),
            ...categoryMap[menuItem?.key],
          ],
        };
      }
      return menuItem;
    });
    const newsData = newsResults?.data?.elements || []; // Tin Tức
    const representativesData = representativesResults?.data?.elements || null; // Sàn giao dịch BĐS tiêu biểu
    const reportData = reportResults?.data?.elements || null; // Báo cáo thị trường
    const varsRealData = varsResults?.data?.elements || []; // Bài viết của VARs
    const topData = projectsResults?.data?.splice(0, 4) || null; // Dự án nổi bật
    const realEstateData = discoveryResults?.data || null; // Bất động sản theo khu vực

    // Nhà đất cho thuê tại các thành phố lớn
    const paramsDis = {
      page: 1,
      pageSize: 5,
      types: 'bds-cho-thue',
      provinces: provinceReConfig[0]?.name,
    };
    const dataDis = await onSearchPost(paramsDis, accessToken, lang);
    const realBigCityData = (await dataDis?.data?.elements) || [];
    const realEstateBigData = {
      dataTab: provinceReConfig,
      realData: realBigCityData,
    };

    return {
      props: {
        url,
        menus,
        subCate,
        postsData,
        topData,
        realEstateData,
        reportData,
        varsRealData,
        realEstateBigData,
        newsData,
        sectionConfig,
        categoryFooter: categoryFooterUpdate,
        representativesData,
        provinces,
      },
    };
  } catch (error) {
    return {
      props: {error: true},
    };
  }
};
