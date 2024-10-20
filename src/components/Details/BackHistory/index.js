import IntlMessages from '@crema/utility/IntlMessages';
import {Button, Col, Row} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import shareImg from 'assets/icon/share_blue.png';
import arrowLefImg from 'assets/icon/arrow_left.png';
import {useIntl} from 'react-intl';

const BackHistory = ({
  dataPost,
  onHandleFavorite,
  dataState,
  handleCopyText,
}) => {
  const router = useRouter();
  const historyStack = [];
  const {messages} = useIntl();

  const customBack = () => {
    const previousUrl = historyStack.pop();
    if (previousUrl) {
      router.push(previousUrl);
    } else {
      router.back();
    }
  };

  return (
    <Row className='back-history' align={'middle'} justify={'space-between'}>
      <Col className='left'>
        <Button type='outline' onClick={customBack}>
          <img src={arrowLefImg.src} alt='Back' />{' '}
        </Button>
      </Col>
      <Col className='right'>
        <Row gutter={[16, 0]} align={'middle'}>
          <Col>
            <Button
              type='outline'
              onClick={() => handleCopyText(dataPost?.detailUrl)}
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
      </Col>
    </Row>
  );
};

export default BackHistory;
BackHistory.propTypes = {
  dataPost: PropTypes.any,
  onHandleFavorite: PropTypes.func,
  handleCopyText: PropTypes.func,
  dataState: PropTypes.any,
};
