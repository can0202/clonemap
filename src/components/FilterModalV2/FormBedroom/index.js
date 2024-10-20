import React, {useEffect} from 'react';
import {Checkbox, Col, Form, Row} from 'antd';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const FormBedroom = () => {
  const optionsBedroom = [
    {value: '0', label: '0'},
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'},
    {value: '4', label: '4'},
    {value: '5', label: '5+'},
  ];
  return (
    <>
      <Form.Item
        name='bedroomFilter'
        className='form-item filter-box-bedroom'
        label={<IntlMessages id='common.numberBedrooms' />}
      >
        <Checkbox.Group
          className='d-grid grid-template-6 grid gap-10'
          options={optionsBedroom}
        />
      </Form.Item>
    </>
  );
};

export default FormBedroom;
FormBedroom.propTypes = {
  // handleChangeBedroom: PropTypes.func,
};
