import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Anchor, Avatar, Button} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import NoImage from 'assets/img/no-image.png';
import IntlMessages from '@crema/utility/IntlMessages';

const HeaderFixedPro = (props) => {
  const {dataPost, handeFixedSideBar} = props;
  const [isFixed, setIsFixed] = useState(false);
  const [isToggle, setIsToggle] = useState(true);
  const topRef = React.useRef(null);
  const [targetOffset, setTargetOffset] = useState();
  useEffect(() => {
    setTargetOffset(topRef.current?.clientHeight + 120);
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
                key: 'tab-planDrawing',
                href: '#tab-planDrawing',
                title: 'Sơ đồ mặt bằng',
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
          <div className='navigation-fixed-info d-flex align-center'>
            <div className='info-avartar d-flex align-center'>
              <div className='author-ava'>
                {dataPost?.author?.avatar ? (
                  <img
                    src={dataPost?.author?.avatar}
                    alt={dataPost?.author?.name}
                  />
                ) : (
                  <img src={NoImage.src} alt={dataPost?.author?.name} />
                )}
              </div>
              <div className='avatar_user limit-text limit-text-1'>
                <p>
                  {dataPost?.postAuthor?.name ? (
                    dataPost?.postAuthor?.name
                  ) : (
                    <IntlMessages id='common.updating' />
                  )}
                </p>
              </div>
            </div>
            <div className='info-button d-flex align-center'>
              <a
                href={`mailto: ${dataPost?.postAuthor?.email}`}
                className={`info-button-email btn-email d-flex align-center ${
                  dataPost?.postAuthor?.email ? '' : 'disable'
                } `}
              >
                <svg
                  className='mr-8'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M14.1666 17.0837H5.83329C3.33329 17.0837 1.66663 15.8337 1.66663 12.917V7.08366C1.66663 4.16699 3.33329 2.91699 5.83329 2.91699H14.1666C16.6666 2.91699 18.3333 4.16699 18.3333 7.08366V12.917C18.3333 15.8337 16.6666 17.0837 14.1666 17.0837Z'
                    stroke='#D1132A'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></path>
                  <path
                    d='M14.1667 7.5L11.5584 9.58333C10.7 10.2667 9.2917 10.2667 8.43337 9.58333L5.83337 7.5'
                    stroke='#D1132A'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></path>
                </svg>

                <span>Gửi mail</span>
              </a>
              {dataPost?.postAuthor?.phone ? (
                <Button
                  onClick={onClickToggle}
                  className='info-button-phone d-flex align-items-center'
                >
                  <svg
                    className='mr-8'
                    width='21'
                    height='20'
                    viewBox='0 0 21 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M18.8083 15.2743C18.8083 15.5743 18.7417 15.8827 18.6 16.1827C18.4583 16.4827 18.275 16.766 18.0333 17.0327C17.625 17.4827 17.175 17.8077 16.6667 18.016C16.1667 18.2244 15.625 18.3327 15.0417 18.3327C14.1917 18.3327 13.2833 18.1327 12.325 17.7244C11.3667 17.316 10.4083 16.766 9.45833 16.0744C8.5 15.3744 7.59167 14.5993 6.725 13.741C5.86667 12.8743 5.09167 11.966 4.4 11.016C3.71667 10.066 3.16667 9.11602 2.76667 8.17435C2.36667 7.22435 2.16667 6.31602 2.16667 5.44935C2.16667 4.88268 2.26667 4.34102 2.46667 3.84102C2.66667 3.33268 2.98333 2.86602 3.425 2.44935C3.95833 1.92435 4.54167 1.66602 5.15833 1.66602C5.39167 1.66602 5.625 1.71602 5.83333 1.81602C6.05 1.91602 6.24167 2.06602 6.39167 2.28268L8.325 5.00768C8.475 5.21602 8.58333 5.40768 8.65833 5.59102C8.73333 5.76602 8.775 5.94102 8.775 6.09935C8.775 6.29935 8.71667 6.49935 8.6 6.69102C8.49167 6.88268 8.33333 7.08268 8.13333 7.28268L7.5 7.94102C7.40833 8.03268 7.36667 8.14102 7.36667 8.27435C7.36667 8.34102 7.375 8.39935 7.39167 8.46602C7.41667 8.53268 7.44167 8.58268 7.45833 8.63268C7.60833 8.90768 7.86667 9.26602 8.23333 9.69935C8.60833 10.1327 9.00833 10.5743 9.44167 11.016C9.89167 11.4577 10.325 11.866 10.7667 12.241C11.2 12.6077 11.5583 12.8577 11.8417 13.0077C11.8833 13.0243 11.9333 13.0493 11.9917 13.0743C12.0583 13.0993 12.125 13.1077 12.2 13.1077C12.3417 13.1077 12.45 13.0577 12.5417 12.966L13.175 12.341C13.3833 12.1327 13.5833 11.9743 13.775 11.8743C13.9667 11.7577 14.1583 11.6993 14.3667 11.6993C14.525 11.6993 14.6917 11.7327 14.875 11.8077C15.0583 11.8827 15.25 11.991 15.4583 12.1327L18.2167 14.091C18.4333 14.241 18.5833 14.416 18.675 14.6243C18.7583 14.8327 18.8083 15.041 18.8083 15.2743Z'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeMiterlimit='10'
                    ></path>
                    <path
                      d='M15.9167 7.4987C15.9167 6.9987 15.525 6.23203 14.9417 5.60703C14.4083 5.03203 13.7 4.58203 13 4.58203'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    ></path>
                    <path
                      d='M18.8333 7.49935C18.8333 4.27435 16.225 1.66602 13 1.66602'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    ></path>
                  </svg>
                  <span className='hideNumberPhone'>
                    {isToggle
                      ? dataPost?.postAuthor?.phone.substr(0, 5) + '*****'
                      : dataPost?.postAuthor?.phone}
                  </span>
                </Button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeaderFixedPro);
HeaderFixedPro.propTypes = {
  dataPost: PropTypes.any,
  handeFixedSideBar: PropTypes.any,
};
