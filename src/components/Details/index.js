import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {Row, Col, Modal, Button} from 'antd';
import Breadcrumbs from 'components/Projects/Breadcrumbs';
import ImageSwiper from 'components/Projects/ImageSwiper';
import ModalPopup from 'components/Projects/Modal';
import OverviewDescription from 'components/Projects/OverviewDescription';
import Location from 'components/Projects/Location';
import Loan from 'components/Projects/Loan';
import TopInfoRealEstate from 'components/RealEstate/TopInformation';
import PostAuthorCard from 'components/RealEstate/PostAuthorCard';
import Characteristic from 'components/RealEstate/Characteristic';
import TopInfoProject from 'components/Projects/TopInformation';
import PlanDrawing from 'components/Projects/PlanDrawing';
import PostAuthorCardProject from 'components/Projects/PostAuthorCard';
import Fancybox from 'components/Projects/Fancybox';
import PropTypes from 'prop-types';
import AdsBanner from 'components/AdsBanner';
import Error404 from 'modules/errorPages/Error404';
import AdsBannerVertical from 'components/AdsBannerVertical';
import RelatedBottom from 'components/Projects/RelatedBottom';
import {AppLoader} from '@crema';
import IntlMessages from '@crema/utility/IntlMessages';
import AppModal from 'components/AppModal';
import BackHistory from './BackHistory';
import {useDispatch, useSelector} from 'react-redux';
import Login from 'components/Login';
import {GOOGLE_ADS_ENABLED, URL_CMS_SERVER} from 'shared/constants/ConfigApp';
import PostExpried from './PostExpried';
import News from './News';
import {useRouter} from 'next/router';
import ModalReport from 'components/ModalReport';
import PostUp from 'components/Projects/PostUp';
import HeaderFixed from './HeaderFixed';
import {onFavorite, onNearBy} from 'pages/api/vland';
import {getCookie} from 'cookies-next';
import BannerRight from './BannerRight';
import widgetImg from 'assets/icon/widget.png';
import {SHOW_MESSAGE} from 'shared/constants/ActionTypes';
import {useIntl} from 'react-intl';
import {redirectToSSOFunc} from '@crema/utility/LoginRedirect';

const DetailComponent = ({
  postsData,
  relatedBottomData,
  isWaitingToken,
  url,
  newsData,
  pageType,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {messages} = useIntl();
  const {isAuthenticated, accessToken, profile} = useSelector(({auth}) => auth);
  const [dataMap, setDataMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [positonLoading, setPositionLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState('hinh-anh');
  const [newImages, setNewImages] = useState([]);
  const [modalData, setModalData] = useState({
    title: '',
    className: '',
    description: '',
    submitText: '',
    closeText: '',
    handleClose: () => {},
    handleSubmit: () => {},
    width: 'auto',
    onClosable: () => {},
    isFullScreen: false,
  });
  const [openModalReport, setOpenModalReport] = useState(false);
  const [openModalApp, setOpenModalApp] = useState(false);
  const [dataState, setDataState] = useState(postsData);

  const titleSplit = postsData?.titleText?.split(' ');
  const titleJoin = titleSplit?.join();
  // Call api get Near By
  const cookieLang = getCookie('langServer');
  const fetchNearBy = async () => {
    if (postsData?.id) {
      const lat = postsData?.lat;
      const lng = postsData?.lng;
      const categories = 'school';
      const resultData = await onNearBy(lat, lng, categories, cookieLang);
      const items = resultData?.data?.nearbylist ?? [];
      setDataMap(items);
      setPositionLoading(false);
    }
  };
  useEffect(() => {
    setPositionLoading(true);
    fetchNearBy();
    if (postsData) {
      const thumbnailUrl = postsData?.thumbnailUrl?.split();
      const imageUrls = postsData?.imageUrls;
      const swiperArray = thumbnailUrl?.concat(imageUrls) || [];
      setNewImages(swiperArray);
    }
  }, [postsData]);

  // Set active tab popup
  const onClickTab = (e) => {
    setOpenModal(true);
  };

  function handeFixedSideBar() {
    const element = document.getElementById('affix');
    const elementbds = document.getElementById('tin-bds');
    const elDistanceToTop = elementbds?.getBoundingClientRect().top;
    const elDistanceToBottom = elementbds?.getBoundingClientRect().bottom;

    if (elementbds && element) {
      const offsetWidth = element.offsetWidth;
      const offsetHeight = element.offsetHeight;

      if (elDistanceToTop <= offsetHeight) {
        const kc = window.scrollY - offsetHeight + elDistanceToTop - 130;
        element.style.top = kc + 'px';
        element.style.position = 'relative';
        element.style.width = 'unset';
        element.style.marginTop = 'unset';
      } else {
        if (elDistanceToTop >= 2900) {
          element.style.marginTop = '0px';
          element.style.position = 'unset';
          element.style.width = 'unset';
          element.style.top = '0px';
        } else if (elDistanceToTop <= 650) {
          element.style.marginTop = '0px';
          element.style.position = 'unset';
          element.style.width = 'unset';
          element.style.top = '0px';
        } else {
          const kc = window.scrollY - offsetHeight;
          element.style.top = '154px';
          element.style.bottom = 'unset';
          element.style.width = `${offsetWidth}px`;
          element.style.position = 'fixed';
          element.style.marginTop = 'unset';
        }
      }
    }
  }

  const changeStyle = () => {
    const element = document.getElementById('affix');
    const elementbds = document.getElementById('tin-bds');
    const elDistanceToTop = elementbds?.getBoundingClientRect().top;
    if (elementbds && element) {
      const offsetWidth = element.offsetWidth;
      const offsetHeight = element.offsetHeight;
      const kc = window.scrollY - offsetHeight + elDistanceToTop / 2 - 240;
      element.style.top = kc + 'px';
      element.style.position = 'relative';
      element.style.width = `${offsetWidth}px`;
      element.style.bottom = 'unset';
      //}
    }
  };

  const onHandleFavorite = (e) => {
    if (!accessToken) {
      setModalData({
        title: <IntlMessages id='common.notification' />,
        description: (
          <Login description={<IntlMessages id='common.notiLogin' />} />
        ),
        submitText: <IntlMessages id='common.login' />,
        closeText: <IntlMessages id='common.later' />,
        handleClose: () => {
          setOpenModalApp(false);
        },
        handleSubmit: () => {
          redirectToSSOFunc();
        },
        width: 480,
        isFullScreen: false,
      });
      setOpenModalApp(true);
      return;
    }
    const nextState = dataState?.isFavorite == 1 ? 0 : 1;
    const fetchAPI = async () => {
      const data = await onFavorite(dataState?.id, nextState, accessToken);
      if (data?.code === 200) {
        setDataState({...dataState, isFavorite: nextState});
      }
    };
    fetchAPI();
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      setModalData({
        title: <IntlMessages id='common.notification' />,
        description: (
          <Login description={<IntlMessages id='common.notiLogin' />} />
        ),
        submitText: <IntlMessages id='common.login' />,
        closeText: <IntlMessages id='common.later' />,
        handleClose: () => {
          setOpenModalApp(false);
        },
        handleSubmit: () => {
          redirectToSSOFunc();
        },
        width: 480,
        isFullScreen: false,
      });
      setOpenModalApp(true);
      return;
    }
    if (
      profile?.fullName != null &&
      profile?.phone != null &&
      profile?.email != null
    ) {
      setOpenModalReport(true);
      return;
    } else {
      setModalData({
        title: <IntlMessages id='common.notification' />,
        description: (
          <Login description={<IntlMessages id='common.notiUpdateAccount' />} />
        ),
        submitText: <IntlMessages id='common.updateNow' />,
        closeText: <IntlMessages id='common.cancel' />,
        handleClose: () => {
          setOpenModalApp(false);
        },
        handleSubmit: () => {
          router?.push(URL_CMS_SERVER + '/user/information');
        },
        width: 480,
        isFullScreen: false,
      });
      setOpenModalApp(true);
      return;
    }
  };

  const handleCopyText = async (params) => {
    try {
      await navigator.clipboard.writeText(params);
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'success',
          description: messages['common.copySuccess'],
        },
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'error',
          description: messages['common.copyError'],
        },
      });
    }
  };

  return (
    <>
      <Head>
        <title>{postsData ? postsData?.titleText : 'VARs Land'}</title>
        <link rel='canonical' href={url} />
        <meta name='generator' content='VARS CONNECT' />
        <meta property='og:url' content={postsData?.detailUrlForSeo} />
        <meta property='og:title' content={postsData?.titleText} />
        <meta name='robots' content='no-index, follow' />
        <meta
          property='og:description'
          content={
            postsData?.sortContent
              ? postsData?.sortContent?.substring(0, 155)
              : postsData?.description?.substring(0, 155)
          }
        />
        <meta property='og:type' content='article' />
        <meta
          property='og:image'
          itemProp='thumbnailUrl'
          content={postsData?.thumbnailUrl}
        />
        <meta property='og:image:alt' content={postsData?.titleText} />
        <meta property='og:image:width' content='800' />
        <meta property='og:image:height' content='400' />
        <meta property='og:image:type' content='image/jpeg' />
        <meta name='keywords' content={titleJoin} />
        <meta
          name='description'
          content={
            postsData?.sortContent
              ? postsData?.sortContent?.substring(0, 155)
              : postsData?.description?.substring(0, 155)
          }
        />
      </Head>
      {!isWaitingToken && !postsData ? (
        <Error404 />
      ) : (
        <>
          {!postsData ? (
            <AppLoader />
          ) : (
            <div className='container'>
              <div className='detail-post page-detail page-detail-bds'>
                <HeaderFixed
                  dataPost={postsData}
                  handeFixedSideBar={handeFixedSideBar}
                  onHandleFavorite={onHandleFavorite}
                  dataState={dataState}
                  handleCopyText={handleCopyText}
                />
                <BackHistory
                  dataPost={postsData}
                  onHandleFavorite={onHandleFavorite}
                  dataState={dataState}
                  handleCopyText={handleCopyText}
                />
                <Row
                  className='row-main-single'
                  gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                  }}
                >
                  <Col xs={24} lg={16}>
                    <Row gutter={[0, 24]}>
                      <Col xs={24} className='image-big'>
                        <ImageSwiper
                          loading={loading}
                          thumbsSwiper={thumbsSwiper}
                          setThumbsSwiper={setThumbsSwiper}
                          images={postsData?.imageUrls}
                          thumbnail={postsData?.thumbnailUrl}
                        />
                        <Button
                          type='default'
                          className='button-image'
                          onClick={onClickTab}
                        >
                          <img src={widgetImg.src} alt='' />
                          <IntlMessages id='common.readAll' /> (
                          {newImages?.length})
                        </Button>
                        {postsData?.isOutstanding ? (
                          <Button type='primary' className='button-outstanding'>
                            <IntlMessages id='common.outstanding' />
                          </Button>
                        ) : (
                          <>
                            {postsData?.priority?.iconUrl && (
                              <div
                                className={`highlight-label ${
                                  postsData?.priority
                                    ? 'highlight-label-real'
                                    : ''
                                }`}
                              >
                                <img
                                  src={postsData?.priority?.iconUrl}
                                  alt={postsData?.priority?.name}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </Col>
                      <Col xs={24}>
                        <Breadcrumbs loading={loading} dataPost={postsData} />
                      </Col>
                      <Col xs={24}>
                        {postsData?.postType?.code == 'du-an' ? (
                          <TopInfoProject
                            loading={loading}
                            dataPost={postsData}
                            Fancybox={Fancybox}
                            handleCopyText={handleCopyText}
                          />
                        ) : (
                          <TopInfoRealEstate
                            loading={loading}
                            dataPost={postsData}
                            handleCopyText={handleCopyText}
                          />
                        )}
                      </Col>
                      {(postsData?.status?.code === 'expired' ||
                        postsData?.transactedStatus?.code === '1') && (
                        <Col xs={24}>
                          <PostExpried dataPost={postsData} />
                        </Col>
                      )}
                      <Col xs={24} className='borderBottom'>
                        <OverviewDescription
                          loading={loading}
                          dataPost={postsData}
                          changeStyle={changeStyle}
                        />
                      </Col>
                      <Col xs={24} className='borderBottom'>
                        {postsData?.postType?.code == 'du-an' ? (
                          <PlanDrawing
                            loading={loading}
                            dataPost={postsData}
                            Fancybox={Fancybox}
                            changeStyle={changeStyle}
                          />
                        ) : (
                          <Characteristic dataPost={postsData} />
                        )}
                      </Col>
                      <Col xs={24} className='borderBottom'>
                        <Location
                          dataPost={postsData}
                          positonLoading={positonLoading}
                          setPositionLoading={setPositionLoading}
                          dataMap={dataMap}
                          setDataMap={setDataMap}
                          loading={loading}
                          changeStyle={changeStyle}
                        />
                      </Col>
                      {postsData?.postType?.code !== 'bds-cho-thue' && (
                        <Col xs={24}>
                          <Loan loading={loading} dataPost={postsData} />
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Row id='affix' className='sticky-sidebar' gutter={[0, 24]}>
                      <Col span={24}>
                        {postsData?.postType?.code == 'du-an' ? (
                          <PostAuthorCardProject
                            loading={loading}
                            dataPost={postsData}
                          />
                        ) : (
                          <PostAuthorCard
                            loading={loading}
                            dataPost={postsData}
                            handleReport={handleReport}
                            setOpenModalApp={setOpenModalApp}
                            setModalData={setModalData}
                          />
                        )}
                      </Col>
                      {postsData?.postType?.code == 'du-an' ? (
                        (postsData?.statistics?.rent?.fields?.totalPost > 0 ||
                          postsData?.statistics?.sale?.fields?.totalPost >
                            0) && (
                          <Col xs={24}>
                            <PostUp dataPost={postsData} loading={loading} />
                          </Col>
                        )
                      ) : (
                        <>
                          {/* {postsData?.typeRealEstate?.fields
                            ?.usedPriceLookup && (
                            <Col xs={24}>
                              <MarketReport dataPost={postsData} />
                            </Col>
                          )} */}
                        </>
                      )}

                      <Col xs={24}>
                        {postsData?.postType?.code == 'du-an' ? (
                          <BannerRight />
                        ) : (
                          <>
                            {GOOGLE_ADS_ENABLED && (
                              <Col span={24}>
                                <div className='gg-ads'>
                                  <AdsBannerVertical data-ad-slot='4733856540' />
                                </div>
                              </Col>
                            )}
                          </>
                        )}
                      </Col>

                      {/* <Col span={24}>
                        <RelatedSidebar dataPost={postsData} />
                      </Col> */}
                    </Row>
                  </Col>
                </Row>
                <Row gutter={[0, 24]} id='tin-bds'>
                  <Col xs={24}>
                    <RelatedBottom
                      dataPost={postsData}
                      relatedBottomData={relatedBottomData}
                    />
                  </Col>
                  <Col xs={24}>
                    {newsData?.length > 0 && <News newsData={newsData} />}
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </>
      )}

      {openModalApp && (
        <AppModal
          openModal={openModalApp}
          setOpenModal={setOpenModalApp}
          title={modalData.title}
          submitText={modalData.submitText}
          closeText={modalData.closeText}
          handleClose={modalData.handleClose}
          handleSubmit={modalData.handleSubmit}
          className={modalData.className}
          description={modalData.description}
          width={modalData.width}
          isFullScreen={modalData.isFullScreen}
        />
      )}

      {openModal && (
        <Modal
          className='modal-single'
          centered
          open={openModal}
          onOk={() => setOpenModal(false)}
          onCancel={() => setOpenModal(false)}
          footer={false}
        >
          <ModalPopup
            dataPost={postsData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            newImages={newImages}
          />
        </Modal>
      )}

      {openModalReport && (
        <ModalReport
          dataPost={postsData}
          openModalReport={openModalReport}
          setOpenModalReport={setOpenModalReport}
        />
      )}
    </>
  );
};

export default DetailComponent;
DetailComponent.propTypes = {
  postsData: PropTypes.any,
  relatedBottomData: PropTypes.any,
  isWaitingToken: PropTypes.bool,
  url: PropTypes.string,
  newsData: PropTypes.string,
  pageType: PropTypes.any,
};
