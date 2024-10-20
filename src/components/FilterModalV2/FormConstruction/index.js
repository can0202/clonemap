import React, {useEffect} from 'react';
import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import IntlMessages from '@crema/utility/IntlMessages';

const FormConstruction = () => {
  const CheckboxGroup = Checkbox.Group;
  const {categories} = useSelector((state) => state.categories);
  const [constructionOption, setConstructionOption] = useState([]);

  useEffect(() => {
    if (categories) {
      const reConstructionCat =
        categories?.categories?.reConstructionStatusCat ?? [];
      let reConstructionCatOptions = [];
      reConstructionCat?.forEach((ele) => {
        let options = {
          label: ele?.name,
          value: ele?.code,
        };
        reConstructionCatOptions?.push(options);
      });
      setConstructionOption(reConstructionCatOptions);
    }
  }, [categories]);

  return (
    <Form.Item
      name='subStatusFilter'
      className='form-item filter-box-bedroom'
      label={<IntlMessages id='common.constructionStatus' />}
    >
      <CheckboxGroup
        className='d-grid grid-template-2 grid gap-10'
        options={constructionOption}
      />
    </Form.Item>
  );
};

export default FormConstruction;
