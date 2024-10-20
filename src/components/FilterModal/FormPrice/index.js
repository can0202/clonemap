import React, {useState, useEffect} from 'react';
import {Slider, Form} from 'antd';
import PropTypes from 'prop-types';
import {nFormatter} from '@crema/utility/NumberFormatter';
import IntlMessages from '@crema/utility/IntlMessages';

const FormPrice = ({
  dataObject,
  setDataObject,
  setPriceLabel,
  priceLabel,
  switchMap,
  mapDataObj,
  setMapDataObj,
  postType,
}) => {
  const {messages} = useIntl();
  const onChangePrice = (value) => {
    const price_from = value[0] ?? '';
    const price_to = value[1] ?? '';
    const newDataObject = {
      ...dataObject,
      priceFrom: price_from,
      priceTo: price_to,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      priceFrom: price_from,
      priceTo: price_to,
    };
    setMapDataObj(newMapDataObj);

    if (price_from == 0) {
      setPriceLabel('Dưới ' + nFormatter(price_to));
    } else {
      setPriceLabel(nFormatter(price_from) + '-' + nFormatter(price_to));
    }
  };

  useEffect(() => {
    let price_to;
    if (!switchMap) {
      const price_from = dataObject?.priceFrom ?? '';
      if (postType === 'bds-cho-thue') {
        price_to = dataObject?.priceTo
          ? dataObject?.priceTo
          : `100 ${messages['common.featureComminsoon']}`;
      } else {
        price_to = dataObject?.priceTo ? dataObject?.priceTo : '50 tỷ';
      }
      if (price_from == 0) {
        setPriceLabel('Dưới ' + nFormatter(price_to));
      } else {
        setPriceLabel(nFormatter(price_from) + '-' + nFormatter(price_to));
      }
    } else {
      const price_from = mapDataObj?.priceFrom ?? '';
      if (postType === 'bds-cho-thue') {
        price_to = mapDataObj?.priceTo ? mapDataObj?.priceTo : '100 triệu';
      } else {
        price_to = mapDataObj?.priceTo ? mapDataObj?.priceTo : '50 tỷ';
      }
      if (price_from == 0) {
        setPriceLabel('Dưới ' + nFormatter(price_to));
      } else {
        setPriceLabel(nFormatter(price_from) + '-' + nFormatter(price_to));
      }
    }
  }, [postType]);
  return (
    <>
      <div className='filter-box-price'>
        <div className='title-price'>
          <h4>
            <IntlMessages id='common.price' />
          </h4>
          <div className='form-item-text'>
            {postType === 'bds-cho-thue' ? (
              <div className='label-text-number'>
                {priceLabel ? priceLabel : 'Dưới 100 triệu'}
              </div>
            ) : (
              <div className='label-text-number'>
                {priceLabel ? priceLabel : 'Dưới 50 tỷ'}
              </div>
            )}
          </div>
        </div>
        <Form.Item name='price' className='form-price'>
          {postType === 'bds-cho-thue' ? (
            <>
              <Slider
                range
                step={100}
                min={0}
                max={100000000}
                defaultValue={[0, 100000000]}
                tooltip={{
                  open: false,
                }}
                onAfterChange={onChangePrice}
              />
            </>
          ) : (
            <>
              <Slider
                range
                step={100}
                min={0}
                max={50000000000}
                defaultValue={[0, 50000000000]}
                tooltip={{
                  open: false,
                }}
                onAfterChange={onChangePrice}
              />
            </>
          )}
        </Form.Item>
      </div>
    </>
  );
};

export default FormPrice;
FormPrice.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  priceLabel: PropTypes.any,
  setPriceLabel: PropTypes.any,
  switchMap: PropTypes.bool,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
  postType: PropTypes.string,
};
