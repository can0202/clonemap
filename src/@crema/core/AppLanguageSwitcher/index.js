import React from 'react';

import PropTypes from 'prop-types';
import {List, Select} from 'antd';
import {ThemeDirection} from '../../../shared/constants/AppEnums';
import {
  useLocaleActionsContext,
  useLocaleContext,
} from '../../utility/AppContextProvider/LocaleContextProvide';
import {useLayoutActionsContext} from '../../utility/AppContextProvider/LayoutContextProvider';
import {SAVE_LANGUAGE_LOCALE} from 'shared/constants/ActionTypes';
import vietnam from 'assets/img/Vietnam.png';
import english from 'assets/img/united.png';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {useState} from 'react';
import {setCookie, getCookie} from 'cookies-next';
import {useRouter} from 'next/router';
import IconArrow from 'assets/icon/arrow_up_white.png';
import defaultConfig from '@crema/utility/AppContextProvider/defaultConfig';

const AppLanguageSwitcher = ({
  isFooterDisplay,
  handleToggleLang,
  isLangActive,
}) => {
  const dispatch = useDispatch();
  const {rtlLocale, locale} = useLocaleContext();
  const {updateLocale} = useLocaleActionsContext();
  const {updateDirection} = useLayoutActionsContext();
  const {categories} = useSelector((state) => state.categories);
  const [language, setLanguage] = useState([]);
  const {localeLanguage} = useSelector(({auth}) => auth);
  const router = useRouter();

  useEffect(() => {
    const languageData = [];
    const languages =
      categories?.configurations?.webHeaderConfig?.language || [];
    languages?.forEach((item) => {
      const optionLanguage = {
        languageId: item?.code,
        locale: item?.code,
        name: item?.name,
        icon: item?.code,
        isDefault: item?.isDefault,
        iconUrl: item?.iconUrl,
      };
      languageData?.push(optionLanguage);
    });
    setLanguage(languageData);
  }, [categories]);

  const changeLanguage = (language) => {
    window.location.replace(router.asPath);
    setCookie('lang', language ? language : defaultConfig.locale);
    setCookie(
      'langServer',
      language ? language?.languageId : defaultConfig.locale.languageId,
    );
    dispatch({
      type: SAVE_LANGUAGE_LOCALE,
      payload: {
        localeLanguage: language ? language : defaultConfig.locale,
      },
    });
  };

  const cookieLang = getCookie('langServer');
  useEffect(() => {
    const langCookie = getCookie('lang');
    const langObj = langCookie && JSON.parse(langCookie);
    if (langObj) {
      if (rtlLocale.indexOf(langObj.locale) !== -1) {
        updateDirection(ThemeDirection.RTL);
      } else {
        updateDirection(ThemeDirection.LTR);
      }
      updateLocale(langObj);
    }
  }, []);

  const items = language?.map((language, index) => {
    return {
      value: language.languageId,
      label: (
        <div
          className='item-language'
          key={index}
          // onClick={() => changeLanguage(language)}
        >
          <h4>
            {!isFooterDisplay && (
              <img src={language.iconUrl} alt={language.name} />
            )}
            {language.name}
          </h4>
        </div>
      ),
      obj: language,
    };
  });

  return (
    <>
      {isFooterDisplay ? (
        <Select
          options={items}
          placeholder='Tiếng việt'
          value={cookieLang ? cookieLang : defaultConfig.locale.languageId}
          onChange={(_, option) => {
            changeLanguage(option?.obj);
          }}
          suffixIcon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
            >
              <path
                d='M15.8327 12.5L9.99935 7.5L4.16602 12.5'
                stroke='#FEFEFE'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
            </svg>
          }
        />
      ) : (
        <>
          <a className='ant-dropdown-link langBtn' onClick={handleToggleLang}>
            {locale?.languageId === 'vi'}
            <img
              src={locale?.languageId === 'vi' ? vietnam.src : english.src}
              alt={locale?.name}
            />
            <div className='menu-user-sso'>
              <div className={`menu ${isLangActive ? '' : 'active'}`}>
                <List
                  className='list-info-user'
                  itemLayout='horizontal'
                  dataSource={language}
                  renderItem={(item, index) => (
                    <List.Item onClick={() => changeLanguage(item)}>
                      <List.Item.Meta
                        avatar={<img src={item?.iconUrl} alt={item?.name} />}
                        title={<a>{item?.name}</a>}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </a>
        </>
      )}
    </>
  );
};

export default AppLanguageSwitcher;

AppLanguageSwitcher.defaultProps = {
  iconOnly: false,
};

AppLanguageSwitcher.propTypes = {
  iconOnly: PropTypes.bool,
  isFooterDisplay: PropTypes.bool,
  handleToggleLang: PropTypes.func,
  isLangActive: PropTypes.bool,
};
