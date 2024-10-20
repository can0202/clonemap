import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Anchor, Button, Col, Row} from 'antd';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import shareImg from 'assets/icon/share_blue.png';

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

  const onClickToggle = () => {
    setIsToggle(!isToggle);
  };

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

  return (
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
                  <img src={shareImg.src} alt={messages['common.share']} />{' '}
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
          </div>
        </div>
      </div>
    </div>
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
