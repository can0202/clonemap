import {Col, Row} from 'antd';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import documentImg from 'assets/icon/document.png';
import mapImg from 'assets/icon/map_address.png';
import copyImg from 'assets/icon/copy.png';
import calendarImg from 'assets/icon/calendar.png';

const TopInfoRealEstate = ({dataPost, loading, handleCopyText}) => {
  const [titleText, setTitleText] = useState('');
  useEffect(() => {
    if (dataPost) {
      const replaceTitle =
        dataPost &&
        dataPost?.title
          ?.replace(/\n/g, '</br>')
          .replace(/\r\n\r\n/g, '</br>')
          .replace(/\r\n/g, '</br>');
      setTitleText(replaceTitle);
    }
  }, [dataPost]);

  return (
    <>
      <Row className='top-information' id='tab-overview'>
        <Col xs={24}>
          <Row gutter={[0, 12]} className='title'>
            <Col xs={24}>
              <h1
                className='single-title-main'
                dangerouslySetInnerHTML={{__html: titleText}}
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
              <span className='limit-text limit-text-1'>
                {dataPost?.address}
              </span>
            </Col>
            <Col xs={24} className='social'>
              <img
                src={calendarImg.src}
                alt={
                  dataPost?.postDateDuration ? dataPost?.postDateDuration : ''
                }
              />
              <span>
                <IntlMessages id='common.dateSubmitted' />:{' '}
                {dataPost?.postDateDuration ? (
                  dataPost?.postDateDuration
                ) : (
                  <IntlMessages id='common.updating' />
                )}
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
                  d='M4.16602 6.66699C4.16602 4.30997 4.16602 3.13146 4.89825 2.39923C5.63048 1.66699 6.80899 1.66699 9.16602 1.66699H10.8327C13.1897 1.66699 14.3682 1.66699 15.1004 2.39923C15.8327 3.13146 15.8327 4.30997 15.8327 6.66699V13.3337C15.8327 15.6907 15.8327 16.8692 15.1004 17.6014C14.3682 18.3337 13.1897 18.3337 10.8327 18.3337H9.16602C6.80899 18.3337 5.63048 18.3337 4.89825 17.6014C4.16602 16.8692 4.16602 15.6907 4.16602 13.3337V6.66699Z'
                  stroke='#181414'
                />
                <path
                  d='M4.16602 3.39648C3.35344 3.47641 2.80649 3.65705 2.39825 4.06528C1.66602 4.79752 1.66602 5.97603 1.66602 8.33305V11.6664C1.66602 14.0234 1.66602 15.2019 2.39825 15.9342C2.80649 16.3424 3.35344 16.523 4.16602 16.603'
                  stroke='#181414'
                />
                <path
                  d='M15.834 3.39648C16.6466 3.47641 17.1935 3.65705 17.6018 4.06528C18.334 4.79752 18.334 5.97603 18.334 8.33305V11.6664C18.334 14.0234 18.334 15.2019 17.6018 15.9342C17.1935 16.3424 16.6466 16.523 15.834 16.603'
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
              <svg
                style={{cursor: 'pointer'}}
                onClick={() => handleCopyText(dataPost?.code)}
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M5 9.16699C5 6.80997 5 5.63146 5.73223 4.89923C6.46447 4.16699 7.64298 4.16699 10 4.16699H12.5C14.857 4.16699 16.0355 4.16699 16.7678 4.89923C17.5 5.63146 17.5 6.80997 17.5 9.16699V13.3337C17.5 15.6907 17.5 16.8692 16.7678 17.6014C16.0355 18.3337 14.857 18.3337 12.5 18.3337H10C7.64298 18.3337 6.46447 18.3337 5.73223 17.6014C5 16.8692 5 15.6907 5 13.3337V9.16699Z'
                  stroke='#181414'
                />
                <path
                  d='M5 15.8337C3.61929 15.8337 2.5 14.7144 2.5 13.3337V8.33366C2.5 5.19096 2.5 3.61961 3.47631 2.6433C4.45262 1.66699 6.02397 1.66699 9.16667 1.66699H12.5C13.8807 1.66699 15 2.78628 15 4.16699'
                  stroke='#181414'
                />
              </svg>
            </Col>
            <Col xs={24} className='price'>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={10}>
                  <label>
                    {dataPost?.postType?.code === 'bds-ban' ? (
                      <IntlMessages id='common.priceSale' />
                    ) : (
                      <IntlMessages id='common.priceRent' />
                    )}
                  </label>
                  <ul>
                    <li className='price_text'>{dataPost?.priceText}</li>
                    {dataPost?.averagePrice?.valueAsString && (
                      <li>{dataPost?.averagePrice?.valueAsString}</li>
                    )}
                  </ul>
                </Col>
                <Col xs={24} md={7}>
                  <label>
                    <IntlMessages id='common.acreage' />
                  </label>
                  <span>
                    {dataPost?.squareText ? dataPost?.squareText : '--'}
                  </span>
                </Col>
                <Col xs={24} md={7}>
                  <label>
                    <IntlMessages id='common.direction' />
                  </label>
                  <span>
                    {dataPost?.direction ? dataPost?.direction?.name : '--'}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default TopInfoRealEstate;
TopInfoRealEstate.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
  handleCopyText: PropTypes.func,
};
