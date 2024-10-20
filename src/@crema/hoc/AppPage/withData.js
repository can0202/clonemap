import React, {useEffect} from 'react';
import Router, {useRouter} from 'next/router';
import AppLoader from '../../core/AppLoader';
import {useAuthUser} from '../../utility/AuthHooks';
import DetailComponent from 'components/Details';
import {useAuthMethod} from '@crema/utility/AuthHooks';
import HomeComponent from 'components/Home';
import SearchComponent from 'components/SearchComponent';
import {useSelector} from 'react-redux';

const withData = (ComposedComponent) => (props) => {
  const {user, isLoading} = useAuthUser();
  const {asPath, pathname} = useRouter();
  const {signInWithEmailAndPassword} = useAuthMethod();
  const loadingApp = useSelector((state) => state.loadingApp?.isLoadingApp);

  useEffect(() => {
    if (!user && !isLoading) {
      const data = {
        email: 'crema.demo@gmail.com',
        password: 'Pass@1!@all',
      };
      signInWithEmailAndPassword(data);
    }
  }, [user, isLoading]);

  // const renderComponent = (path, props, component) => (
  //   <>
  //     {React.createElement(component, props)}
  //     <AppLoader />
  //   </>
  // );

  // if (!user || isLoading) {
  //   switch (pathname) {
  //     case '/':
  //       return renderComponent(pathname, props, HomeComponent);
  //     case '/du-an/[slug]':
  //     case '/bds-ban/[slug]':
  //     case '/bds-cho-thue/[slug]':
  //     case '/m-a/[slug]':
  //       return renderComponent(pathname, props, DetailComponent);
  //     case '/du-an':
  //     case '/bds-ban':
  //     case '/bds-cho-thue':
  //     case '/m-a':
  //     case '/du-an/loai-hinh/[slugType]':
  //     case '/bds-ban/loai-hinh/[slugType]':
  //     case '/bds-cho-thue/loai-hinh/[slugType]':
  //     case '/m-a/loai-hinh/[slugType]':
  //       return renderComponent(pathname, props, SearchComponent);
  //     default:
  //       return <AppLoader />;
  //   }
  // }
  return <ComposedComponent {...props} />;
};
export default withData;
