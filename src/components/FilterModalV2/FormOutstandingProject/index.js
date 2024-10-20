import React, {useState, useEffect} from 'react';
import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const OutstandingProject = () => {
  // const onChange = (e) => {
  //   setIsChecked(/true/.test(e.target.checked));
  // };

  return (
    <Form.Item name='outstandingFilter' valuePropName='checked'>
      <Checkbox>
        <IntlMessages id='common.outstandingProject' />
      </Checkbox>
    </Form.Item>
  );
};

export default OutstandingProject;
OutstandingProject.propTypes = {};
