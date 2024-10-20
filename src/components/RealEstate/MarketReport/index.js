import {Button, Col, Row} from 'antd';
import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {onRealEstatePriceAnalytics} from 'pages/api/vland';
import {useEffect} from 'react';
import {useState} from 'react';
import IntlMessages from '@crema/utility/IntlMessages';

const MarketReport = ({dataPost}) => {
  const {accessToken} = useSelector(({auth}) => auth);
  const [dataReport, setDataReport] = useState(null);

  const fetchApi = async () => {
    const typeCode = dataPost?.typeRealEstate?.code;
    const provinceCode = dataPost?.province?.code;
    const districtCode = dataPost?.district?.code;
    const wardsCode = dataPost?.wards?.code;
    const street = dataPost?.street;
    const res = await onRealEstatePriceAnalytics(
      typeCode,
      provinceCode,
      districtCode,
      wardsCode,
      street,
      accessToken,
    );

    setDataReport(res);
  };

  useEffect(() => {
    if (dataPost) {
      fetchApi();
    }
  }, [dataPost]);

  // lấy item cuối cùng của mãng
  const quarters =
    dataReport?.pricesData[0]?.quarters[
      dataReport?.pricesData[0]?.quarters?.length - 1
    ];

  return (
    <>
      {quarters?.value?.valueAsString && (
        <div className='report-market'>
          <Row gutter={[0, 8]}>
            <Col xs={24} className='title'>
              <Row gutter={[8, 0]} align={'middle'} justify={'space-between'}>
                <Col xs={18}>
                  <span>
                    <IntlMessages id='common.averagePrice' />{' '}
                    {dataPost?.typeRealEstate?.name}{' '}
                    <IntlMessages id='common.averagePriceStreet' />{' '}
                    {dataPost?.street}
                  </span>
                </Col>
                <Col flex={'none'}>
                  <p>{quarters?.label}</p>
                </Col>
              </Row>
            </Col>
            <Col xs={24} className='price'>
              <p>{quarters?.value?.valueAsString || '--'}</p>
            </Col>
            <Col xs={24} className='button'>
              <Button type='outline' href=''>
                <span>
                  <IntlMessages id='common.seePriceDetails' />
                </span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M3.33203 10H16.6654M16.6654 10L11.6654 5M16.6654 10L11.6654 15'
                    stroke='#181414'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default MarketReport;
MarketReport.propTypes = {
  dataPost: PropTypes.any,
};
