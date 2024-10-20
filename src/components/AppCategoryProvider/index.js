import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {fetchAllCategories, fetchProvinces} from 'redux/actions';
import {onHideFooter} from 'redux/actions/HideFooter';
import {onLoadingApp} from 'redux/actions/LoadingApp';
import Script from 'next/script';
import {
  GOOGLE_ANALYTIC_ENABLED,
  GOOGLE_MANAGER_ENABLED,
} from 'shared/constants/ConfigApp';

const AppCategoryProvider = ({children}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchProvinces());
    dispatch(onHideFooter());
    // dispatch(onLoadingApp());
  }, []);

  return (
    <>
      {/* Script GG ads */}
      {/* <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7694863597455832`}
        strategy='lazyOnload'
        crossOrigin='anonymous'
      /> */}
      {/* Script GG analytic */}
      {GOOGLE_ANALYTIC_ENABLED && (
        <Script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-7WBYHKM5RP'
          strategy='lazyOnload'
        ></Script>
      )}
      {GOOGLE_ANALYTIC_ENABLED && (
        <Script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7WBYHKM5RP');
        
      `}
        </Script>
      )}
      {GOOGLE_MANAGER_ENABLED && (
        <Script>
          {`
         (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NQX48NDP')
          `}
        </Script>
      )}
      {children}
    </>
  );
};

export default AppCategoryProvider;
AppCategoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
