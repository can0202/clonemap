import React, {useState, useEffect} from 'react';
import {Slider, Form, Row, Col, Input} from 'antd';
import PropTypes from 'prop-types';
import {nFormatter} from '@crema/utility/NumberFormatter';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const FormPriceArea = ({
  form,
  dataObject,
  setDataObject,
  setPriceLabel,
  priceLabel,
  switchMap,
  mapDataObj,
  setMapDataObj,
  postType,
  setAreaLabel,
  areaLabel,
}) => {
  const {messages} = useIntl();
  const nFormatterPrice = (num) => {
    if (num >= 1000000000) {
      return (
        (num / 1000000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.billion']
      );
    }
    if (num >= 1000000) {
      return (
        (num / 1000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.million']
      );
    }
    return num;
  };
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
  };

  useEffect(() => {
    let price_to;
    if (!switchMap) {
      if (postType === 'bds-cho-thue') {
        price_to = dataObject?.priceTo
          ? dataObject?.priceTo
          : nFormatterPrice(100000000);
      } else {
        price_to = dataObject?.priceTo
          ? dataObject?.priceTo
          : nFormatterPrice(50000000000);
      }
    } else {
      if (postType === 'bds-cho-thue') {
        price_to = mapDataObj?.priceTo
          ? mapDataObj?.priceTo
          : nFormatterPrice(100000000);
      } else {
        price_to = mapDataObj?.priceTo
          ? mapDataObj?.priceTo
          : nFormatterPrice(50000000000);
      }
    }
  }, [postType]);

  const onChangeArea = (value) => {
    const area_from = value[0] ?? '';
    const area_to = value[1] ?? '';
    const newDataObject = {
      ...dataObject,
      areaFrom: area_from,
      areaTo: area_to,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      areaFrom: area_from,
      areaTo: area_to,
    };
    setMapDataObj(newMapDataObj);
  };

  const dataForm = form.getFieldsValue();
  useEffect(() => {
    if (dataForm) {
      setAreaLabel(dataForm?.area);
      setPriceLabel(dataForm?.price);
    }
  }, [dataForm]);

  useEffect(() => {
    const area_from = dataObject.areaFrom || 0;
    const area_to = dataObject.areaTo || 500;
    setAreaLabel([area_from, area_to]);
  }, []);

  useEffect(() => {
    const price_from =
      dataObject?.priceFrom === '-1' || dataObject?.priceFrom === ''
        ? 0
        : dataObject?.priceFrom;

    const price_to =
      dataObject?.priceTo === '-1' || dataObject?.priceTo === ''
        ? 50000000000
        : dataObject?.priceTo;

    const area_from = dataObject?.areaFrom ? dataObject?.areaFrom : 0;
    const area_to = dataObject?.areaTo ? dataObject?.areaTo : 500;
    const map_price_from =
      mapDataObj?.priceFrom === '-1' || mapDataObj?.priceTo === null
        ? 0
        : mapDataObj?.priceFrom;
    const map_price_to =
      mapDataObj?.priceTo === '-1' || mapDataObj?.priceTo === null
        ? 50000000000
        : mapDataObj?.priceTo;
    if (switchMap) {
      if (mapDataObj?.priceFrom && mapDataObj?.priceFrom) {
        form.setFieldsValue({
          price: [map_price_from, map_price_to],
          area: [area_from, area_to],
        });
      }
    } else {
      if (dataObject?.priceFrom && dataObject?.priceTo) {
        form.setFieldsValue({
          price: [price_from, price_to],
          area: [area_from, area_to],
        });
      }
    }
  }, [dataObject, mapDataObj]);

  return (
    <>
      <Row gutter={[0, 16]}>
        <Col xs={24}>
          <h4>
            <IntlMessages id='common.detail' />
          </h4>
        </Col>
        <Col xs={24}>
          <Row gutter={[16, 16]}>
            <Col xs={12}>
              <Row gutter={[0, 16]}>
                <Col xs={24}>
                  <Form.Item
                    name='area'
                    label={<IntlMessages id='common.acreage' />}
                  >
                    <Slider
                      range
                      step={10}
                      min={0}
                      max={500}
                      defaultValue={[0, 500]}
                      tooltip={{
                        open: false,
                      }}
                      onAfterChange={onChangeArea}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Row gutter={[16, 8]} className='text-number-price-area'>
                    <Col xs={24} md={12}>
                      <label>
                        <IntlMessages id='common.smallest' />
                      </label>
                      <div className='text-number'>
                        <Input
                          suffix='m²'
                          value={nFormatter(areaLabel ? areaLabel[0] : 0)}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <label>
                        <IntlMessages id='common.biggest' />
                      </label>
                      <div className='text-number'>
                        <Input
                          suffix='m²'
                          value={nFormatter(areaLabel ? areaLabel[1] : 500)}
                          disabled
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row gutter={[0, 16]}>
                <Col xs={24}>
                  <Form.Item
                    name='price'
                    className='form-price'
                    label={<IntlMessages id='common.price' />}
                  >
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
                </Col>
                <Col xs={24}>
                  <Row gutter={[16, 8]} className='text-number-price-area'>
                    <Col xs={24} md={12}>
                      <label>
                        <IntlMessages id='common.shortest' />
                      </label>
                      <div className='text-number'>
                        <Input
                          suffix='VND'
                          value={nFormatterPrice(
                            priceLabel && priceLabel[0] !== ''
                              ? priceLabel[0]
                              : 0,
                          )}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <label>
                        <IntlMessages id='common.tallest' />
                      </label>
                      <div className='text-number'>
                        {postType === 'bds-cho-thue' ? (
                          <Input
                            suffix='VND'
                            value={nFormatterPrice(
                              priceLabel && priceLabel[1] !== ''
                                ? priceLabel[1]
                                : 100000000,
                            )}
                            disabled
                          />
                        ) : (
                          <Input
                            suffix='VND'
                            value={nFormatterPrice(
                              priceLabel && priceLabel[1] !== ''
                                ? priceLabel[1]
                                : 50000000000,
                            )}
                            disabled
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default FormPriceArea;
FormPriceArea.propTypes = {
  form: PropTypes.any,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  priceLabel: PropTypes.any,
  setPriceLabel: PropTypes.any,
  areaLabel: PropTypes.any,
  setAreaLabel: PropTypes.any,
  switchMap: PropTypes.bool,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
  postType: PropTypes.string,
};
