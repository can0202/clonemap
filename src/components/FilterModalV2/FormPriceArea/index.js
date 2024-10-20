import React, {useState, useEffect} from 'react';
import {Slider, Form, Row, Col, Input} from 'antd';
import PropTypes from 'prop-types';
import {nFormatter} from '@crema/utility/NumberFormatter';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const FormPriceArea = ({postType, form}) => {
  const priceHome = Form.useWatch('priceFilter', form);
  const areaHome = Form.useWatch('areaFilter', form);
  const {messages} = useIntl();
  const [labelPrice, setLabelPrice] = useState('');
  const [labelArea, setLabelArea] = useState('');
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

  useEffect(() => {
    if (postType === 'bds-cho-thue') {
      setLabelPrice([0, 100000000]);
    } else {
      setLabelPrice([0, 50000000000]);
    }
  }, [postType]);
  const onChangePrice = (value) => {
    setLabelPrice(value);
  };

  const onChangeArea = (value) => {
    setLabelArea(value);
  };

  useEffect(() => {
    if (priceHome && priceHome?.length > 1) {
      const priceHome1 = priceHome[0] || 0;
      const priceHome2 =
        priceHome[1] || (postType === 'bds-cho-thue' ? 100000000 : 50000000000);
      setLabelPrice([priceHome1, priceHome2]);
    }
    if (areaHome && areaHome?.length > 1) {
      const areaForm = areaHome[0] || 0;
      const areaTo = areaHome[1] || 500;
      setLabelArea([areaForm, areaTo]);
    }
  }, [priceHome, areaHome]);

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
                    name='areaFilter'
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
                          value={nFormatter(labelArea ? labelArea[0] : 0)}
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
                          value={nFormatter(labelArea ? labelArea[1] : 0)}
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
                    name='priceFilter'
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
                            labelPrice ? labelPrice[0] : 0,
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
                        <Input
                          suffix='VND'
                          value={nFormatterPrice(
                            labelPrice ? labelPrice[1] : 0,
                          )}
                          disabled
                        />
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
  postType: PropTypes.string,
  form: PropTypes.any,
};
