import React, {useState, useEffect} from 'react';
import {Checkbox, Form, Select} from 'antd';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const FormPoster = () => {
  const {categories} = useSelector((state) => state.categories);
  const [posterOption, setPosterOption] = useState([]);

  useEffect(() => {
    const rePostByCat = categories?.categories?.rePostByCat ?? [];
    const rePostByCatArr = [];
    rePostByCat.forEach((ele) => {
      let options = {
        label: ele?.name,
        value: ele?.code,
      };
      rePostByCatArr?.push(options);
    });
    setPosterOption(rePostByCatArr);
  }, [categories]);

  return (
    <Form.Item
      name='posterFilter'
      className='form-item'
      label={<IntlMessages id='common.poster' />}
    >
      <Checkbox.Group
        className='d-grid grid-template-2 gap-20'
        options={posterOption}
      />
    </Form.Item>
  );
};

export default FormPoster;
FormPoster.propTypes = {};
