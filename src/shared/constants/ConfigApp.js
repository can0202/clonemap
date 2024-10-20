// Local Storage Prefix Key
export const PERSIST_PREFIX_KEY = 'landPersist:';

// API URL
export const URL_API = 'https://api-test.vars.vn';
export const URL_API_NEW = 'https://api-test.vars.vn';
export const URL = 'https://test.varsland.vn';

// URL SERVER
export const URL_CMS_SERVER = 'https://test.varsland.vn/cms';
export const URL_AUTH_SSO = 'https://id-test.varsland.vn';
export const URL_NEW = 'https://varsland.vn/news';

// Config server
export const APP_CODE = 'VARS_LAND';
export const CLIENT_ID = 'e5531fec452c4d97be7da37902273368';
export const CLIENT_SECRET = 'b6ab70eb1b784c888bf9dccc1af0c2f9';
export const URL_REDIRECT_TO_SSO = URL_AUTH_SSO + '/vid/web/signin/otp';
export const URL_AUTH_AJAX_SSO = URL_AUTH_SSO + '/vid/ajax/auth/me';

// LIST MENU LOGED
import iconUser from 'assets/user/user.png';
import iconUserEdit from 'assets/user/user-edit.png';
import iconLogout from 'assets/user/lock.png';
export const USER_ACCOUNT_SSO = [
  {
    id: 'vmenu-my-account',
    icon: iconUser,
    text: 'Thông tin tài khoản',
    url: 'https://test.varsland.vn/cms/user/information',
  },
  {
    id: 'vmenu-my-profile',
    icon: iconUserEdit,
    text: 'Trang đại diện',
    url: 'https://test.varsland.vn/cms/user/representative',
  },
  {
    id: 'vmenu-change-password',
    icon: iconLogout,
    text: 'Đổi mật khẩu',
    url: 'https://test.varsland.vn/cms/user/password',
  },
];

// Config Google Service
export const GOOGLE_ANALYTIC_ENABLED = false;
export const GOOGLE_ADS_ENABLED = true;
export const GOOGLE_MANAGER_ENABLED = true;
