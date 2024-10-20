import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import {toggleNavCollapsed} from '../../../../../redux/actions';
import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from '../../components/AppLogo';
import {Button, Menu} from 'antd';
import {useRouter} from 'next/router';
import {onChangeSubType} from 'redux/actions/Project';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {generateCode} from 'shared/GenerateCode';
import {
  URL_CMS_SERVER,
  APP_CODE,
  CLIENT_ID,
  CLIENT_SECRET,
  URL_REDIRECT_TO_SSO,
} from 'shared/constants/ConfigApp';
import Loading from 'components/Loading';
import {useRef} from 'react';
import {onLoadingApp} from 'redux/actions/LoadingApp';
import {onHideFooter} from 'redux/actions/HideFooter';
import {setPostTypeText} from 'redux/actions/PostType';
import {makePersistKey} from '@crema/utility/Utils';
import AppLanguageSwitcher from '@crema/core/AppLanguageSwitcher';
import IntlMessages from '@crema/utility/IntlMessages';
import AppUserInfo from '../../components/AppUserInfo';
import AppNotification from '../../components/AppNotification';
import {useIntl} from 'react-intl';
import {typesReplaceConvertMapping} from 'shared/constants/AppConst';
import {redirectToSSOFunc} from '@crema/utility/LoginRedirect';

const AppHeader = () => {
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const router = useRouter();
  const loadingApp = useSelector((state) => state.loadingApp?.isLoadingApp);
  const {categories} = useSelector((state) => state.categories);
  const [current, setCurrent] = useState('');
  const [newRouteConfig, setNewRouteConfig] = useState([]);
  const pathname = router.pathname?.split('/')[1];
  const {isAuthenticated, profile, accessToken} = useSelector(({auth}) => auth);
  const {postTypeText} = useSelector((state) => state.postTypeText);
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState(null);
  const [typeCat, setTypeCat] = useState([]);
  const [isUserActive, setIsUserActive] = useState(true);
  const [isLangActive, setIsLangActive] = useState(true);
  const popupRef = useRef(null);
  const contextPath = process.env.CONTEXT_PATH;

  const asPathSlug = router.asPath.split('?')[0];
  const asPathCurrent = asPathSlug.split('/')[1];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsUserActive(true);
        setIsLangActive(true);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserActive, isLangActive]);

  useEffect(() => {
    if (asPathSlug) {
      const realEstateTypeCat = categories?.categories?.realEstateTypeCat ?? [];
      const subType = asPathCurrent?.split('-tai-')[0];
      const type = asPathCurrent?.split('-tai-')[0];
      const supTypeCode = realEstateTypeCat?.find(
        (item) => item?.fields?.slug === subType,
      );
      const postType =
        typesReplaceConvertMapping[asPathCurrent] ||
        supTypeCode?.parent ||
        typesReplaceConvertMapping[type] ||
        '';

      setCurrent(postType);
      dispatch(setPostTypeText(postType));
    }
  }, [asPathSlug]);

  useEffect(() => {
    if (postTypeText) {
      setCurrent(postTypeText);
    }
  }, [postTypeText]);

  useEffect(() => {
    if (categories) {
      const menuConfig =
        categories?.configurations?.webHeaderConfig?.mainMenu || [];
      const logoConfig =
        categories?.configurations?.webHeaderConfig?.homeIcon || [];
      const realEstateTypeCat = categories?.categories?.realEstateTypeCat ?? [];
      setLogo(logoConfig);
      setMenus(menuConfig);
      setTypeCat(realEstateTypeCat);
    }
  }, [categories]);

  const handleClickMenu = (e) => {
    // setCurrent(e.key);
    const isChangeSubType = true;
    const subType = e?.key;
    dispatch(onChangeSubType({isChangeSubType, subType}));
  };

  // handle LoadingApp
  const handleLoadingApp = (e) => {
    dispatch(onLoadingApp(true));
    dispatch(onHideFooter(false));
    setTimeout(() => {
      dispatch(onLoadingApp(false));
    }, [2000]);
  };

  // const handleLogin = () => {
  //   const urlObj = new URL(window.location.href);
  //   urlObj.hash = '';
  //   window.history.pushState('', '', urlObj);
  //   const redirectTo = window.location.href.replace(/\/$/, '');
  //   const code = generateCode();
  //   const codeVerifier = code.codeVerifier;
  //   localStorage.setItem(makePersistKey('codeVerifier'), codeVerifier);
  //   const codeChallenge = code.codeChallenge;
  //   const url = `${URL_REDIRECT_TO_SSO}?redirectTo=${redirectTo}&appCode=${APP_CODE}&clientId=${CLIENT_ID}&clientSecret=${CLIENT_SECRET}&codeChallenge=${codeChallenge}`;
  //   window.location.replace(url);
  // };

  const handleToggleUser = () => {
    setIsUserActive(!isUserActive);
    setIsLangActive(true);
  };

  const handleToggleLang = () => {
    setIsLangActive(!isLangActive);
    setIsUserActive(true);
  };

  // Convert to format Menu Ant
  const routesConfigCustom = [];
  menus?.forEach((ele) => {
    let eleOption = '';
    eleOption = {
      label: (
        <a
          href={
            ele?.type === 'post-type'
              ? ele?.url
              : ele?.type === 'href'
              ? ele?.url
              : '#'
          }
          target={ele?.type === 'href' ? '_blank' : ''}
          rel='noreferrer'
          title={ele?.label}
        >
          {ele?.label}
        </a>
      ),
      key: ele?.key,
      children: ele?.children ? ele?.children : null,
    };
    routesConfigCustom.push(eleOption);
  });

  // Get value child menu
  const showMenuHeader = () => {
    let routeConfig = routesConfigCustom;
    let items = typeCat;
    for (let index = 0; index < routesConfigCustom?.length; index++) {
      let results = items?.filter(
        (item) => item?.parent == routesConfigCustom[index]?.key,
      );
      let childrens = handleResultChild(results);
      let childSub = [];
      // let child = [...(routeConfig[index]?.children || [])];
      // child?.forEach((item) => {
      //   delete item['children'];
      //   let option = {
      //     label: (
      //       <a
      //         href={`${item?.href}`}
      //         target='_blank'
      //         rel='noopener noreferrer'
      //         title={item?.label}
      //       >
      //         {item?.label}
      //       </a>
      //     ),
      //     key: item?.key,
      //   };
      //   childSub?.push(option);
      // });
      let newChild = [...childrens, ...childSub];
      if (newChild?.length > 0) {
        routeConfig[index].children = newChild;
      }
    }
    setNewRouteConfig(routeConfig);
  };

  const handleResultChild = (results) => {
    let resultChild = [];
    results?.forEach((ele) => {
      let childen = {
        label: (
          <a
            href={`/${ele?.fields?.slug}`}
            title={ele?.fields?.menuName}
            className={ele?.code}
          >
            {ele?.fields?.menuName}
          </a>
        ),
        key: ele?.code,
      };
      resultChild?.push(childen);
    });
    return resultChild?.length == 0 ? '' : resultChild;
  };
  useEffect(() => {
    if (menus) {
      showMenuHeader();
    }
  }, [menus]);

  const handlePost = () => {
    if (!isAuthenticated) redirectToSSOFunc();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        const nextData = document.getElementById('__NEXT_DATA__');
        if (nextData) {
          nextData.remove();
        }
      });
    }
  }, []);

  return (
    <AppBar
      position='relative'
      color='inherit'
      sx={{
        boxShadow: 'none',
        borderBottom: '0.5px solid #bdbdbd52',
        width: {
          xs: '100%',
        },
      }}
      className='app-bar header'
    >
      <Toolbar className='app-bar-header'>
        <AppLogo logo={logo} />

        <Hidden lgUp>
          <IconButton
            sx={{color: 'text.secondary'}}
            edge='start'
            className='menu-btn'
            color='inherit'
            aria-label='open drawer'
            onClick={() => dispatch(toggleNavCollapsed())}
            size='large'
          >
            <MenuIcon
              sx={{
                width: 35,
                height: 35,
              }}
            />
          </IconButton>
        </Hidden>
        <Menu
          className='list-menu'
          selectedKeys={[current]}
          mode='horizontal'
          items={newRouteConfig}
          onClick={handleClickMenu}
        />
        <Box
          className='mobile-none'
          sx={{
            flexGrow: 1,
          }}
        />
        <Box sx={{ml: 4}} className='mobile-none'>
          <Hidden smDown>
            <div ref={popupRef} className='header-button'>
              <>
                <Button
                  className='btn-post btn-main'
                  type='primary'
                  size='large'
                  href={
                    isAuthenticated &&
                    `${URL_CMS_SERVER}/post/management?sb=true`
                  }
                  target='_blank'
                  onClick={handlePost}
                >
                  <IntlMessages id={`common.postNews`} />
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                  >
                    <path
                      d='M8.00065 1.33301V14.6663M14.6673 7.99967C14.6673 7.99967 7.19185 7.99967 1.33398 7.99967'
                      stroke='#FEFEFE'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    />
                  </svg>
                </Button>
                {isAuthenticated && <AppNotification />}
                {!isAuthenticated ? (
                  <Button
                    size='large'
                    onClick={redirectToSSOFunc}
                    className='login'
                  >
                    <IntlMessages id={`common.loginRegister`} />
                  </Button>
                ) : (
                  <AppUserInfo
                    handleToggleUser={handleToggleUser}
                    isUserActive={isUserActive}
                  />
                )}
                <AppLanguageSwitcher
                  isFooterDisplay={false}
                  handleToggleLang={handleToggleLang}
                  isLangActive={isLangActive}
                />
              </>
            </div>
          </Hidden>
        </Box>
      </Toolbar>

      {/* Loading App */}
      <Loading loadingApp={loadingApp} />
    </AppBar>
  );
};
export default AppHeader;
