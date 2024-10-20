import {Col, Row, Select} from 'antd';
import {AppstoreOutlined, UnorderedListOutlined} from '@ant-design/icons';
import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import IconArrow from 'assets/icon/ArrowDown.png';
import {useIntl} from 'react-intl';

const TitleMap = ({
  total,
  setClassNameActive,
  mapDataObj,
  setMapDataObj,
  setIsReloadMap,
}) => {
  const {messages} = useIntl();
  const {categories} = useSelector((state) => state.categories);
  const sortByCats = categories?.categories?.sortByCat ?? [];
  let sortCatOptions = [];
  sortByCats.forEach((ele) => {
    let eleOption = {
      label: ele?.name,
      value: ele?.code,
    };
    sortCatOptions?.push(eleOption);
  });

  const onChangeSortBy = (e) => {
    const newDataMap = {
      ...mapDataObj,
      sortBy: e,
    };
    setMapDataObj(newDataMap);
    setIsReloadMap(true);
  };
  return (
    <>
      <Row className='view-control-title align-center'>
        <Col span={18} className='view-control-title-inner'>
          <h1 className='title-archive title-breadcrum-search limit-text limit-text-1 mr-8'>
            {' '}
            Mua bán bất động sản
          </h1>
        </Col>
        <Col span={6} className='text-right view-control-title-result'>
          <div className={`total-result ${!total ? 'd-none' : ''}`}>
            ({total} kết quả)
          </div>
        </Col>
      </Row>
      <div className='view-list-grid d-flex justify-between'>
        <div>
          <div className='select view-order'>
            <Select
              suffixIcon={<img src={IconArrow.src} alt='' />}
              defaultValue={messages['common.default']}
              style={{
                width: 120,
              }}
              onChange={onChangeSortBy}
              bordered={false}
              options={sortCatOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) => {
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase());
              }}
            />
          </div>
        </div>
        <div>
          <div className='view-main d-flex align-center'>
            <div
              onClick={() => setClassNameActive(true)}
              className='product-view view-grid'
              data-view='grid'
              title='Grid'
            >
              <AppstoreOutlined />
            </div>
            <div
              onClick={() => setClassNameActive(false)}
              className='product-view view-list'
              data-view='list'
              title='List'
            >
              <UnorderedListOutlined />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitleMap;
TitleMap.propTypes = {
  total: PropTypes.number,
  setClassNameActive: PropTypes.func,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.any,
  setIsReloadMap: PropTypes.func,
};
