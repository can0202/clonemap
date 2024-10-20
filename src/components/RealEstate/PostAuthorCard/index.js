import React, {useState} from 'react';
import {Button, Col, Rate, Row, Skeleton} from 'antd';
import PropTypes from 'prop-types';
import {URL_CMS_SERVER} from 'shared/constants/ConfigApp';
import ModalRating from 'components/ModalRating';
import ModalLogin from 'components/ModalLogin';
import {useSelector} from 'react-redux';
import NoImage from 'assets/img/no-image.png';
import phoneImg from 'assets/icon/phone.png';
import emailImg from 'assets/icon/message.png';
import reportImg from 'assets/icon/report.png';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const PostAuthorCard = (props) => {
  const {messages} = useIntl();
  const {dataPost, loading, handleReport} = props;
  const {accessToken, isAuthenticated, profile} = useSelector(({auth}) => auth);
  const [isToggle, setIsToggle] = useState(true);
  const [openModalRating, setOpenModalRating] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isRating, setIsRating] = useState(false);

  const onClickToggle = () => {
    setIsRating(false);
    if (!isAuthenticated) {
      setOpenModal(true);
      return;
    }
    setIsToggle(!isToggle);
  };

  const handleOpenRating = () => {
    setIsRating(true);
    if (!isAuthenticated) {
      setOpenModal(true);
    } else {
      setOpenModalRating(true);
    }
  };

  return (
    <>
      <div className='sidebar-contact'>
        {loading ? (
          <Skeleton
            className='mb-32'
            paragraph={{
              rows: 4,
            }}
            loading={loading}
            active
          />
        ) : (
          <>
            <Row gutter={[0, 16]}>
              <Col xs={24}>
                <Row gutter={[0, 8]} className='author-title'>
                  <Col xs={24}>
                    <h2
                      dangerouslySetInnerHTML={{__html: dataPost?.title}}
                    ></h2>
                  </Col>
                  <Col xs={24}>
                    <ul>
                      <li>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                        >
                          <path
                            d='M2.66602 6.76187C2.66602 3.76359 5.05383 1.33301 7.99935 1.33301C10.9449 1.33301 13.3327 3.76359 13.3327 6.76187C13.3327 9.73665 11.6305 13.2079 8.97464 14.4493C8.35552 14.7387 7.64318 14.7387 7.02406 14.4493C4.36823 13.2079 2.66602 9.73665 2.66602 6.76187Z'
                            stroke='#6C6868'
                          />
                          <ellipse
                            cx='8'
                            cy='6.66699'
                            rx='2'
                            ry='2'
                            stroke='#6C6868'
                          />
                        </svg>
                        <span className='limit-text limit-text-1'>
                          {dataPost?.address}
                        </span>
                      </li>
                    </ul>
                  </Col>
                  <Col xs={24} className='author-text'>
                    <ul>
                      {dataPost?.areaText && (
                        <li>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                          >
                            <rect
                              x='1.33398'
                              y='1.33301'
                              width='13.3333'
                              height='13.3333'
                              rx='4'
                              stroke='#6C6868'
                            />
                            <path
                              d='M12.0007 4L9.33398 6.66667M12.0007 4H9.33398M12.0007 4V6.66667'
                              stroke='#6C6868'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M4.0013 12L6.66797 9.33333M4.0013 12L6.66797 12M4.0013 12L4.0013 9.33333'
                              stroke='#6C6868'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <span>{dataPost?.areaText}</span>
                        </li>
                      )}

                      {dataPost?.direction?.name && (
                        <li>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                          >
                            <g clipPath='url(#clip0_5440_164363)'>
                              <circle
                                cx='8.00065'
                                cy='7.99967'
                                r='6.66667'
                                stroke='#6C6868'
                              />
                              <path
                                d='M8.68264 9.70673C7.14279 10.3227 6.37286 10.6306 5.9331 10.3318C5.82883 10.2609 5.73889 10.171 5.66804 10.0667C5.3692 9.62697 5.67717 8.85705 6.29311 7.3172C6.42449 6.98875 6.49018 6.82452 6.60316 6.69569C6.63195 6.66286 6.66286 6.63195 6.69569 6.60316C6.82452 6.49018 6.98875 6.42449 7.3172 6.29311C8.85705 5.67717 9.62697 5.3692 10.0667 5.66804C10.171 5.73889 10.2609 5.82883 10.3318 5.9331C10.6306 6.37286 10.3227 7.14279 9.70673 8.68264C9.57535 9.01109 9.50966 9.17532 9.39668 9.30415C9.36789 9.33698 9.33698 9.36789 9.30415 9.39668C9.17532 9.50966 9.01109 9.57535 8.68264 9.70673Z'
                                stroke='#6C6868'
                              />
                            </g>
                            <defs>
                              <clipPath id='clip0_5440_164363'>
                                <rect width='16' height='16' fill='white' />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>{dataPost?.direction?.name}</span>
                        </li>
                      )}
                    </ul>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} className='author-text author-price'>
                <ul>
                  {dataPost?.priceText && (
                    <li className='price'>{dataPost?.priceText}</li>
                  )}
                  {dataPost?.averagePrice?.valueAsString && (
                    <li className='price_erea'>
                      {dataPost?.averagePrice?.valueAsString}
                    </li>
                  )}
                </ul>
              </Col>
              <Col xs={24} className='author-avatar'>
                <div className='avatar'>
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
                    target={`${dataPost?.author?.identifyCode ? '_blank' : ''}`}
                    rel='noopener noreferrer'
                    title={dataPost?.author?.name}
                  >
                    {dataPost?.author?.avatar ? (
                      <img
                        src={dataPost?.author?.avatar}
                        alt={dataPost?.author?.name}
                      />
                    ) : (
                      <img src={NoImage.src} alt={dataPost?.author?.name} />
                    )}
                  </a>
                </div>
                <div className='author-info'>
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
                    target={`${dataPost?.author?.identifyCode ? '_blank' : ''}`}
                    rel='noopener noreferrer'
                    title={dataPost?.author?.name}
                  >
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
                  </a>

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
                    <div className='postRating' title='Đánh giá'>
                      {dataPost?.author?.rating &&
                        dataPost?.author?.rating?.avgRating?.star !== 1 && (
                          <div className='rating' onClick={handleOpenRating}>
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
                            <span className='number-rating'>
                              {dataPost?.author?.rating?.avgRating?.star}
                            </span>
                            <span className='total-rating'>
                              (
                              {
                                dataPost?.author?.rating?.avgRating
                                  ?.totalReviews
                              }{' '}
                              {messages['common.rating'].toLowerCase()})
                            </span>
                          </div>
                        )}
                    </div>
                  </p>
                </div>
              </Col>
              <Col xs={24} className='author-button'>
                <Row gutter={[0, 12]}>
                  <Col xs={24}>
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
                  </Col>
                  <Col xs={24}>
                    <Button
                      type='default'
                      block
                      href={`mailto:${dataPost?.author?.email}`}
                    >
                      <img src={emailImg.src} alt={dataPost?.author?.email} />
                      <span>
                        <IntlMessages id='common.sendEmail' />
                      </span>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Modal Rating */}
            <ModalRating
              dataPost={dataPost}
              openModalRating={openModalRating}
              setOpenModalRating={setOpenModalRating}
              accessToken={accessToken}
              profile={profile}
              isAuthenticated={isAuthenticated}
            />

            {/* Modal Login */}
            <ModalLogin
              openModalLogin={openModal}
              setOpenModalLogin={setOpenModal}
              description={
                isRating ? (
                  <IntlMessages id='common.notiLogin' />
                ) : (
                  <IntlMessages id='common.notiPhoneLogin' />
                )
              }
            />
          </>
        )}
      </div>
      <div className='report' onClick={handleReport}>
        <img src={reportImg.src} alt={messages['common.postReport']} />
        <span>
          <IntlMessages id='common.postReport' />
        </span>
      </div>
    </>
  );
};

export default PostAuthorCard;
PostAuthorCard.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
  handleReport: PropTypes.func,
};
