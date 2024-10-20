import React, {useEffect, useState} from 'react';
import {Col, Row, Collapse, Menu, Button, Input, Form, Modal} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {DoubleLeftOutlined} from '@ant-design/icons';
import Hidden from '@mui/material/Hidden';
import AppLogo from '../../components/AppLogo';
import AppLanguageSwitcher from '@crema/core/AppLanguageSwitcher';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {onSendEmail} from 'pages/api/vland';
import {SHOW_MESSAGE} from 'shared/constants/ActionTypes';
import imgSuccess from 'assets/img/img_success.png';
import PlainImg from 'assets/icon/Plain.png';
import arrowDownImg from 'assets/icon/ArrowDown.png';
import addressImg from 'assets/icon/map_address.png';
import letterImg from 'assets/icon/Letter.png';
import phoneImg from 'assets/icon/phone_calling.png';
import {useRouter} from 'next/router';

const AppFooter = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {messages} = useIntl();
  const {Panel} = Collapse;
  const [showArrow, setShowArrow] = useState(false);
  const {categories} = useSelector((state) => state.categories);
  const hideFooter = useSelector((state) => state.hideFooter?.isHideFooter);
  const [visible, setVisible] = useState(false);
  const [logo, setLogo] = useState(null);
  const [footerConfig, setFooterConfig] = useState(null);
  const [menusSupport, setMenusSupport] = useState([]);
  const [menusTerm, setMenusTerm] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const pathName = router.asPath.split('?')[0];
  const pathNameArr = pathName.split('/');
  const isDetailPage = pathNameArr?.some((part) => part?.includes('-vc'));

  const handleResize = () => {
    if (window.innerWidth < 992) {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('load', handleResize);
    window.addEventListener('reload', handleResize);
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300) {
        setVisible(true);
      } else if (scrolled <= 300) {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);

  useEffect(() => {
    if (categories) {
      const logoConfig =
        categories?.configurations?.webHeaderConfig?.homeIcon || [];
      const footerConfig = categories?.configurations?.webFooterConfig || [];
      setFooterConfig(footerConfig);
      setLogo(logoConfig);
    }
  }, [categories]);

  useEffect(() => {
    if (footerConfig) {
      const newMenuSupport = [];
      const newMenuTerm = [];
      footerConfig?.supportMenu?.items?.forEach((item, index) => {
        let options = {
          label: (
            <a
              href={item?.url}
              title={item?.label}
              target='_blank'
              rel='noopener noreferrer'
            >
              {item?.label}
            </a>
          ),
          key: index + 1,
        };
        newMenuSupport?.push(options);
      });
      setMenusSupport(newMenuSupport);

      footerConfig?.termMenu?.items?.forEach((item, index) => {
        let options = {
          label: (
            <a
              href={item?.url}
              title={item?.label}
              target='_blank'
              rel='noopener noreferrer'
            >
              {item?.label}
            </a>
          ),
          key: index + 1,
        };
        newMenuTerm?.push(options);
      });

      setMenusTerm(newMenuTerm);
    }
  }, [footerConfig]);

  // useEffect(() => {
  //   window.fbAsyncInit = function () {
  //     FB.init({
  //       xfbml: true,
  //       version: 'v17.0',
  //     });
  //   };
  //   (function (d, s, id) {
  //     var js,
  //       fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) return;
  //     js = d.createElement(s);
  //     js.id = id;
  //     js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
  //     fjs.parentNode.insertBefore(js, fjs);
  //   })(document, 'script', 'facebook-jssdk');
  // }, []);
  const [submittable, setSubmittable] = useState(false);
  const onValuesChange = (_, allValues) => {
    const hasNewData = Object.values(allValues).some((value) => value !== '');
    setSubmittable(hasNewData);
  };

  const onFinish = async (values) => {
    console.log('Success:', values?.email);
    const res = await onSendEmail(values?.email);
    if (res?.code === 200) {
      setOpenModal(true);
    } else {
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'error',
          description: res?.message,
        },
      });
    }
  };

  return (
    <>
      {!hideFooter && (
        <>
          <footer
            className={`site-footer footer ${
              isDetailPage ? 'footer-detail' : ''
            }`}
          >
            <div className='footer-top'>
              <div className='footer-top-1'>
                <div className='container'>
                  <Row
                    gutter={[16, 0]}
                    align={'middle'}
                    justify={'space-between'}
                  >
                    <Col xs={12} className='logo_footer'>
                      <a href={logo?.hrefUrl} className='d-flex'>
                        <img src={logo?.iconUrl} alt='Varsland.vn' />
                      </a>
                    </Col>
                    <Col xs={12} className='apps'>
                      <Row gutter={[12, 0]} align={'middle'} justify={'end'}>
                        <p className='footer-title title-download'>
                          <IntlMessages id='common.downloadApp' />
                        </p>
                        {footerConfig?.downloadApp?.map((item, index) => {
                          return (
                            <Col key={index}>
                              <a
                                href={item?.url}
                                target='_blank'
                                rel='noreferrer'
                              >
                                <img src={item?.icon} alt={item?.text} />
                                <span>{item?.text}</span>
                              </a>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className='footer-top-2'>
                <div className='container'>
                  <div className='footer-top-2-inner'>
                    <div className='info'>
                      <Row gutter={[0, 12]}>
                        <Col xs={24}>
                          <p className='footer-title'>
                            {footerConfig?.companyInfo?.name}
                          </p>
                        </Col>
                        <Col xs={24}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M3.33398 8.45307C3.33398 4.70522 6.31875 1.66699 10.0007 1.66699C13.6825 1.66699 16.6673 4.70522 16.6673 8.45307C16.6673 12.1715 14.5395 16.5107 11.2198 18.0624C10.4459 18.4241 9.55544 18.4241 8.78154 18.0624C5.46175 16.5107 3.33398 12.1715 3.33398 8.45307Z'
                              stroke='#181414'
                            />
                            <ellipse
                              cx='10'
                              cy='8.33301'
                              rx='2.5'
                              ry='2.5'
                              stroke='#181414'
                            />
                          </svg>
                          <a
                            href='https://maps.app.goo.gl/BUVUwY7PwjyfosUPA'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {footerConfig?.companyInfo?.address}
                          </a>
                        </Col>
                        <Col xs={24}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M11.25 1.66699C11.25 1.66699 13.1945 1.84377 15.6694 4.31864C18.1443 6.79352 18.3211 8.73806 18.3211 8.73806'
                              stroke='#181414'
                              strokeLinecap='round'
                            />
                            <path
                              d='M11.8398 4.61328C11.8398 4.61328 12.6648 4.84898 13.9022 6.08642C15.1397 7.32386 15.3754 8.14882 15.3754 8.14882'
                              stroke='#181414'
                              strokeLinecap='round'
                            />
                            <path
                              d='M12.5839 12.5227L12.2214 12.1783L12.5839 12.5227ZM12.9635 12.1231L13.326 12.4674L12.9635 12.1231ZM14.9774 11.8436L14.7279 12.2769V12.2769L14.9774 11.8436ZM16.5694 12.76L16.32 13.1933L16.5694 12.76ZM17.0181 15.632L17.3806 15.9764L17.0181 15.632ZM15.8343 16.8783L15.4717 16.534L15.8343 16.8783ZM14.7302 17.4692L14.7793 17.9668L14.7302 17.4692ZM6.5128 13.7293L6.87533 13.385L6.5128 13.7293ZM2.50241 5.80495L2.00312 5.83174L2.00312 5.83175L2.50241 5.80495ZM7.89793 7.08593L8.26046 7.43027L7.89793 7.08593ZM8.02853 4.74425L8.4368 4.45559V4.45559L8.02853 4.74425ZM6.97771 3.25801L6.56945 3.54667L6.56945 3.54667L6.97771 3.25801ZM4.38454 3.0072L4.74707 3.35155L4.74707 3.35155L4.38454 3.0072ZM3.07654 4.38428L2.71401 4.03994H2.71401L3.07654 4.38428ZM9.21927 10.8799L9.5818 10.5356L9.21927 10.8799ZM12.9465 12.867L13.326 12.4674L12.6009 11.7787L12.2214 12.1783L12.9465 12.867ZM14.7279 12.2769L16.32 13.1933L16.8189 12.3266L15.2268 11.4103L14.7279 12.2769ZM16.6555 15.2877L15.4717 16.534L16.1968 17.2227L17.3806 15.9764L16.6555 15.2877ZM14.6811 16.9717C13.4529 17.0929 10.2926 16.9827 6.87533 13.385L6.15027 14.0737C9.81099 17.9277 13.2919 18.1136 14.7793 17.9668L14.6811 16.9717ZM6.87533 13.385C3.6238 9.96173 3.07074 7.06461 3.00169 5.77815L2.00312 5.83175C2.08432 7.34448 2.72739 10.47 6.15027 14.0737L6.87533 13.385ZM8.02145 7.68191L8.26046 7.43027L7.5354 6.74158L7.29639 6.99322L8.02145 7.68191ZM8.4368 4.45559L7.38597 2.96936L6.56945 3.54667L7.62027 5.03291L8.4368 4.45559ZM4.02201 2.66286L2.71401 4.03994L3.43907 4.72862L4.74707 3.35155L4.02201 2.66286ZM7.65892 7.33756C7.29639 6.99322 7.29593 6.99371 7.29546 6.9942C7.2953 6.99437 7.29483 6.99486 7.29451 6.9952C7.29388 6.99588 7.29322 6.99658 7.29255 6.9973C7.29122 6.99874 7.28983 7.00025 7.28839 7.00183C7.28551 7.005 7.28242 7.00847 7.27913 7.01224C7.27257 7.01979 7.26524 7.02855 7.25732 7.03857C7.24146 7.05861 7.22319 7.08366 7.20381 7.11394C7.16496 7.17466 7.12201 7.25588 7.08537 7.35885C7.01101 7.56781 6.96836 7.85015 7.02094 8.20902C7.12453 8.91606 7.59225 9.893 8.85674 11.2243L9.5818 10.5356C8.38378 9.27428 8.07132 8.48004 8.01037 8.06405C7.98068 7.86139 8.00965 7.74425 8.0275 7.6941C8.03696 7.66752 8.04525 7.65429 8.04612 7.65293C8.0466 7.65218 8.0453 7.65429 8.04146 7.65915C8.03954 7.66158 8.03698 7.6647 8.03368 7.66849C8.03203 7.67039 8.03019 7.67246 8.02816 7.67469C8.02714 7.67581 8.02608 7.67697 8.02496 7.67817C8.0244 7.67877 8.02383 7.67939 8.02324 7.68001C8.02295 7.68032 8.0225 7.68079 8.02236 7.68095C8.0219 7.68143 8.02145 7.68191 7.65892 7.33756ZM8.85674 11.2243C10.1182 12.5524 11.0532 13.0547 11.7449 13.167C12.0984 13.2244 12.3793 13.178 12.5879 13.0957C12.6902 13.0554 12.7703 13.0083 12.8296 12.9663C12.8592 12.9453 12.8836 12.9256 12.9029 12.9086C12.9126 12.9001 12.921 12.8923 12.9283 12.8853C12.9319 12.8818 12.9352 12.8785 12.9383 12.8755C12.9398 12.8739 12.9412 12.8725 12.9426 12.8711C12.9433 12.8704 12.9439 12.8697 12.9446 12.869C12.9449 12.8687 12.9454 12.8682 12.9455 12.868C12.946 12.8675 12.9465 12.867 12.5839 12.5227C12.2214 12.1783 12.2219 12.1778 12.2223 12.1774C12.2225 12.1772 12.2229 12.1767 12.2232 12.1764C12.2238 12.1758 12.2244 12.1752 12.225 12.1746C12.2261 12.1734 12.2272 12.1723 12.2283 12.1712C12.2304 12.1691 12.2324 12.1671 12.2342 12.1653C12.2379 12.1618 12.241 12.159 12.2435 12.1568C12.2484 12.1525 12.251 12.1507 12.2511 12.1506C12.2514 12.1503 12.2418 12.1572 12.221 12.1654C12.1835 12.1802 12.085 12.2092 11.9052 12.18C11.5302 12.1191 10.7828 11.8 9.5818 10.5356L8.85674 11.2243ZM7.38598 2.96936C6.58309 1.83378 4.98522 1.64878 4.02201 2.66286L4.74707 3.35155C5.24138 2.83113 6.10072 2.88372 6.56945 3.54667L7.38598 2.96936ZM3.00169 5.77815C2.98153 5.40253 3.14587 5.03731 3.43907 4.72862L2.71401 4.03994C2.28451 4.49212 1.96456 5.11322 2.00312 5.83174L3.00169 5.77815ZM15.4717 16.534C15.2255 16.7932 14.9562 16.9445 14.6811 16.9717L14.7793 17.9668C15.3633 17.9092 15.841 17.5972 16.1968 17.2227L15.4717 16.534ZM8.26046 7.43027C9.02327 6.62718 9.08003 5.36535 8.4368 4.45559L7.62027 5.03291C8.00444 5.57626 7.95018 6.3049 7.5354 6.74158L8.26046 7.43027ZM16.32 13.1933C17.0717 13.626 17.2239 14.6893 16.6555 15.2877L17.3806 15.9764C18.4104 14.8922 18.112 13.0709 16.8189 12.3266L16.32 13.1933ZM13.326 12.4674C13.6879 12.0864 14.2519 12.0029 14.7279 12.2769L15.2268 11.4103C14.3602 10.9115 13.2884 11.055 12.6009 11.7787L13.326 12.4674Z'
                              fill='#181414'
                            />
                          </svg>
                          <a href={`tel:${footerConfig?.companyInfo?.hotline}`}>
                            {footerConfig?.companyInfo?.hotline}
                          </a>
                        </Col>
                        <Col xs={24}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M1.66602 9.99967C1.66602 6.85698 1.66602 5.28563 2.64233 4.30932C3.61864 3.33301 5.18999 3.33301 8.33268 3.33301H11.666C14.8087 3.33301 16.3801 3.33301 17.3564 4.30932C18.3327 5.28563 18.3327 6.85698 18.3327 9.99967C18.3327 13.1424 18.3327 14.7137 17.3564 15.69C16.3801 16.6663 14.8087 16.6663 11.666 16.6663H8.33268C5.18999 16.6663 3.61864 16.6663 2.64233 15.69C1.66602 14.7137 1.66602 13.1424 1.66602 9.99967Z'
                              stroke='#181414'
                            />
                            <path
                              d='M5 6.66699L6.79908 8.16623C8.32961 9.44167 9.09488 10.0794 10 10.0794C10.9051 10.0794 11.6704 9.44167 13.2009 8.16622L15 6.66699'
                              stroke='#181414'
                              strokeLinecap='round'
                            />
                          </svg>
                          <a
                            href={`mailto:${footerConfig?.companyInfo?.email}`}
                          >
                            {footerConfig?.companyInfo?.email}
                          </a>
                        </Col>
                      </Row>
                    </div>
                    <div className='support'>
                      <Hidden mdDown>
                        <p className='footer-title'>
                          {footerConfig?.supportMenu?.label}
                        </p>
                        <Menu
                          className='menu-footer'
                          mode='inline'
                          items={menusSupport}
                        />
                      </Hidden>
                      <Hidden mdUp>
                        <Collapse
                          expandIcon={({isActive}) => (
                            <svg
                              width='18'
                              height='18'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                              className='ant-collapse-arrow'
                            >
                              <path
                                d='M5.9668 2.7193L10.3135 7.06596C10.8268 7.5793 10.8268 8.4193 10.3135 8.93263L5.9668 13.2793'
                                stroke='#181414'
                                strokeWidth='1.5'
                                strokeMiterlimit='10'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              ></path>
                            </svg>
                          )}
                          className='footer-title foote-title-collapse'
                          collapsible='header'
                          expandIconPosition={'end'}
                        >
                          <Panel
                            header={footerConfig?.supportMenu?.label}
                            key='1'
                            showArrow={showArrow}
                            className='money-panel'
                          >
                            <Menu
                              className='menu-footer'
                              mode='inline'
                              items={menusSupport}
                            />
                          </Panel>
                        </Collapse>
                      </Hidden>
                    </div>
                    <div className='terms'>
                      <Hidden mdDown>
                        <p className='footer-title'>
                          {footerConfig?.termMenu?.label}
                        </p>
                        <Menu
                          className='menu-footer'
                          mode='inline'
                          items={menusTerm}
                        />
                      </Hidden>
                      <Hidden mdUp>
                        <Collapse
                          expandIcon={({isActive}) => (
                            <svg
                              width='18'
                              height='18'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                              className='ant-collapse-arrow'
                            >
                              <path
                                d='M5.9668 2.7193L10.3135 7.06596C10.8268 7.5793 10.8268 8.4193 10.3135 8.93263L5.9668 13.2793'
                                stroke='#181414'
                                strokeWidth='1.5'
                                strokeMiterlimit='10'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              ></path>
                            </svg>
                          )}
                          className='footer-title foote-title-collapse'
                          collapsible='header'
                          expandIconPosition={'end'}
                        >
                          <Panel
                            header={footerConfig?.termMenu?.label}
                            key='1'
                            showArrow={showArrow}
                            className='money-panel'
                          >
                            <Menu
                              className='menu-footer'
                              mode='inline'
                              items={menusTerm}
                            />
                          </Panel>
                        </Collapse>
                      </Hidden>
                    </div>
                    <div className='social'>
                      <Row gutter={[0, 12]}>
                        <Col xs={24}>
                          <p className='footer-title'>
                            <IntlMessages id='common.signUpFor' />
                          </p>
                        </Col>
                        <Col xs={24}>
                          <Form
                            form={form}
                            onFinish={onFinish}
                            onValuesChange={onValuesChange}
                          >
                            <Form.Item
                              name='email'
                              rules={[
                                {
                                  type: 'email',
                                  message:
                                    messages['common.inputEmailInvalidate'],
                                },
                              ]}
                            >
                              <Input
                                placeholder={messages['common.emailHint']}
                                maxLength={255}
                              />
                            </Form.Item>
                            <Button htmlType='submit' disabled={!submittable}>
                              <img
                                src={PlainImg.src}
                                alt={messages['common.send']}
                              />
                            </Button>
                          </Form>
                        </Col>
                        <Col xs={24} className='social-list'>
                          <p className='footer-title ' style={{width: '100%'}}>
                            <IntlMessages id='common.follow' />
                          </p>
                          <ul>
                            {footerConfig?.socialLinks?.map((item, index) => {
                              return (
                                <li key={index}>
                                  <a
                                    href={item?.url}
                                    target='_blank'
                                    rel='noreferrer'
                                    title={item?.name}
                                  >
                                    <img src={item?.icon} alt={item?.name} />
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='footer-bottom'>
              <div className='container'>
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={14} lg={18}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: footerConfig?.copyrightHtmlInfo,
                      }}
                    ></div>
                  </Col>
                  <Col xs={24} md={10} lg={6} className='chungchi'>
                    <Row
                      gutter={[12, 0]}
                      align={'middle'}
                      justify={'end'}
                      wrap={false}
                    >
                      <Col>
                        <a
                          href={footerConfig?.govOnlineInfo?.url}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <img
                            className='img_bct'
                            src={footerConfig?.govOnlineInfo?.icon}
                            alt={messages['common.ministryIndustryTrade']}
                            title={messages['common.ministryIndustryTrade']}
                          />
                        </a>
                      </Col>
                      <Col>
                        <AppLanguageSwitcher isFooterDisplay={true} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </footer>

          <Button
            type='primary'
            className='back-top btn position-fixed'
            onClick={scrollToTop}
            style={{display: visible ? 'flex' : 'none'}}
          >
            <DoubleLeftOutlined />
          </Button>
        </>
      )}
      {/* Plugin Facebook */}
      {/* <div className={`${hideFooter ? 'facebook-map' : ''}`}>
        <div id='fb-root'></div>
        <div
          id='fb-customer-chat'
          className='fb-customerchat'
          attribution='biz_inbox'
          page_id='122105990570002372'
        ></div>
      </div> */}

      {openModal && (
        <Modal
          title={<IntlMessages id='common.notification' />}
          className='modal-save-search modal-users text-center'
          centered
          width={500}
          open={openModal}
          onOk={() => setOpenModal(false)}
          onCancel={() => setOpenModal(false)}
          footer={
            <Row gutter={[8, 0]} justify={'end'}>
              <Col>
                <Button
                  className='btn btn-cancel'
                  onClick={() => setOpenModal(false)}
                  style={{width: '100%'}}
                >
                  <IntlMessages id='common.close' />
                </Button>
              </Col>
            </Row>
          }
        >
          <div className='modal-login-body'>
            <div className='modal-login-head text-center'>
              <Row gutter={[0, 16]}>
                <Col xs={24}>
                  <img src={imgSuccess.src} alt='' />
                </Col>
                <Col xs={24}>
                  <h4>
                    <IntlMessages id='common.titleSubscribed' />
                  </h4>
                </Col>
                <Col xs={24}>
                  <p>
                    <IntlMessages id='common.subTitleSubscribed' />
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AppFooter;
