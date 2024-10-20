import {onProvincesId, onSearchPost} from './api/vland';
import cookie from 'cookie';
import {fetchCategoryAll, onProvinces} from './api/category';
import AppPage from '@crema/hoc/AppPage';
import asyncComponent from '@crema/utility/asyncComponent';
import {fetchPostDetail} from './api/postDetail';
import {onSearchNews} from './api/news';
import {getReRelated} from './api/reRelated';
import {convertPriceToNumber} from 'shared/constants/AppConst';

const SearchPost = asyncComponent(() => import('../modules/search/index'), {
  ssr: true,
});
const Detail = asyncComponent(() => import('../modules/detail/index'), {
  ssr: true,
});
export default AppPage(
  ({
    postsCate,
    totalPost,
    url,
    titleSeo,
    pageType,
    typesKey,
    postsData,
    relatedBottomData,
    isWaitingToken,
    newsData,
  }) => (
    <>
      {pageType === 'detail' ? (
        <Detail
          postsData={postsData}
          relatedBottomData={relatedBottomData}
          url={url}
          isWaitingToken={isWaitingToken}
          newsData={newsData}
          pageType={pageType}
        />
      ) : (
        <SearchPost
          postsCate={postsCate}
          totalPost={totalPost}
          url={url}
          titleSeo={titleSeo}
          pageType={pageType}
          typesKey={typesKey}
        />
      )}
    </>
  ),
);

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export async function getServerSideProps({params, query, req, resolvedUrl}) {
  const cookies = parseCookies(req);
  const accessToken = cookies?.varsTkWeb;
  const lang = cookies?.langServer;
  const {slug} = params;
  const fullPath = slug?.join('/');
  const isDetailPage = slug?.some((part) => part?.includes('-vc'));
  const pageType = isDetailPage ? 'detail' : 'search';
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentMonthYear = `T${month}/${year}`;

  if (pageType === 'detail') {
    let urlResovled = resolvedUrl?.includes('?')
      ? resolvedUrl?.split('?')[0]
      : resolvedUrl;
    const hasPreviewParam = query.preview === '1';
    if (!accessToken && hasPreviewParam) {
      const isWaitingToken = true;
      return {
        props: {
          isWaitingToken,
          pageType: 'detail',
        },
      };
    }

    try {
      const apiObject = hasPreviewParam ? {preview: '1'} : {};
      const res = await fetchPostDetail(
        urlResovled,
        apiObject,
        accessToken,
        lang,
        '',
      );
      const postsData = res?.data;
      if (res?.statusCode === 404) {
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
        props: {
          postsData,
          relatedBottomData,
          url,
          newsData,
          pageType: 'detail',
        },
      };
    } catch (error) {
      return {
        props: {error: true},
      };
    }
  } else {
    const paramUrl = fullPath?.split('/');
    const param1 = paramUrl[0]?.split('?')[0] || '';
    const param2 = paramUrl[1]?.split('?')[0] || '';
    const resAllConfig = await fetchCategoryAll();
    const allProvinces = await onProvinces();
    const realEstateTypeCat =
      resAllConfig?.data?.categories?.realEstateTypeCat || null;

    let typeUrl;
    let elementsSubType;
    let subTypesU;
    let areaLocationUrl;
    let acreageRangeUrl;
    let priceRangeUrl;
    let defaultUrl;
    let bedroomUrl;
    let provinceIdUrl;
    let districtData;
    let wardData;

    if (param1?.includes('-tai-')) {
      defaultUrl = param1?.split('-tai-')[0];
    }

    if (param1) {
      if (param1?.includes('mua-ban-nha-dat')) {
        typeUrl = 'bds-ban';
      } else if (param1?.includes('cho-thue-nha-dat')) {
        typeUrl = 'bds-cho-thue';
      } else if (param1?.includes('du-an-bat-dong-san')) {
        typeUrl = 'du-an';
      } else if (param1?.includes('m-a-bat-dong-san')) {
        typeUrl = 'm-a';
      } else {
        const [firstPart, restCluster1] = param1?.split('-tai-');
        elementsSubType = realEstateTypeCat?.find(
          (item) => item?.fields?.slug === firstPart,
        );
        subTypesU = firstPart ? [elementsSubType?.code] : [];
        typeUrl = elementsSubType?.parent;
        areaLocationUrl = restCluster1;
      }

      // Kiểm tra nếu param1 không thuộc các typeUrl, redirect về trang chủ
      const allowedTypes = ['bds-ban', 'bds-cho-thue', 'du-an', 'm-a'];
      if (!allowedTypes?.includes(typeUrl)) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      const locationParts = param1?.split('-');
      const locationIndex = locationParts?.indexOf('tai');
      if (locationIndex !== -1) {
        areaLocationUrl = locationParts?.slice(locationIndex + 1)?.join('-');
      }

      // Lấy provinceId từ param1
      const provinceIdMatch = areaLocationUrl?.match(/-t(\d+)/);
      if (provinceIdMatch) {
        provinceIdUrl = provinceIdMatch[1];
      }
    }

    if (param2) {
      const parts = param2.split('-');
      const priceIndex = parts.indexOf('gia');
      if (priceIndex !== -1) {
        const nextPart = parts?.slice(priceIndex + 1, priceIndex + 3).join('-');
        if (nextPart === 'lien-he') {
          priceRangeUrl = [-1, -1];
        } else if (parts[priceIndex + 1] === 'duoi') {
          const value = convertPriceToNumber(
            parts[priceIndex + 2],
            parts[priceIndex + 3],
          );
          priceRangeUrl = [0, Number(value)];
        } else if (
          parts[priceIndex + 1] === 'tu' &&
          parts[priceIndex + 4] === 'den'
        ) {
          const fromValue = convertPriceToNumber(
            parts[priceIndex + 2],
            parts[priceIndex + 3],
          );
          const toValue = convertPriceToNumber(
            parts[priceIndex + 5],
            parts[priceIndex + 6],
          );
          priceRangeUrl = [Number(fromValue), Number(toValue)];
        }
      }
      // Xử lý diện tích
      const dtIndex = parts.indexOf('dt');
      if (dtIndex !== -1) {
        if (parts[dtIndex + 1] === 'duoi') {
          const value = parts[dtIndex + 2].replace('m2', '');
          acreageRangeUrl = [0, Number(value)];
        } else if (
          parts[dtIndex + 1] === 'tu' &&
          parts[dtIndex + 3] === 'den'
        ) {
          const fromValue = parts[dtIndex + 2].replace('m2', '');
          const toValue = parts[dtIndex + 4].replace('m2', '');
          acreageRangeUrl = [Number(fromValue), Number(toValue)];
        }
      }
      // Xử lý số phòng ngủ
      if (param2?.includes('pn')) {
        bedroomUrl = parts[parts?.length - 1]?.replace('pn', '');
      }
    }
    const queryBedrooms = query?.bedrooms || '';
    const bedrooms = bedroomUrl ? [...bedroomUrl, ...queryBedrooms] : '';
    const supTypeParams = query?.subTypes ? [query?.subTypes] : [];
    const subTypeArr = subTypesU ? [...subTypesU, ...supTypeParams] : '';
    const directions = query?.directions ? query?.directions?.split(',') : [];
    const postBy = query?.postBy ? query?.postBy?.split(',') : [];
    const investors = query?.investors ? query?.investors?.split(',') : [];
    const projects = query?.projects ? query?.projects?.split(',') : [];
    const status = query?.status ? query?.status?.split(',') : [];
    const subStatus = query?.subStatus ? query?.subStatus?.split(',') : [];
    const isOutstanding = query?.isOutstanding ? query?.isOutstanding : false;
    const isPostByVARS = query?.isPostByVARS ? query?.isPostByVARS : false;

    const typesKey = typeUrl ? typeUrl : null;
    const titleSeo = cookies?.titleSeo
      ? cookies?.titleSeo + ' - ' + currentMonthYear
      : 'VARs Land - Website số 1 về bất động sản - Mua bán, cho thuê, M&A nhà đất toàn quốc';

    const provinces = allProvinces?.find(
      (item) => item?.code === provinceIdUrl,
    );

    const listProvinces = await onProvincesId(provinceIdUrl);
    const params = areaLocationUrl?.replace(/-t\d+$/, '');

    if (provinceIdUrl) {
      const provinceData =
        listProvinces?.data?.id === provinceIdUrl ? listProvinces?.data : null;
      if (provinceData && provinceData?.districts) {
        for (const district of provinceData?.districts) {
          if (district?.slug === params) {
            districtData = district;
          }
          // Tìm xã/phường trong quận/huyện
          const ward = district?.wards?.find((ward) => ward.slug === params);
          if (ward) {
            districtData = district;
            wardData = ward;
          }
        }
      }
    }

    try {
      const priceFrom = priceRangeUrl?.length > 0 ? priceRangeUrl[0] : '';
      const priceTo = priceRangeUrl?.length > 0 ? priceRangeUrl[1] : '';
      const areaFrom = acreageRangeUrl?.length > 0 ? acreageRangeUrl[0] : '';
      const areaTo = acreageRangeUrl?.length > 0 ? acreageRangeUrl[1] : '';

      const dataParam = {
        types: typeUrl || '',
        subTypes: subTypeArr ? subTypeArr?.join(',') : '',
        subTypesText: elementsSubType?.name || '',
        provinceCodes: provinces?.code || '',
        provinceText: provinces?.name || '',
        districtCodes: districtData ? districtData?.code : '',
        wardCodes: wardData ? wardData?.id : '',
        priceFrom: priceFrom || '',
        priceTo: priceTo || '',
        areaFrom: areaFrom || '',
        areaTo: areaTo || '',
        bedrooms: bedrooms ? bedrooms?.join(',') : '',
        directions: directions ? directions?.join(',') : '',
        postBy: postBy ? postBy?.join(',') : '',
        investors: investors ? investors?.join(',') : '',
        projects: projects ? projects?.join(',') : '',
        status: status ? status?.join(',') : '',
        subStatus: subStatus ? subStatus?.join(',') : '',
        isPostByVARS: isPostByVARS,
        isOutstanding: isOutstanding,
        sortBy: 'default',
        page: 1,
        pageSize: 12,
      };

      let urlResolved = resolvedUrl?.includes('?')
        ? resolvedUrl?.split('?')[0]
        : resolvedUrl;
      const res = await onSearchPost(dataParam, accessToken, lang, '');
      const postsCate = res?.data?.elements || null;
      const totalPost = res?.data?.total || 0;

      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const url = `${protocol}://${req.headers.host}${urlResolved}`;

      return {
        props: {
          postsCate,
          totalPost,
          url,
          titleSeo,
          pageType: 'search',
          typesKey,
        },
      };
    } catch (error) {
      return {
        props: {error: true},
      };
    }
  }
}
