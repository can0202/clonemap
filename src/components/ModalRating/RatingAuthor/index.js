import {Button, Skeleton} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import NoImage from 'assets/img/no-image.png';

const RatingAuthor = ({
  dataRate,
  setOpenRating,
  isAuthenticated,
  profile,
  setOpenModal,
  setOpenProfile,
}) => {
  // convert text name
  const textNameAuthor = dataRate?.agentInfo?.fullName;
  const arayyText = textNameAuthor?.split(' ');
  const arrayTextLast = arayyText ? arayyText[arayyText?.length - 1] : '';
  const textLast = arrayTextLast?.substring(0, 1);

  const handleRating = () => {
    if (!isAuthenticated) {
      setOpenModal(true);
    } else {
      // kiểm tra có tick xanh
      if (profile?.enrollInfo?.step === 3) {
        setOpenRating(true);
      } else {
        // Kiểm tra  -> màn hình hội viên
        setOpenProfile(true);
      }
    }
  };
  return (
    <>
      <div className='rating-author-inner d-flex justify-between align-center'>
        <div className={`rating-author-user d-flex align-center`}>
          <div className='author-avatar'>
            {dataRate?.agentInfo?.avatar ? (
              <img
                src={dataRate?.agentInfo?.avatar}
                alt={dataRate?.agentInfo?.fullName}
              />
            ) : (
              <img src={NoImage.src} alt={dataRate?.author?.name} />
            )}
          </div>
          <div className='author-info'>
            <p className='d-flex align-center'>
              <span className='name'>
                {dataRate?.agentInfo?.fullName ? (
                  dataRate?.agentInfo?.fullName
                ) : (
                  <IntlMessages id='common.updating' />
                )}
              </span>
              {dataRate?.agentInfo?.varsIconUrl && (
                <span className='icon-tick'>
                  <img src={dataRate?.agentInfo?.varsIconUrl} />
                </span>
              )}
            </p>
            <p className='postBy' title={dataRate?.agentInfo?.jobType?.name}>
              {dataRate?.agentInfo?.jobType?.name}
            </p>
          </div>
        </div>
        <div className='rating-author-info d-flex align-center text-center'>
          <div className='rating-number'>
            <span className='f-600'>
              {dataRate?.agentInfo?.rating?.avgRating?.totalReviews}
            </span>
            <span style={{display: 'block'}}>
              <IntlMessages id='common.numberOfRating' />
            </span>
          </div>
          <div className='rating-role'>
            <span className='f-600'>
              {dataRate?.agentInfo?.rating?.avgRating?.star}
              <svg
                width='17'
                height='16'
                viewBox='0 0 17 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M9.65602 2.29306L10.8297 4.6566C10.9897 4.9789 11.4165 5.3012 11.7721 5.35492L13.8971 5.71303C15.2575 5.9458 15.5776 6.93061 14.5996 7.91542L12.9458 9.58959C12.6702 9.86713 12.5101 10.4133 12.599 10.8072L13.0703 12.8753C13.4437 14.5047 12.5812 15.1403 11.1498 14.2898L9.15811 13.0991C8.79357 12.8842 8.20675 12.8842 7.84221 13.0991L5.84168 14.2809C4.41019 15.1314 3.54774 14.4957 3.92118 12.8663L4.39241 10.7982C4.48132 10.4133 4.32128 9.86713 4.04565 9.58064L2.40077 7.92437C1.42274 6.93956 1.74282 5.9458 3.10318 5.72198L5.22819 5.36387C5.58384 5.3012 6.01062 4.98785 6.17066 4.66555L7.3443 2.30201C7.97558 1.01281 9.02475 1.01281 9.65602 2.29306Z'
                  fill='#FFC700'
                />
              </svg>
            </span>
            <span style={{display: 'block'}}>
              <IntlMessages id='common.ratingPoint' />
            </span>
          </div>
          {profile?.ssoId !== dataRate?.agentInfo?.authorId && (
            <div className='rating-button'>
              <Button type='primary' className='btn' onClick={handleRating}>
                <IntlMessages id='common.ratingDate' />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RatingAuthor;
RatingAuthor.propTypes = {
  dataRate: PropTypes.any,
  setOpenRating: PropTypes.any,
  isAuthenticated: PropTypes.any,
  profile: PropTypes.any,
  setOpenModal: PropTypes.any,
  setOpenProfile: PropTypes.any,
};
