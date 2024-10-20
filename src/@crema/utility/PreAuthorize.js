import React from 'react';
import {AppLoader} from '../index';
import PropTypes from 'prop-types';
import {useAuthUser} from './AuthHooks';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {
  APP_CODE,
  CLIENT_ID,
  CLIENT_SECRET,
  URL_API,
  URL_REDIRECT_TO_SSO,
} from 'shared/constants/ConfigApp';
import axios from 'axios';
import {setProfile, onLogOut, onSetToken} from 'redux/actions/Auth';
import {makePersistKey} from './Utils';
import {onCheckSessionInSSO} from 'pages/api/auth';
import {generateCode} from 'shared/GenerateCode';
import {getWebTokenFromCookie} from 'shared/constants/AppConst';
import {useRouter} from 'next/router';
import {deleteCookie, setCookie} from 'cookies-next';
import {useState} from 'react';
import {onGetProfileUser} from 'pages/api/category';
import {CLEAR_LOCATION, SAVE_LOCATION} from 'shared/constants/ActionTypes';
import {redirectToSSOFunc} from './LoginRedirect';

const PreAuthorize = ({children}) => {
  const {isLoading} = useAuthUser();
  const router = useRouter();
  const filterParam = !!router.query?.filterSavedId;
  const isPreview = router?.query?.preview === '1';
  const dispatch = useDispatch();
  const tokenWeb = getWebTokenFromCookie();
  const [isGetUserInfo, setIsGetUserInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const {query} = router;
  const {location} = useSelector(({location}) => location);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleRouteChangeComplete);
      return () =>
        window.removeEventListener('load', handleRouteChangeComplete);
    }

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const {latitude, longitude} = position.coords;
            dispatch({
              type: SAVE_LOCATION,
              payload: {
                location: {
                  lat: latitude,
                  lng: longitude,
                },
              },
            });
          },
          (error) => {
            console.error('Error getting geolocation', error);
            dispatch({
              type: CLEAR_LOCATION,
              payload: {
                location: {
                  lat: '',
                  lng: '',
                },
              },
            });
          },
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    if (!location?.lat && !location?.lng) {
      getLocation();
    }
  }, [dispatch]);

  const handleGetAccessToken = (codeChallengePayload) => {
    axios
      .post(`${URL_API}/vid/api/auth/code/exchange`, {
        appCode: APP_CODE,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        authCode: codeChallengePayload?.authCode,
        codeVerifier: codeChallengePayload?.codeVerifier,
      })
      .then((data) => {
        const tokenData = data?.data?.data?.accessToken;
        setCookie('varsTkWeb', tokenData);
        dispatch(onSetToken(data));
      })
      .finally(() => {
        // Xóa authCode và clientSecret
        const updatedQuery = {...query};
        delete updatedQuery.authCode;
        delete updatedQuery.clientSecret;

        router.push(
          {
            pathname: router.pathname,
            query: updatedQuery,
          },
          undefined,
          {shallow: true},
        );
        // const params = new URLSearchParams(router.query);
        // params.delete('authCode');
        // params.delete('clientSecret');
        // const newPathObject = {
        //   pathname: router.pathname,
        //   query: params.toString(),
        // };
        // router.push(newPathObject);
      });
    return;
  };

  useEffect(async () => {
    const authCode = router.query?.authCode;
    if (authCode && !tokenWeb) {
      const codeVerifier = localStorage.getItem(makePersistKey('codeVerifier'));
      const codeChallengePayload = {
        authCode: authCode,
        codeVerifier: codeVerifier,
      };
      await handleGetAccessToken(codeChallengePayload);
      return;
    }
    if (!tokenWeb) {
      if (isPreview || filterParam) redirectToSSOFunc();
      const handleCheckSessionInSSO = async () => {
        const res = await onCheckSessionInSSO();
        if (res) {
          redirectToSSOFunc();
          return;
        } else {
          dispatch(onLogOut());
        }
      };
      handleCheckSessionInSSO();
    }
  }, [tokenWeb, isPreview, filterParam]);

  // const handleLogin = () => {
  //   const urlObj = new URL(window.location.href);
  //   urlObj.hash = '';
  //   window.history.pushState('', '', urlObj);
  //   const redirectTo = window.location.href.replace(/\/$/, '');
  //   const code = generateCode();
  //   const codeVerifier = code.codeVerifier;
  //   localStorage.setItem(makePersistKey('codeVerifier'), codeVerifier);
  //   const codeChallenge = code.codeChallenge;
  //   const url = `${URL_REDIRECT_TO_SSO}?redirectTo=${redirectTo}&appCode=${APP_CODE}&clientId=${CLIENT_ID}&codeChallenge=${codeChallenge}`;
  //   window.location.replace(url);
  // };

  const getUserInfo = async () => {
    try {
      setIsGetUserInfo(true);
      const res = await onGetProfileUser(tokenWeb);
      dispatch(setProfile(res));
      setIsGetUserInfo(false);
    } catch (e) {
      if (e.toString().includes('401')) {
        console.log('401');
        dispatch(onLogOut());
      }
      deleteCookie('varsTkWeb');
      setIsGetUserInfo(false);
    }
  };

  useEffect(() => {
    if (tokenWeb) getUserInfo();
  }, [tokenWeb]);

  return (
    <>
      {loading && <div className='page-overlay'></div>}
      {isLoading || isGetUserInfo ? <AppLoader /> : <>{children}</>}
    </>
  );
};

export default PreAuthorize;

PreAuthorize.propTypes = {
  children: PropTypes.node.isRequired,
};
