import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import Settings from './Setting';
import Common from './Common';
import Dashboard from './Dashboard';
import ToDoApp from './ToDoApp';
import MailApp from './MailApp';
import ContactApp from './ContactApp';
import ScrumboardApp from './ScrumboardApp';
import Ecommerce from './Ecommerce';
import ChatApp from './ChatApp';
import Wall from './Wall';
import UserList from './UserList';
import AllCategories from './AllCategories';
import Provinces from './Provinces';
import Project from './Project';
import HideFooter from './HideFooter';
import LoadingApp from './LoadingApp';
import Auth from './Auth';
import Filters from './Filters';
import PostType from './PostType';
import App from './App';
import Location from './Location';
import {PERSIST_PREFIX_KEY} from 'shared/constants/ConfigApp';

const authPersistConfig = {
  keyPrefix: PERSIST_PREFIX_KEY,
  key: 'auth',
  storage,
  blacklist: [''],
  whitelist: [
    'accessToken',
    'refreshToken',
    'profile',
    'isAuthenticated',
    'currentAccount',
    'loginRedirectTo',
    'loginRedirectToParam',
    'showedRenewNotify',
    'localeLanguage',
  ],
};

const categoryPersistConfig = {
  keyPrefix: PERSIST_PREFIX_KEY,
  key: 'category',
  storage,
};
const locationPersistConfig = {
  keyPrefix: PERSIST_PREFIX_KEY,
  key: 'location',
  storage,
  blacklist: [''],
  whitelist: ['location', 'localeLanguage'],
};

const appPersistConfig = {
  key: 'app',
  storage,
  blacklist: [''],
  whitelist: ['loadingApp'],
};

const reducers = combineReducers({
  settings: Settings,
  dashboard: Dashboard,
  common: Common,
  todoApp: ToDoApp,
  mailApp: MailApp,
  userList: UserList,
  contactApp: ContactApp,
  scrumboardApp: ScrumboardApp,
  ecommerce: Ecommerce,
  chatApp: ChatApp,
  wall: Wall,
  categories: persistReducer(categoryPersistConfig, AllCategories),
  provinces: Provinces,
  project: Project,
  hideFooter: HideFooter,
  loadingApp: LoadingApp,
  filter: Filters,
  postTypeText: PostType,
  app: persistReducer(appPersistConfig, App),
  auth: persistReducer(authPersistConfig, Auth),
  location: persistReducer(locationPersistConfig, Location),
});
export default reducers;
