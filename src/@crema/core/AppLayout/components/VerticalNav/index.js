import React, {useState, useEffect} from 'react';
import {Avatar, Button, Menu} from 'antd';
import {useRouter} from 'next/router';
import {onChangeSubType} from 'redux/actions/Project';
import {useDispatch, useSelector} from 'react-redux';
import {onLogOut, toggleNavCollapsed} from 'redux/actions';
import IntlMessages from '@crema/utility/IntlMessages';
import NoThumb from 'assets/img/EmptyAvatar.png';
import {URL_API} from 'shared/constants/ConfigApp';
import axios from 'axios';
import {deleteCookie} from 'cookies-next';
import {redirectToSSOFunc} from '@crema/utility/LoginRedirect';

const VerticalNav = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {categories} = useSelector((state) => state.categories);
  const [current, setCurrent] = useState('home');
  const [newRouteConfig, setNewRouteConfig] = useState([]);
  const pathname = router.pathname?.split('/')[1];
  const [typeCat, setTypeCat] = useState([]);
  const [menus, setMenus] = useState([]);
  const {isAuthenticated, profile, accessToken} = useSelector(({auth}) => auth);

  useEffect(() => {
    setCurrent(pathname);
  }, []);

  useEffect(() => {
    if (categories) {
      const menuConfig =
        categories?.configurations?.webHeaderConfig?.mainMenu || [];
      const realEstateTypeCat = categories?.categories?.realEstateTypeCat ?? [];
      setMenus(menuConfig);
      setTypeCat(realEstateTypeCat);
    }
  }, [categories]);

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

  const handleLogOut = async () => {
    const result = await axios.post(`${URL_API}/vid/api/auth/logout/all`, {
      sessionToken: accessToken,
    });
    if (result?.data?.code == 200) {
      dispatch(onLogOut());
      deleteCookie('varsTkWeb');
      window.location.replace(router?.asPath);
    }
  };
  return (
    <>
      <Menu
        className='list-menu'
        selectedKeys={[current]}
        mode='inline'
        items={newRouteConfig}
        onClick={(e) => {
          const isChangeSubType = true;
          const subType = e?.key;
          dispatch(onChangeSubType({isChangeSubType, subType}));
        }}
      />
      <div
        style={{
          paddingLeft: '24px',
          borderTop: '.5px solid #bdbdbd45',
          paddingTop: '16px',
        }}
      >
        {!isAuthenticated ? (
          <Button size='large' onClick={redirectToSSOFunc} className='login'>
            <IntlMessages id={`common.loginRegister`} />
          </Button>
        ) : (
          <>
            <div className='profile-highlight d-flex' style={{gap: '8px'}}>
              <Avatar
                style={{flex: 'none'}}
                src={profile?.avatar ? profile?.avatar : NoThumb.src}
                size={40}
                onClick={(e) => e.preventDefault()}
              />
              <div className='details'>
                <div id='profile-name' className='limit-text limit-text-1'>
                  {profile?.fullName}
                </div>
                <div
                  id='profile-footer'
                  className='limit-text limit-text-1'
                  style={{wordBreak: 'break-word'}}
                >
                  {profile?.email}
                </div>
              </div>
            </div>
            <div
              className='btn-logout user-logout'
              style={{paddingLeft: '3rem', paddingTop: '4px'}}
              onClick={handleLogOut}
            >
              <p>
                <IntlMessages id={`common.logout`} />
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VerticalNav;
