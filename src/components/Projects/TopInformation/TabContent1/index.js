import React from 'react';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {useEffect} from 'react';
import {Col, Row, Tooltip} from 'antd';
import IntlMessages from '@crema/utility/IntlMessages';

const TabContent1 = ({dataPost}) => {
  const [styleStatus, setStyleStatus] = useState('');
  useEffect(() => {
    switch (dataPost?.reStatus?.code) {
      case '1':
        setStyleStatus('updating');
        break;
      case '2':
        setStyleStatus('open-sale');
        break;
      case '3':
        setStyleStatus('one-sale');
        break;
      case '4':
        setStyleStatus('handed-over');
        break;
      default:
        break;
    }
  }, []);

  return (
    <>
      <Row gutter={[16, 8]} className='section-tab'>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.status' />
            </Col>
            <Col
              xs={14}
              className={`info-tab ${styleStatus} text-right`}
              style={{color: `#${dataPost?.reStatus?.color}`}}
            >
              {dataPost?.reStatus?.name ? dataPost?.reStatus?.name : '--'}
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.typeDetail' />
            </Col>
            <Col xs={14} className='text-right'>
              <Tooltip
                title={
                  <p className='content'>
                    {dataPost?.typeRealEstate
                      ? dataPost?.typeRealEstate?.name
                      : ''}
                  </p>
                }
              >
                <p className='limit-text limit-text-1'>
                  {dataPost?.typeRealEstate
                    ? dataPost?.typeRealEstate?.name
                    : '--'}
                </p>
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.acreage' />
            </Col>
            <Col xs={14} className='text-right'>
              <Tooltip
                title={
                  <p className='content'>
                    {dataPost?.squareText ? dataPost?.squareText : '--'}
                  </p>
                }
              >
                <p className='limit-text limit-text-1'>
                  {dataPost?.squareText ? dataPost?.squareText : '--'}
                </p>
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.constructionArea' />
            </Col>
            <Col xs={14} className='text-right'>
              <Tooltip
                title={
                  <p className='content'>
                    {dataPost?.constructionAreaText ? (
                      dataPost?.constructionAreaText
                    ) : (
                      <IntlMessages id='common.updating' />
                    )}
                  </p>
                }
              >
                <p className='limit-text limit-text-1'>
                  {dataPost?.constructionAreaText ? (
                    dataPost?.constructionAreaText
                  ) : (
                    <IntlMessages id='common.updating' />
                  )}
                </p>
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.deliveryDate' />
            </Col>
            <Col xs={14} className='text-right'>
              <Tooltip
                title={
                  <p className='content'>
                    {dataPost?.deliveryTime ? (
                      dataPost?.deliveryTime
                    ) : (
                      <IntlMessages id='common.updating' />
                    )}
                  </p>
                }
              >
                <p className='limit-text limit-text-1'>
                  {dataPost?.deliveryTime ? (
                    dataPost?.deliveryTime
                  ) : (
                    <IntlMessages id='common.updating' />
                  )}
                </p>
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.apartment' />
            </Col>
            <Col xs={14} className='text-right'>
              <Tooltip
                title={
                  <p className='content'>
                    {dataPost?.totalApartment ? (
                      dataPost?.totalApartment
                    ) : (
                      <IntlMessages id='common.updating' />
                    )}
                  </p>
                }
              >
                <p className='limit-text limit-text-1'>
                  {dataPost?.totalApartment ? (
                    dataPost?.totalApartment
                  ) : (
                    <IntlMessages id='common.updating' />
                  )}
                </p>
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.constructionStatus' />
            </Col>
            <Col xs={14} className='text-right'>
              <Tooltip
                title={
                  <p className='content'>
                    {dataPost?.constructionStatus ? (
                      dataPost?.constructionStatus?.name
                    ) : (
                      <IntlMessages id='common.updating' />
                    )}
                  </p>
                }
              >
                <p className='limit-text limit-text-1'>
                  {dataPost?.constructionStatus ? (
                    dataPost?.constructionStatus?.name
                  ) : (
                    <IntlMessages id='common.updating' />
                  )}
                </p>
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className='item'>
          <Row align={'middle'} justify={'space-between'}>
            <Col xs={10}>
              <IntlMessages id='common.scale' />
            </Col>
            <Col xs={14} className='text-right'>
              <Tooltip
                title={
                  <p className='content'>
                    {dataPost?.scale ? (
                      dataPost?.scale
                    ) : (
                      <IntlMessages id='common.updating' />
                    )}
                  </p>
                }
              >
                <p className='limit-text limit-text-1'>
                  {dataPost?.scale ? (
                    dataPost?.scale
                  ) : (
                    <IntlMessages id='common.updating' />
                  )}
                </p>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default TabContent1;
TabContent1.propTypes = {
  dataPost: PropTypes.any,
};
