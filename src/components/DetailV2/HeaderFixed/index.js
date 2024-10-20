import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Anchor, Button, Col, Row} from 'antd';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import phoneImg from 'assets/icon/phone.png';
import {URL_CMS_SERVER} from 'shared/constants/ConfigApp';
import NoImage from 'assets/img/no-image.png';
import ModalLogin from 'components/ModalLogin';
import {useSelector} from 'react-redux';

const HeaderFixed = (props) => {
  const {messages} = useIntl();
  const {
    dataPost,
    handeFixedSideBar,
    onHandleFavorite,
    dataState,
    handleCopyText,
  } = props;
  const [isFixed, setIsFixed] = useState(false);
  const [isToggle, setIsToggle] = useState(true);
  const topRef = React.useRef(null);
  const [targetOffset, setTargetOffset] = useState();
  const [dataItem, setDataItem] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const {isAuthenticated} = useSelector(({auth}) => auth);

  useEffect(() => {
    setTargetOffset(topRef.current?.clientHeight + 10);
    window.onscroll = function () {
      const widthViewPort = window.innerWidth;
      if (widthViewPort > 1024) {
        handeFixedSideBar();
      }
      handleScroll();
    };
  }, []);

  function handleScroll() {
    const sticky = 100;
    if (window.pageYOffset >= sticky) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  }

  useEffect(() => {
    setDataItem([
      {
        key: 'tab-overview',
        href: '#tab-overview',
        title: <IntlMessages id='common.overview' />,
      },
      {
        key: 'tab-desc',
        href: '#tab-desc',
        title: <IntlMessages id='common.descInformation' />,
      },
      {
        key: 'tab-planDrawing',
        href:
          dataPost?.postType?.code == 'du-an'
            ? '#tab-planDrawing'
            : '#tab-character',
        title:
          dataPost?.postType?.code == 'du-an' ? (
            <IntlMessages id='common.floorPlan' />
          ) : (
            <IntlMessages id='common.detail' />
          ),
      },
      {
        key: 'tab-location',
        href: '#tab-location',
        title: <IntlMessages id='common.location' />,
      },
      {
        key: 'tab-loan',
        href: '#tab-loan',
        title:
          dataPost?.postType?.code !== 'bds-cho-thue' ? (
            <IntlMessages id='common.loanSection' />
          ) : (
            ''
          ),
      },
    ]);
  }, [dataPost]);

  const onClickToggle = () => {
    if (!isAuthenticated) {
      setOpenModal(true);
      return;
    }
    setIsToggle(!isToggle);
  };

  return (
    <>
      <div
        ref={topRef}
        className={`nav-scrollto ${isFixed ? 'fixed' : ''}`}
        id='scroll__project'
      >
        <div className='container'>
          <div className='navigation-fixed d-flex align-center justify-between'>
            <Anchor
              className='anchor-fixed'
              onChange={(e) => {
                setTargetOffset(topRef.current?.clientHeight + 50);
              }}
              targetOffset={targetOffset}
              direction='horizontal'
              items={dataItem}
            />
            <div className='navigation-fixed-info d-flex align-center back-history'>
              <Row gutter={[16, 0]} align={'middle'} className='right'>
                <Col>
                  <Button
                    type='outline'
                    onClick={() => handleCopyText(dataPost?.detailUrlForSeo)}
                    title={messages['common.share']}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      height='16'
                      viewBox='0 0 18 16'
                      fill='none'
                    >
                      <path
                        d='M1.20669 15.4811C1.25755 15.4943 1.30858 15.5 1.35944 15.5C1.62241 15.5 1.87333 15.3442 1.99286 15.1002C3.2946 12.4609 5.91234 10.8209 8.82525 10.8209H9.92524V13.8702C9.92524 14.1572 10.0975 14.4153 10.3605 14.5232C10.6205 14.6293 10.9233 14.5654 11.1197 14.3581L17.1383 8.02491C17.3975 7.75278 17.3975 7.32123 17.1383 7.0491L11.1197 0.715951C10.9233 0.508591 10.6224 0.443995 10.3605 0.550853C10.0975 0.658742 9.92524 0.916782 9.92524 1.20386V4.25327H9.69382C4.71605 4.25327 0.666016 8.35717 0.666016 13.4011V14.8085C0.666016 15.1349 0.892863 15.4071 1.20669 15.4811Z'
                        stroke='#046CFC'
                      />
                    </svg>
                    <IntlMessages id='common.share' />
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='outline'
                    onClick={onHandleFavorite}
                    className={`${dataState?.isFavorite ? 'active' : ''}`}
                    title={
                      dataPost?.isFavorite
                        ? messages['common.favourited']
                        : messages['common.favourite']
                    }
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M10.518 17.3413C10.2346 17.4413 9.76797 17.4413 9.48464 17.3413C7.06797 16.5163 1.66797 13.0747 1.66797 7.24134C1.66797 4.66634 3.74297 2.58301 6.3013 2.58301C7.81797 2.58301 9.15964 3.31634 10.0013 4.44967C10.843 3.31634 12.193 2.58301 13.7013 2.58301C16.2596 2.58301 18.3346 4.66634 18.3346 7.24134C18.3346 13.0747 12.9346 16.5163 10.518 17.3413Z'
                        stroke='#D1132A'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    {dataPost?.isFavorite ? (
                      <IntlMessages id='common.favourited' />
                    ) : (
                      <IntlMessages id='common.favourite' />
                    )}
                  </Button>
                </Col>
              </Row>
              <div className='navigation-contact'>
                <div className='contact-avatar d-flex align-center'>
                  <div className='contact-author'>
                    {dataPost?.author?.avatar ? (
                      <img
                        src={dataPost?.author?.avatar}
                        alt={dataPost?.author?.name}
                      />
                    ) : (
                      <img src={NoImage.src} alt={dataPost?.author?.name} />
                    )}
                  </div>
                  <div className='contact-avatar_user'>
                    <p className='name '>
                      <span
                        className='limit-text limit-text-1'
                        style={{lineHeight: '16px'}}
                      >
                        {dataPost?.author?.name ? (
                          dataPost?.author?.name
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </span>
                      {dataPost?.author?.varsIconUrl && (
                        <span className='icon-tick' style={{display: 'flex'}}>
                          <img
                            src={dataPost?.author?.varsIconUrl}
                            alt={dataPost?.author?.name}
                          />
                        </span>
                      )}
                    </p>
                    <p className='postBy' title={dataPost?.postBy?.name}>
                      <a
                        href={
                          dataPost?.author?.identifyCode
                            ? `${URL_CMS_SERVER}/profiles?code=${
                                dataPost?.author?.identifyCode
                              }&object=${
                                dataPost?.author?.ratingTargetType == 1
                                  ? 'agent'
                                  : 'exchanges'
                              }`
                            : '#'
                        }
                        target={`${
                          dataPost?.author?.identifyCode ? '_blank' : ''
                        }`}
                        rel='noopener noreferrer'
                        title={dataPost?.author?.name}
                      >
                        <span>{dataPost?.postBy?.name}</span>
                      </a>
                    </p>
                  </div>
                </div>
                <div className=''>
                  {dataPost?.author?.phone && (
                    <Button type='primary' onClick={onClickToggle} block>
                      <img
                        src={phoneImg.src}
                        alt={
                          isToggle
                            ? dataPost?.author?.phone?.substr(0, 5) + '*****'
                            : dataPost?.author?.phone
                        }
                      />
                      {isToggle
                        ? dataPost?.author?.phone?.substr(0, 5) + '*****'
                        : dataPost?.author?.phone}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Login */}
      <ModalLogin
        openModalLogin={openModal}
        setOpenModalLogin={setOpenModal}
        description={<IntlMessages id='common.notiPhoneLogin' />}
      />
    </>
  );
};

export default React.memo(HeaderFixed);
HeaderFixed.propTypes = {
  dataPost: PropTypes.any,
  handeFixedSideBar: PropTypes.func,
  onHandleFavorite: PropTypes.func,
  dataState: PropTypes.any,
  handleCopyText: PropTypes.func,
};
