import React from 'react';
import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import IntlMessages from '@crema/utility/IntlMessages';
import {useState} from 'react';

const FormStatusProject = () => {
  const CheckboxGroup = Checkbox.Group;
  const router = useRouter();
  const {categories} = useSelector((state) => state.categories);
  const [projectCatOption, setProjectCatOption] = useState([]);

  useEffect(() => {
    if (categories) {
      const reProjectStatusCat =
        categories?.categories?.reProjectStatusCat ?? [];
      let projectCatOptions = [];
      reProjectStatusCat?.forEach((ele) => {
        let options = {
          label: ele?.name,
          value: ele?.code,
        };
        projectCatOptions?.push(options);
      });
      setProjectCatOption(projectCatOptions);
    }
  }, [categories]);

  return (
    <Form.Item
      name='statusFilter'
      className='form-item filter-box-bedroom'
      label={<IntlMessages id='common.openSaleStatus' />}
    >
      <CheckboxGroup
        className='d-grid grid-template-2 grid gap-10'
        options={projectCatOption}
      />
    </Form.Item>
  );
};

export default FormStatusProject;
