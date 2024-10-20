import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Anchor, Button, Col, Row} from 'antd';
import {URL_CMS_SERVER} from 'shared/constants/ConfigApp';
import NoImage from 'assets/img/no-image.png';
import IntlMessages from '@crema/utility/IntlMessages';

const HeaderFixedRe = (props) => {
  const {dataPost, handeFixedSideBar, onHandleFavorite, dataState} = props;
  const [isFixed, setIsFixed] = useState(false);
  const [isToggle, setIsToggle] = useState(true);
  const topRef = React.useRef(null);
  const [targetOffset, setTargetOffset] = useState();
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

  const handleCopyText = (params) => {
    navigator.clipboard
      .writeText(params)
      .then(() => {
        message.success(messages['common.copySuccess']);
      })
      .catch((error) => {
        console.log(error);
        message.error(messages['common.copyError']);
      });
  };

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
            items={[
              {
                key: 'tab-overview',
                href: '#tab-overview',
                title: 'Tổng quan',
              },
              {
                key: 'tab-desc',
                href: '#tab-desc',
                title: 'Thông tin mô tả',
              },
              {
                key: 'tab-character',
                href: '#tab-character',
                title: 'Đặc điểm chi tiết',
              },
              {
                key: 'tab-location',
                href: '#tab-location',
                title: 'Vị trí',
              },
              {
                key: 'tab-loan',
                href: '#tab-loan',
                title: 'Dự toán khoản vay',
              },
            ]}
          />
          <div className='navigation-fixed-info d-flex align-center back-history'>
            <Row gutter={[16, 0]} align={'middle'} className='right'>
              <Col>
                <Button
                  type='outline'
                  onClick={() => handleCopyText(dataPost?.detailUrl)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='16'
                    viewBox='0 0 18 16'
                    fill='none'
                  >
                    <path
                      d='M1.20864 15.4811C1.2595 15.4943 1.31054 15.5 1.3614 15.5C1.62436 15.5 1.87528 15.3442 1.99481 15.1002C3.29656 12.4609 5.91429 10.8209 8.8272 10.8209H9.92719V13.8702C9.92719 14.1572 10.0995 14.4153 10.3624 14.5232C10.6225 14.6293 10.9253 14.5654 11.1216 14.3581L17.1402 8.02491C17.3994 7.75278 17.3994 7.32123 17.1402 7.0491L11.1216 0.715951C10.9253 0.508591 10.6244 0.443995 10.3624 0.550853C10.0995 0.658742 9.92719 0.916782 9.92719 1.20386V4.25327H9.69577C4.718 4.25327 0.667969 8.35717 0.667969 13.4011V14.8085C0.667969 15.1349 0.894817 15.4071 1.20864 15.4811Z'
                      stroke='#046CFC'
                    />
                  </svg>{' '}
                  <IntlMessages id='common.share' />
                </Button>
              </Col>
              <Col>
                <Button
                  type='outline'
                  onClick={onHandleFavorite}
                  className={`${dataState?.isFavorite ? 'active' : ''}`}
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
                  </svg>{' '}
                  <IntlMessages id='common.favourite' />
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeaderFixedRe);
HeaderFixedRe.propTypes = {
  dataPost: PropTypes.any,
  handeFixedSideBar: PropTypes.any,
  onHandleFavorite: PropTypes.func,
  dataState: PropTypes.any,
};
