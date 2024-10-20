import Head from 'next/head';
import React, {useState, useEffect} from 'react';
import HeaderSearch from 'components/HeaderSearch';
import MapView from 'components/MapView';
import Breadcrumbs from 'components/Breadcrumbs';
import TitleSearch from 'components/TitleSearch';
import BoxItem from 'components/BoxItem';
import Paginations from 'components/Paginations';
import PropsTypes from 'prop-types';
import {useRouter} from 'next/router';
import {Col, Form, Row} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import AdsBanner from 'components/AdsBanner';
import Logo from 'assets/img/logo_app.png';
import Sidebar from 'components/Sidebar';
import {onHideFooter} from 'redux/actions/HideFooter';
import {GOOGLE_ADS_ENABLED} from 'shared/constants/ConfigApp';
import AppModal from 'components/AppModal';
import {useIntl} from 'react-intl';
import {
  convertPriceToNumber,
  formatPrice,
  nFormatterPriceCustom,
  typesReplaceMapping,
} from 'shared/constants/AppConst';
import {onProvincesId, onSearchPost} from 'pages/api/vland';
import {getCookies} from 'cookies-next';

let subTypes = [];
let province = [];
let district = '';
let ward = '';
let bedrooms = '';
let directions = [];
let extraParams = {};
let isMap = '';

let defaultUrl = '';
let typeUrl = '';
var subTypesUrl = '';
let areaLocationUrl = ''; // Khu vực
let provinceIdUrl = '';
let priceRangeUrl = '';
let acreageRangeUrl = ''; // Diện tích
let bedroomUrl = '';

export const initFromParams = (query) => {
  subTypes = query?.subTypes ? query.subTypes.split(',') : [];
  bedrooms = query?.bedrooms ? query.bedrooms.split(',') : [];
  directions = query?.directions ? query.directions.split(',') : [];
  isMap = query?.isMap || '';
  // Lưu trữ các tham số đã xử lý vào extraParams
  extraParams = {
    ...(subTypes.length > 0 && {subTypes}), // Chỉ thêm nếu subTypes không rỗng
    ...(bedrooms.length > 0 && {bedrooms}), // Chỉ thêm nếu bedrooms không rỗng
    ...(directions.length > 0 && {directions}), // Chỉ thêm nếu directions không rỗng
    ...(isMap && {isMap}), // Chỉ thêm nếu isMap không rỗng
  };

  return {
    subTypes,
    bedrooms,
    directions,
    isMap,
  };
};

export const initFromAsPath = (asPath, subTypeFilterCats) => {
  const param1 = asPath[0]?.split('?')[0] || '';
  const param2 = asPath[1]?.split('?')[0] || '';

  if (param1?.includes('-tai-')) {
    defaultUrl = param1?.split('-tai-')[0];
  } else
    defaultUrl =
      param1 === 'du-an'
        ? 'du-an-bat-dong-san'
        : param1 === 'm-a'
        ? 'm-a-bat-dong-san'
        : param1;

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
      const elements = subTypeFilterCats?.find(
        (item) => item?.fields?.slug === firstPart,
      );

      typeUrl = elements?.parent;
      subTypesUrl = elements?.fields?.slug;
      areaLocationUrl = restCluster1;
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
    // Xử lý giá
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
      } else if (parts[dtIndex + 1] === 'tu' && parts[dtIndex + 3] === 'den') {
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

  return {
    typeUrl,
    subTypesUrl,
    areaLocationUrl,
    acreageRangeUrl,
    priceRangeUrl,
    defaultUrl,
    bedroomUrl,
    provinceIdUrl,
  };
};

export const onChangeParamUrl = (type, value) => {
  switch (type) {
    case 'types':
      defaultUrl = `${typesReplaceMapping[value]}`;
      subTypes = '';
      typeUrl = value;
      break;
    case 'subTypes':
      if (value?.length == 0) {
        defaultUrl = `${typesReplaceMapping[typeUrl]}`;
        break;
      }
      if (value?.length == 1) {
        defaultUrl = `${value[0]?.metadata}`;
        break;
      }
      if (value?.length > 1) {
        defaultUrl = `${value[0]?.metadata}`;
        const newValue = value?.slice(1);
        subTypes = newValue?.map((item) => `${item?.value}`).join(',');
        break;
      }
      break;
    case 'province':
      province = value || '';
      district = '';
      ward = '';
      break;
    case 'district':
      district = value || '';
      ward = '';
      break;
    case 'ward':
      ward = value || '';
      break;
    case 'priceRange':
      priceRangeUrl = Array.isArray(value) && value?.length === 2 ? value : []; // [min, max]
      break;
    case 'areaRange':
      acreageRangeUrl = Array.isArray(value) && value.length === 2 ? value : []; // [min, max]
      break;
    case 'bedrooms':
      bedroomUrl = Array.isArray(value) ? value : [value]; // Đây có thể là một mảng giá trị;
      break;
    case 'directions':
      directions = Array.isArray(value) ? value : [value]; // Đây có thể là một mảng giá trị;
      break;
    default:
      console.error('Unknown type');
      return;
  }

  if (province?.length > 0) {
    areaLocationUrl = province;
  }
  if (province?.length === 0) {
    areaLocationUrl = '';
  }

  if (district?.length > 0) {
    areaLocationUrl = district;
  }
  if (ward?.length > 0) {
    areaLocationUrl = ward;
  }

  let secondaryUrl = '/';
  let priceUrl = '';
  let areaUrl = '';
  let roomUrl = '';

  // Xử lý giá

  if (priceRangeUrl && priceRangeUrl?.length === 2) {
    const [minPrice, maxPrice] = priceRangeUrl?.map(formatPrice);
    if (priceRangeUrl[0] === -1 && priceRangeUrl[1] === -1) {
      priceUrl += 'gia-lien-he';
    } else if (priceRangeUrl[0] === 0) {
      priceUrl += `gia-duoi-${maxPrice}`;
    } else {
      priceUrl += `gia-tu-${minPrice}-den-${maxPrice}`;
    }
  }

  if (acreageRangeUrl && acreageRangeUrl?.length === 2) {
    if (acreageRangeUrl[0] === 0) {
      areaUrl += `dt-duoi-${acreageRangeUrl[1]}m2`;
    } else {
      areaUrl += `dt-tu-${acreageRangeUrl[0]}m2-den-${acreageRangeUrl[1]}m2`;
    }
  }

  if (bedroomUrl?.length > 0) {
    roomUrl = `${bedroomUrl[0]}pn`;
  }

  const combinedUrlParts = [priceUrl, areaUrl, roomUrl].filter(Boolean); // Loại bỏ phần rỗng
  secondaryUrl += combinedUrlParts?.join('-');
  // Hàm để chuyển đổi object thành query string
  const queryParams = new URLSearchParams(extraParams).toString();
  let queryUrl = queryParams ? `?${queryParams}` : '';

  const resultUrl = `${defaultUrl}${
    areaLocationUrl && areaLocationUrl?.length > 0
      ? `-tai-${areaLocationUrl}`
      : ''
  }${secondaryUrl}`;
  // console.log('resultUrl', resultUrl);
  return resultUrl;
};

export const getLocationInfo = (param, provinceId, data) => {
  const result = {
    district: null,
    ward: null,
  };
  // Tìm tỉnh dựa trên provinceId
  const province = data.id === provinceId ? data : null;
  if (province && province.districts) {
    for (const district of province.districts) {
      // Kiểm tra xem param có phải là quận/huyện không
      if (district.slug === param) {
        result.district = district;
        return result;
      }

      // Tìm xã/phường trong quận/huyện
      const ward = district.wards.find((ward) => ward.slug === param);
      if (ward) {
        result.district = district;
        result.ward = ward;
        return result;
      }
    }
  }

  return result;
};

const SearchComponent = ({
  searchParam,
  postsCate,
  totalPost,
  url,
  titleSeo,
}) => {
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const {accessToken} = useSelector(({auth}) => auth);
  const {categories} = useSelector((state) => state.categories);
  const subTypeFilterCats = categories?.categories?.realEstateTypeCat ?? [];
  const postTypeFilterCats = categories?.categories?.postTypeFilterCat ?? [];
  const realEstatePriceFilterCat =
    categories?.categories?.realEstatePriceFilterCat ?? [];
  const provincesCate = useSelector((state) => state.provinces);
  const provincesFilter = provincesCate?.provinces ?? [];

  const [displayView, setDisplayView] = useState(true);
  const [itemPost, setItemPost] = useState(postsCate || []);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(totalPost || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [provinces, setProvinces] = useState('');
  const [switchMap, setSwitchMap] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [map, setMap] = useState(null);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [isReloadMap, setIsReloadMap] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    className: '',
    description: '',
    submitText: '',
    closeText: '',
    handleClose: () => {},
    handleSubmit: () => {},
    width: 'auto',
    onClosable: () => {},
  });
  const [openFullMap, setOpenFullMap] = useState(false);
  const [objLocation, setObjLocation] = useState({
    provinceCode: '',
    districtCode: '',
    wardCode: '',
  });

  const [dataObject, setDataObject] = useState({
    page: 1,
    types: '',
    subTypes: '',
    subTypesText: '',
    provinces: '',
    provinceCodes: '',
    provinceText: '',
    districts: '',
    districtCodes: '',
    districtText: '',
    wards: '',
    wardCodes: '',
    wardText: '',
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
  });
  const [mapDataObj, setMapDataObj] = useState({
    types: [],
    subTypes: [],
    directions: [],
    areaFrom: null,
    areaTo: null,
    priceFrom: null,
    priceTo: null,
    provinces: [],
    provinceCodes: [],
    provinceText: '',
    districts: [],
    districtCodes: [],
    districtText: '',
    wards: [],
    wardCodes: [],
    wardText: '',
    bedrooms: [],
    investors: [],
    projects: [],
    postBy: [],
    status: [],
    subStatus: [],
    polygon: null,
    sortBy: 'default',
    isOutstanding: false,
    isPostByVARS: false,
    searchText: '',
  });

  const [title, setTitle] = useState('');

  const [initStatte, setInitStatte] = useState({
    typeUrl,
    subTypesUrl,
    areaLocationUrl,
    acreageRangeUrl,
    priceRangeUrl,
    defaultUrl,
    bedroomUrl,
    provinceIdUrl,
  });

  const getListProvinces = async (provinceCode) => {
    const resultData = await onProvincesId(provinceCode);
    const data = resultData?.data ?? [];
    return data;
  };

  const paramUrl = router.asPath?.split('/')?.filter((item) => item !== '');
  let typescode;

  const handleUrl = (url) => {
    const subTypesCode = subTypeFilterCats?.find((item) => {
      return item?.parent === typescode && item?.fields?.slug === url;
    });
    const subTypesU = subTypesCode ? [subTypesCode.code] : [];

    const bedroomU = url ? [url] : [];
    return {subTypesU, bedroomU};
  };

  const handleParams = (params) => {
    const subTypesP = params?.subTypes?.split(',') ?? [];
    const bedroomsP = params?.bedrooms?.split(',') ?? [];
    const directionsP = params?.directions?.split(',') ?? [];
    const postByP = params?.postBy?.split(',') ?? [];
    const investorsP = params?.investors?.split(',') ?? [];
    const projectsP = params?.projects?.split(',') ?? [];
    const statusP = params?.status?.split(',') ?? [];
    const subStatusP = params?.status?.split(',') ?? [];
    return {
      subTypesP,
      bedroomsP,
      directionsP,
      postByP,
      investorsP,
      projectsP,
      statusP,
      subStatusP,
    };
  };

  const nFormatterPrice = (num) => {
    if (num >= 1000000000) {
      return (
        (num / 1000000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.billion']
      );
    }
    if (num >= 1000000) {
      return (
        (num / 1000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.million']
      );
    }
    return num;
  };

  // Load initializeData
  useEffect(async () => {
    const searchText = router.query.searchText;
    const isPostByVARS = router.query.isPostByVARS;
    const isOutstanding = router.query.isOutstanding;
    const {isMap} = initFromParams(router.query);
    const {
      typeUrl,
      subTypesUrl,
      areaLocationUrl,
      acreageRangeUrl,
      priceRangeUrl,
      defaultUrl,
      bedroomUrl,
      provinceIdUrl,
    } = initFromAsPath(paramUrl, subTypeFilterCats);

    setInitStatte({
      typeUrl,
      subTypesUrl,
      areaLocationUrl,
      acreageRangeUrl,
      priceRangeUrl,
      defaultUrl,
      bedroomUrl,
      provinceIdUrl,
    });
    typescode = typeUrl ? typeUrl : '';
    const url = subTypesUrl?.split('?')[0];
    const {subTypesU} = handleUrl(url);
    const {
      subTypesP,
      bedroomsP,
      directionsP,
      postByP,
      investorsP,
      projectsP,
      statusP,
      subStatusP,
    } = handleParams(router.query);
    const subTypes = [...subTypesU, ...subTypesP];
    const bedrooms = [...bedroomUrl, ...bedroomsP];

    // Xử lý tỉnh/quận/huyện cho query param code - Vland- 2.0
    const listProvinces = await getListProvinces(provinceIdUrl);
    const locationInfo = getLocationInfo(
      areaLocationUrl?.replace(/-t\d+$/, ''),
      provinceIdUrl,
      listProvinces,
    );

    setDataObject({
      ...dataObject,
      types: typeUrl,
      searchText: searchText ? searchText : '',
      subTypes: subTypes ? subTypes?.join(',') : '',
      provinceCodes: provinceIdUrl || '',
      districtCodes: locationInfo?.district?.code || '',
      wardCodes: locationInfo?.ward?.code || '',
      provinceText: listProvinces ? listProvinces?.name : '',
      districtText: locationInfo?.district ? locationInfo?.district?.name : '',
      wardText: locationInfo?.ward ? locationInfo?.ward?.name : '',
      bedrooms: bedrooms ? bedrooms?.join(',') : '',
      directions: directionsP ? directionsP?.join(',') : '',
      postBy: postByP ? postByP?.join(',') : '',
      investors: investorsP ? investorsP?.join(',') : '',
      projects: projectsP ? projectsP?.join(',') : '',
      status: statusP ? statusP?.join(',') : '',
      subStatus: subStatusP ? subStatusP?.join(',') : '',
      priceFrom: priceRangeUrl?.length > 0 ? priceRangeUrl[0] : '',
      priceTo: priceRangeUrl?.length > 0 ? priceRangeUrl[1] : '',
      areaFrom: acreageRangeUrl ? acreageRangeUrl[0] : '',
      areaTo: acreageRangeUrl ? acreageRangeUrl[1] : '',
      isPostByVARS: isPostByVARS ? isPostByVARS : false,
      isOutstanding: isOutstanding ? isOutstanding : false,
    });

    setMapDataObj({
      ...mapDataObj,
      types: [typeUrl],
      searchText: searchText ? searchText : '',
      subTypes: subTypes ? subTypes : [],
      provinceCodes: provinceIdUrl ? [provinceIdUrl] : [],
      districtCodes: locationInfo?.district
        ? [locationInfo?.district?.code]
        : [],
      wardCodes: locationInfo?.ward ? [locationInfo?.ward?.code] : [],
      provinceText: listProvinces ? listProvinces?.name : '',
      districtText: locationInfo?.district ? locationInfo?.district?.name : '',
      wardText: locationInfo?.ward ? locationInfo?.ward?.name : '',
      bedrooms: bedrooms ? bedrooms : [],
      directions: directionsP ? directionsP : [],
      postBy: postByP ? postByP : [],
      investors: investorsP ? investorsP : [],
      projects: projectsP ? projectsP : [],
      status: statusP ? statusP : [],
      subStatus: subStatusP ? subStatusP : [],
      priceFrom: priceRangeUrl?.length > 0 ? priceRangeUrl[0] : null,
      priceTo: priceRangeUrl?.length > 0 ? priceRangeUrl[1] : null,
      areaFrom: acreageRangeUrl ? acreageRangeUrl[0] : null,
      areaTo: acreageRangeUrl ? acreageRangeUrl[1] : null,
      isPostByVARS: isPostByVARS ? isPostByVARS : false,
      isOutstanding: isOutstanding ? isOutstanding : false,
    });

    if (!switchMap) {
      setIsReload(true);
    }

    const priceFrom = priceRangeUrl?.length > 0 ? priceRangeUrl[0] : '';
    const priceTo = priceRangeUrl?.length > 0 ? priceRangeUrl[1] : '';

    let priceLable = '';
    if (priceFrom === 0 && priceTo === 0) {
      priceLable = messages['common.all'];
    }
    if (priceFrom == -1 && priceTo == -1) {
      priceLable = '-1';
    }
    if (priceFrom === '' && priceTo === '') {
      priceLable = '';
    }
    if (
      priceFrom !== '' &&
      priceTo !== '' &&
      priceFrom !== null &&
      priceTo !== null &&
      Number(priceFrom) !== -1 &&
      Number(priceTo) !== -1
    ) {
      const priceHead = realEstatePriceFilterCat?.find((item) => {
        return (
          item?.parent === typeUrl &&
          item?.metadata === priceRangeUrl?.join('-')?.toString()
        );
      });

      priceLable = priceHead
        ? priceHead?.name
        : `${nFormatterPriceCustom(priceFrom)} - ${nFormatterPrice(priceTo)}`;
    }

    let priceSidebar = '';
    if (priceRangeUrl[0] == -1 && priceRangeUrl[1] == -1) {
      priceSidebar = '-1';
    } else {
      priceSidebar = `${priceRangeUrl ? priceRangeUrl[0]?.toString() : ''}-${
        priceRangeUrl ? priceRangeUrl[1]?.toString() : ''
      }`;
    }

    form.setFieldsValue({
      postTypeHeader: typescode,
      subPostTypeHeader: subTypes ?? undefined,
      postTypesForm: typescode,
      realTypes: subTypes ? subTypes : [],
      searchTextHeader: searchText,
      priceHeader: priceLable,
      priceSidebar: priceSidebar,
      text_location_head:
        (locationInfo?.ward?.name ? locationInfo?.ward?.name + ', ' : '') +
        (locationInfo?.district?.name
          ? locationInfo?.district?.name + ', '
          : '') +
        (listProvinces?.name || messages['common.nationwide']),
    });

    setObjLocation({
      provinceCode: provinceIdUrl,
      districtCode: locationInfo?.district?.code,
      wardCode: locationInfo?.ward?.code,
    });
  }, []);

  const fetchAPI = async () => {
    setIsLoading(true);
    const cookieLang = getCookies('lang');
    const cloneObject = {};
    Object?.keys(dataObject)?.forEach((key) => {
      let typeOf = typeof dataObject[key];
      cloneObject[key] =
        typeOf == 'object' && dataObject[key]
          ? dataObject[key]?.join()
          : dataObject[key];
    });
    const resultData = await onSearchPost(cloneObject, accessToken, cookieLang);
    const itemPost = resultData?.data?.elements ?? [];
    setIsReload(false);
    setIsLoading(false);
    setItemPost(itemPost);
    const total = resultData?.data?.total ?? '';
    setTotal(total);
  };

  useEffect(() => {
    if (isReload) {
      fetchAPI();
    }
  }, [isReload]);

  // Handle On Change Params
  const onChangeSearchParam = (objectParams) => {
    const newDataObject = {
      ...dataObject,
      ...objectParams,
    };
    setDataObject(newDataObject);
  };

  const onChangeMapSearchParam = (objectParams) => {
    const newDataObject = {
      ...mapDataObj,
      ...objectParams,
    };
    setMapDataObj(newDataObject);
  };

  const handleDisplayView = () => {
    setDisplayView(!displayView);
    setSwitchMap(false);
    setOpenFullMap(false);
  };

  useEffect(() => {
    if (openFullMap) {
      dispatch(onHideFooter(true));
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      document.getElementsByTagName('html')[0].classList.add('no-scroll');
    } else {
      dispatch(onHideFooter(false));
      document.getElementsByTagName('html')[0].classList.remove('no-scroll');
    }
  }, [openFullMap]);

  useEffect(() => {
    if (isReload) {
      const isChecked = dataObject?.isPostByVARS;
      form.setFieldsValue({
        postByVARSTitle: /true/.test(isChecked),
      });
    }
  }, [isReload, dataObject]);

  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `T${month}/${year}`;
  };

  const handleSwitchMap = (checked) => {
    setSwitchMap(checked);
    if (checked) {
      // const updatedQuery = {...router.query, isMap: checked};
      // router.push({pathname: router.pathname, query: updatedQuery}, undefined, {
      //   shallow: true,
      // });

      const convertSubType =
        mapDataObj?.subTypes != ''
          ? mapDataObj?.subTypes?.toString()?.split(',')
          : [];
      setMapDataObj({
        ...mapDataObj,
        subTypes: convertSubType,
      });
    } else {
      // const {isMap, ...remainingQuery} = router.query;
      // router.push(
      //   {pathname: router.pathname, query: remainingQuery},
      //   undefined,
      //   {shallow: true},
      // );
      setDataObject({
        ...dataObject,
      });
      setIsReload(true);
      setTriggerZoom(false);
    }
  };

  const titleMain = title ? `${title} - ${getCurrentMonthYear()}` : titleSeo;

  // console.log('itemPost', itemPost);
  // console.log('postCate', postsCate);

  return (
    <>
      <Head>
        <title>
          {titleMain
            ? titleMain
            : 'VARs Land - Website số 1 về bất động sản - Mua bán, cho thuê, M&A nhà đất toàn quốc'}
        </title>
        <link rel='canonical' href={url} />
        <meta name='generator' content='VARS CONNECT' />
        <meta name='robots' content='index, follow' />
        <meta
          name='keywords'
          content='vars land, bất động sản, mua bán bất động sản, cho thuê bất động sản, mua bán nhà đất, m&a'
        />
        <meta property='og:type' content='website' />
        <meta
          name='description'
          content='Vars Land - Chuyên trang mua bán nhà đất, nền tảng đăng tin bất động sản mua bán, cho thuê nhà đất, dự án, căn hộ chung cư, văn phòng, M&A nhà đất uy tín hàng đầu Việt Nam.'
        />
        <meta property='og:url' content={url} />
        <meta
          property='og:title'
          content={
            titleMain
              ? titleMain
              : 'VARs Land - Website số 1 về bất động sản - Mua bán, cho thuê, M&A nhà đất toàn quốc'
          }
        />
        <meta
          property='og:description'
          content='Vars Land - Chuyên trang mua bán nhà đất, nền tảng đăng tin bất động sản mua bán, cho thuê nhà đất, dự án, căn hộ chung cư, văn phòng, M&A nhà đất uy tín hàng đầu Việt Nam.'
        />
        <meta property='og:image' itemProp='thumbnailUrl' content={Logo.src} />
        <meta
          property='og:image:alt'
          content={
            titleMain
              ? titleMain
              : 'VARs Land - Website số 1 về bất động sản - Mua bán, cho thuê, M&A nhà đất toàn quốc'
          }
        />
        <meta property='og:image:width' content='800' />
        <meta property='og:image:height' content='400' />
      </Head>
      <div
        className={`search ${displayView ? 'active' : ''} ${
          switchMap ? 'swich-map' : 'swich-post'
        } ${openFullMap ? 'full-map' : ''} `}
      >
        <HeaderSearch
          onChangeSearchParam={onChangeSearchParam}
          dataObject={dataObject}
          setDataObject={setDataObject}
          setIsReload={setIsReload}
          isReload={isReload}
          setProvinces={setProvinces}
          setCurrentPage={setCurrentPage}
          setSwitchMap={setSwitchMap}
          switchMap={switchMap}
          onChangeMapSearchParam={onChangeMapSearchParam}
          form={form}
          setMapDataObj={setMapDataObj}
          mapDataObj={mapDataObj}
          map={map}
          setIsReloadMap={setIsReloadMap}
          setTriggerZoom={setTriggerZoom}
          searchParam={searchParam}
          isReloadMap={isReloadMap}
          subTypeFilterCats={subTypeFilterCats}
          postTypeFilterCats={postTypeFilterCats}
          provincesFilter={provincesFilter}
          handleDisplayView={handleDisplayView}
          setObjLocation={setObjLocation}
          objLocation={objLocation}
          openFullMap={openFullMap}
          onChangeParamUrl={onChangeParamUrl}
          handleSwitchMap={handleSwitchMap}
        />
        <div className='container container-full'>
          <Row gutter={[0, 16]}>
            {!openFullMap && (
              <Col xs={24} className='view-breadcrumbs'>
                <Breadcrumbs
                  dataObject={dataObject}
                  setDataObject={setDataObject}
                  mapDataObj={mapDataObj}
                  setMapDataObj={setMapDataObj}
                  isReload={isReload}
                  isReloadMap={isReloadMap}
                  total={total}
                  switchMap={switchMap}
                  objLocation={objLocation}
                />
              </Col>
            )}
            <Col xs={24}>
              <Row gutter={[16, 0]}>
                <Col xs={24} md={!openFullMap ? 18 : 24} className='view-main'>
                  <Row gutter={[0, 16]}>
                    {!openFullMap && (
                      <Col xs={24} className='view-control'>
                        <div
                          className={`title-view-control ${
                            displayView ? 'layout-grid' : 'layout-list'
                          } `}
                        >
                          <TitleSearch
                            title={title}
                            setTitle={setTitle}
                            provinces={provinces}
                            dataObject={dataObject}
                            setDataObject={setDataObject}
                            setMapDataObj={setMapDataObj}
                            mapDataObj={mapDataObj}
                            total={total}
                            setDisplayView={setDisplayView}
                            displayView={displayView}
                            setIsReload={setIsReload}
                            setIsReloadMap={setIsReloadMap}
                            isReload={isReload}
                            setCurrentPage={setCurrentPage}
                            onChangeSearchParam={onChangeSearchParam}
                            onChangeMapSearchParam={onChangeMapSearchParam}
                            handleDisplayView={handleDisplayView}
                            switchMap={switchMap}
                            setSwitchMap={setSwitchMap}
                            isReloadMap={isReloadMap}
                            form={form}
                            setTriggerZoom={setTriggerZoom}
                            handleSwitchMap={handleSwitchMap}
                          />
                        </div>
                      </Col>
                    )}

                    {switchMap ? (
                      <Col xs={24}>
                        <MapView
                          dataObject={dataObject}
                          setDataObject={setDataObject}
                          setDisplayView={setDisplayView}
                          displayView={displayView}
                          mapDataObj={mapDataObj}
                          setMapDataObj={setMapDataObj}
                          map={map}
                          setMap={setMap}
                          form={form}
                          setIsReloadMap={setIsReloadMap}
                          isReloadMap={isReloadMap}
                          triggerZoom={triggerZoom}
                          setTriggerZoom={setTriggerZoom}
                          setOpenFullMap={setOpenFullMap}
                          openFullMap={openFullMap}
                          setTotal={setTotal}
                          switchMap={switchMap}
                        />
                      </Col>
                    ) : (
                      <>
                        <Col xs={24}>
                          <div
                            className={`load-item-taxonomy ${
                              displayView ? 'layout-grid' : 'layout-list'
                            } `}
                          >
                            <BoxItem
                              itemPost={itemPost}
                              isLoading={isLoading}
                            />
                          </div>
                        </Col>
                        <Col xs={24}>
                          <Paginations
                            dataObject={dataObject}
                            setDataObject={setDataObject}
                            total={total}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setIsReload={setIsReload}
                          />
                        </Col>

                        {/* Ads GG */}
                        {GOOGLE_ADS_ENABLED && (
                          <Col xs={24} className='mb-24'>
                            <div className='banner-ngang'>
                              <AdsBanner
                                style={{display: 'block'}}
                                data-ad-slot='5370250988'
                                data-ad-format='auto'
                                data-full-width-responsive='true'
                              />
                            </div>
                          </Col>
                        )}
                      </>
                    )}
                  </Row>
                </Col>
                {!openFullMap && (
                  <Col xs={24} md={6} className='view-sidebar'>
                    <Sidebar
                      dataObject={dataObject}
                      mapDataObj={mapDataObj}
                      setMapDataObj={setMapDataObj}
                      form={form}
                      switchMap={switchMap}
                      setDataObject={setDataObject}
                      onChangeMapSearchParam={onChangeMapSearchParam}
                      onChangeSearchParam={onChangeSearchParam}
                      setIsReloadMap={setIsReloadMap}
                      setIsReload={setIsReload}
                      setCurrentPage={setCurrentPage}
                      setObjLocation={setObjLocation}
                      objLocation={objLocation}
                    />
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {openModal && (
        <AppModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          title={modalData.title}
          className={modalData.className}
          description={modalData.description}
          width={modalData.width}
          submitText={modalData.submitText}
          closeText={modalData.closeText}
          handleSubmit={modalData.handleSubmit}
          handleClose={modalData.handleClose}
        />
      )}
    </>
  );
};

export default React.memo(SearchComponent);
SearchComponent.propTypes = {
  searchParam: PropsTypes.any,
  postsCate: PropsTypes.any,
  totalPost: PropsTypes.number,
  url: PropsTypes.any,
  titleSeo: PropsTypes.any,
};
