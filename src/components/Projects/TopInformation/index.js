import React, {useState, useEffect} from 'react';
import {Col, Row, Skeleton, Tabs} from 'antd';
import PropTypes from 'prop-types';
import ModalLogin from 'components/ModalLogin';
import IntlMessages from '@crema/utility/IntlMessages';
import TabContent1 from './TabContent1';
import TabContent2 from './TabContent2';
import TabContent3 from './TabContent3';
import TabContent4 from './TabContent4';
import AppModal from 'components/AppModal';
import NoThumb from 'assets/img/EmptyAvatar.png';
import documentImg from 'assets/icon/document.png';
import mapImg from 'assets/icon/map_address.png';
import copyImg from 'assets/icon/copy.png';
import {useIntl} from 'react-intl';

const TopInfoProject = ({dataPost, loading, Fancybox, handleCopyText}) => {
  const {messages} = useIntl();
  const {TabPane} = Tabs;
  const [renderHtml, setRenderHtml] = useState('');
  const [openModalApp, setOpenModalApp] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    className: '',
    description: '',
    submitText: '',
    closeText: '',
    handleClose: () => {},
    handleSubmit: () => {},
    width: 'auto',
    onClosable: () => {
      // setIsReload(true);
    },
  });

  const handleShowModalInvestor = () => {
    setModalData({
      title: '',
      description: (
        <div className='modal-investor'>
          <div className='modal-investor-logo text-center'>
            <img
              className=''
              src={
                dataPost?.investor?.logoUrl
                  ? dataPost?.investor?.logoUrl
                  : NoThumb.src
              }
              alt={dataPost?.investor?.name}
            />
          </div>
          <h3>{dataPost?.investor?.name}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: dataPost?.investor?.description,
            }}
          ></div>
          <ul className='modal-investor-list'>
            <li>
              <IntlMessages id='common.address' />:{' '}
              {dataPost?.investor?.address}
            </li>
            <li>
              <IntlMessages id='common.hotline' />:{dataPost?.investor?.phone}
            </li>
            <li>Email: {dataPost?.investor?.email}</li>
            <li>Website: {dataPost?.investor?.website}</li>
          </ul>
        </div>
      ),
      width: 800,
    });
    setOpenModalApp(true);
  };

  // convert render oembed tag url
  const renderHtmlText = () => {
    const oembedRegex = /<oembed[^>]*>/g;
    const oembedMatch = dataPost?.legalDoc?.name.match(oembedRegex);
    if (oembedMatch) {
      const oembedUrl = oembedMatch[0].match(/url="([^"]*)"/)[1];
      const split_oembedUrl = oembedUrl.split('&');
      const split_slug = split_oembedUrl[0].split('watch?v=');
      const split_main = split_slug[0] + 'embed/' + split_slug[1];
      const iframeElement = `<iframe src="${split_main}" width="560" height="400" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      setRenderHtml(
        dataPost?.legalDoc?.name.replace(oembedRegex, iframeElement),
      );
    }
  };

  useEffect(() => {
    if (dataPost) {
      renderHtmlText();
    }
  }, [dataPost]);

  return (
    <>
      <Row className='top-information' id='tab-overview'>
        <Col span={24}>
          {loading ? (
            <Skeleton
              className='mb-16'
              paragraph={{rows: 4}}
              loading={loading}
              active
            />
          ) : (
            <>
              <Row gutter={[0, 12]} className='title'>
                <Col xs={24}>
                  <h1
                    className='single-title-main'
                    title={dataPost?.titleText}
                    dangerouslySetInnerHTML={{__html: dataPost?.title}}
                  ></h1>
                </Col>
                <Col xs={24} className='social'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M3.33301 8.45307C3.33301 4.70522 6.31778 1.66699 9.99967 1.66699C13.6816 1.66699 16.6663 4.70522 16.6663 8.45307C16.6663 12.1715 14.5386 16.5107 11.2188 18.0624C10.4449 18.4241 9.55446 18.4241 8.78056 18.0624C5.46078 16.5107 3.33301 12.1715 3.33301 8.45307Z'
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
                  <span className='limit-text limit-text-1'>
                    {dataPost?.address}
                  </span>
                </Col>
                <Col xs={24} className='social'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M4.16699 6.66699C4.16699 4.30997 4.16699 3.13146 4.89923 2.39923C5.63146 1.66699 6.80997 1.66699 9.16699 1.66699H10.8337C13.1907 1.66699 14.3692 1.66699 15.1014 2.39923C15.8337 3.13146 15.8337 4.30997 15.8337 6.66699V13.3337C15.8337 15.6907 15.8337 16.8692 15.1014 17.6014C14.3692 18.3337 13.1907 18.3337 10.8337 18.3337H9.16699C6.80997 18.3337 5.63146 18.3337 4.89923 17.6014C4.16699 16.8692 4.16699 15.6907 4.16699 13.3337V6.66699Z'
                      stroke='#181414'
                    />
                    <path
                      d='M4.16699 3.39648C3.35442 3.47641 2.80746 3.65705 2.39923 4.06528C1.66699 4.79752 1.66699 5.97603 1.66699 8.33305V11.6664C1.66699 14.0234 1.66699 15.2019 2.39923 15.9342C2.80746 16.3424 3.35442 16.523 4.16699 16.603'
                      stroke='#181414'
                    />
                    <path
                      d='M15.833 3.39648C16.6456 3.47641 17.1925 3.65705 17.6008 4.06528C18.333 4.79752 18.333 5.97603 18.333 8.33305V11.6664C18.333 14.0234 18.333 15.2019 17.6008 15.9342C17.1925 16.3424 16.6456 16.523 15.833 16.603'
                      stroke='#181414'
                    />
                    <path
                      d='M7.5 10.833H12.5'
                      stroke='#181414'
                      strokeLinecap='round'
                    />
                    <path
                      d='M7.5 7.5H12.5'
                      stroke='#181414'
                      strokeLinecap='round'
                    />
                    <path
                      d='M7.5 14.167H10'
                      stroke='#181414'
                      strokeLinecap='round'
                    />
                  </svg>
                  <span>
                    <IntlMessages id='common.newCode' />:{' '}
                    {dataPost?.code ? (
                      dataPost?.code
                    ) : (
                      <IntlMessages id='common.updating' />
                    )}
                  </span>
                  <img
                    src={copyImg.src}
                    alt={messages['common.copy']}
                    onClick={() => handleCopyText(dataPost?.code)}
                  />
                </Col>
                <Col xs={24} className='borderBottom price'>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={24}>
                      <label>
                        <IntlMessages id='common.price' />
                      </label>
                      <p>{dataPost?.priceText ? dataPost?.priceText : '--'}</p>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24}>
                  <div className='tab-project'>
                    <Tabs defaultActiveKey='1'>
                      <TabPane tab={messages['common.overview']} key='1'>
                        <TabContent1 dataPost={dataPost} />
                      </TabPane>
                      <TabPane tab={messages['common.investor']} key='2'>
                        <TabContent2
                          dataPost={dataPost}
                          handleShowModalInvestor={handleShowModalInvestor}
                        />
                      </TabPane>
                      <TabPane tab={messages['common.juridical']} key='3'>
                        <TabContent3
                          dataPost={dataPost}
                          renderHtml={renderHtml}
                        />
                      </TabPane>
                      <TabPane tab={messages['common.progress']} key='4'>
                        <TabContent4 dataPost={dataPost} Fancybox={Fancybox} />
                      </TabPane>
                    </Tabs>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>

      {openModalApp && (
        <AppModal
          openModal={openModalApp}
          setOpenModal={setOpenModalApp}
          title={modalData.title}
          className={modalData.className}
          description={modalData.description}
          width={modalData.width}
          submitText={modalData.submitText}
          closeText={modalData.closeText}
          handleSubmit={modalData.handleSubmit}
          handleClose={modalData.handleClose}
        />
      )}
      <ModalLogin
        openModalLogin={openModal}
        setOpenModalLogin={setOpenModal}
        description={<IntlMessages id='common.notiLogin' />}
      />
    </>
  );
};

export default TopInfoProject;
TopInfoProject.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
  Fancybox: PropTypes.any,
  handleCopyText: PropTypes.func,
};
