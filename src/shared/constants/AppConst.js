import {
  FooterType,
  LayoutType,
  MenuStyle,
  NavStyle,
  ThemeDirection,
  ThemeMode,
  ThemeStyle,
} from './AppEnums';
import {getCookie} from 'cookies-next';

export const authRole = {
  admin: ['admin'],
  user: ['user', 'admin'],
};

export const RoutePermittedRole = {
  admin: 'admin',
  user: 'user',
};
export const defaultUser = {
  displayName: 'John Alex',
  email: 'demo@example.com',
  token: 'access-token',
  role: 'user',
  photoURL: '/assets/images/avatar/A11.jpg',
};
export const initialUrl = '/'; // this url will open after login

export const appConfig = {
  sidebar: {
    borderColor: 'transparent',
    menuStyle: MenuStyle.CURVED_MENU,
    isSidebarBgImage: false,
    sidebarBgImage: null,
    colorSet: {
      sidebarBgColor: 'var(--sidebar-bg)',
      sidebarHeaderColor: 'var(--sidebar-bg)',
      sidebarTextColor: '#fff',
      sidebarMenuSelectedBgColor: 'var(--sidebar-selected-bg)',
      sidebarMenuSelectedTextColor: '#fff',
      mode: ThemeMode.LIGHT,
    },
  },
  themeStyle: ThemeStyle.STANDARD,
  direction: ThemeDirection.LTR,
  themeMode: ThemeMode.SEMI_DARK,
  footerType: FooterType.FLUID,
  navStyle: NavStyle.USER_STANDARD,
  layoutType: LayoutType.FULL_WIDTH,
  footer: false,
  rtlLocale: ['ar'],
  localeContext: {
    locale: 'vi',
  },
};

export const languageData = [
  {
    languageId: 'vi',
    locale: 'vi',
    name: 'Tiếng việt',
    icon: 'vi',
  },
  {
    languageId: 'en',
    locale: 'en',
    name: 'English',
    icon: 'en',
  },
];

export const dateFormat = 'DD/MM/YYYY';
export const apiTimeout = 20000;
export const apiHeaders = {
  'Content-Type': 'application/json',
  Accept: '*/*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, *',
  'Accept-Language': 'vi',
};

export const getWebTokenFromCookie = () => {
  return getCookie('varsTkWeb');
};
export const getTitleSeoFromCookie = () => {
  return getCookie('titleSeo');
};

export const convertPriceToNumber = (value, unit) => {
  if (unit === 'trieu') {
    return parseInt(value) * 1000000;
  } else if (unit === 'ty') {
    return parseInt(value) * 1000000000;
  }
  return parseInt(value); // Trường hợp không có đơn vị "trieu" hay "ty"
};

export const formatCurrency = (value) => {
  if (value < 1000000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}-trieu`;
  } else {
    return `${(value / 1000000000).toFixed(1).replace(/\.0$/, '')}-ty`;
  }
};

export const nFormatterPriceCustom = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '');
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '');
  }
  return num;
};

export const combineStringParamsUrl = (params) => {
  if (!params) return;
  let typeUrl = '';
  let subTypesUrl = '';
  let areaLocationUrl = ''; // Khu vực
  let provinceIdUrl = '';
  let priceRangeUrl = '';
  let acreageRangeUrl = ''; // Diện tích
  let bedroomUrl = '';
  const param1 = params[0] || '';
  const param2 = params[1] || '';

  if (param1) {
    const customParam1 = param1?.split('?');
    if (param1?.includes('mua-ban-nha-dat')) {
      typeUrl = 'ban';
    } else if (param1?.includes('cho-thue-nha-dat')) {
      typeUrl = 'cho-thue';
    } else if (customParam1[0] === 'du-an') {
      typeUrl = 'du-an';
    } else if (param1?.includes('m-a')) {
      typeUrl = 'm-a';
    } else {
      const [firstPart, ...restCluster1] = param1?.split('-bds-');
      typeUrl = firstPart;
      if (restCluster1?.length > 0) {
        const restJoined = restCluster1?.join('-');
        if (restJoined?.includes('-tai-')) {
          [subTypesUrl, areaLocationUrl] = restJoined?.split('-tai-');
        } else {
          subTypesUrl = restJoined;
        }
      }
    }

    // Lấy areaLocation từ param1
    const locationParts = param1?.split('-');
    const locationIndex = locationParts?.indexOf('tai');
    if (locationIndex !== -1) {
      areaLocationUrl = locationParts
        ?.slice(locationIndex + 1, locationParts.indexOf('t', locationIndex))
        ?.join('-');
    }

    // Lấy provinceId từ param1
    const provinceIdMatch = param1?.match(/-t(\d+)/);
    if (provinceIdMatch) {
      provinceIdUrl = provinceIdMatch[1];
    }
  }

  if (param2) {
    const parts = param2.split('-');
    // Xử lý giá
    const priceIndex = parts.indexOf('gia');
    if (priceIndex !== -1) {
      if (parts[priceIndex + 1] === 'duoi') {
        const value = convertPriceToNumber(
          parts[priceIndex + 2],
          parts[priceIndex + 3],
        );
        priceRangeUrl = `0-${value}`;
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
        priceRangeUrl = `${fromValue}-${toValue}`;
      }
    }
    // Xử lý diện tích
    const dtIndex = parts.indexOf('dt');
    if (dtIndex !== -1) {
      if (parts[dtIndex + 1] === 'duoi') {
        acreageRangeUrl = `0-${parts[dtIndex + 2].replace('m2', '')}`;
      } else if (parts[dtIndex + 1] === 'tu' && parts[dtIndex + 3] === 'den') {
        acreageRangeUrl = `${parts[dtIndex + 2].replace('m2', '')}-${parts[
          dtIndex + 4
        ].replace('m2', '')}`;
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
    provinceIdUrl,
    priceRangeUrl,
    acreageRangeUrl,
    bedroomUrl,
  };
};

export function formatPrice(price) {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1).replace(/\.0$/, '')}-ty`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1).replace(/\.0$/, '')}-trieu`;
  } else {
    return `${price}`; // Trường hợp giá trị nhỏ hơn triệu đồng
  }
}

export const filterOptionSearch = (input, option) => {
  const removeAccents = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };
  const normalizedInput = removeAccents(input.toLowerCase());
  const normalizedLabel = removeAccents(option.label.toLowerCase());
  return normalizedLabel.includes(normalizedInput);
};

export const typesShortMapping = {
  mua: 'bds-ban',
  ban: 'bds-ban',
  'cho-thue': 'bds-cho-thue',
  'du-an': 'du-an',
  'm-a': 'm-a',
};

export const typesReplaceMapping = {
  'bds-ban': 'mua-ban-nha-dat',
  'bds-cho-thue': 'cho-thue-nha-dat',
  'du-an': 'du-an-bat-dong-san',
  'm-a': 'm-a-bat-dong-san',
};
export const typesReplaceConvertMapping = {
  'mua-ban-nha-dat': 'bds-ban',
  'cho-thue-nha-dat': 'bds-cho-thue',
  'du-an-bat-dong-san': 'du-an',
  'm-a-bat-dong-san': 'm-a',
};

export const typesShortReplaceMapping = {
  'bds-ban': 'ban',
  'bds-cho-thue': 'cho-thue',
  'du-an': 'du-an',
  'm-a': 'm-a',
};
