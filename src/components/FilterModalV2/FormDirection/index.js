import React, {useState, useEffect} from 'react';
import {Checkbox, Col, Form, Row} from 'antd';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const FormDirection = () => {
  const {categories} = useSelector((state) => state.categories);
  const [directionOption, setDirectionOption] = useState([]);

  useEffect(() => {
    const realDirectionCat =
      categories?.categories?.realEstateDirectionCat ?? [];
    const realDirectionArr = [];
    realDirectionCat.forEach((ele) => {
      let options = {
        label: ele?.name,
        value: ele?.code,
      };
      realDirectionArr?.push(options);
    });
    setDirectionOption(realDirectionArr);
  }, [categories]);

  return (
    <>
      <Row gutter={[0, 16]}>
        <Col xs={24}>
          <Form.Item
            name='directionFilter'
            className='form-direction'
            label={<IntlMessages id='common.direction' />}
          >
            <Checkbox.Group
              className='d-grid grid-template-4 gap-20'
              options={directionOption}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default FormDirection;
FormDirection.propTypes = {};
