import React, {useState, useEffect} from 'react';
import {Checkbox, Form} from 'antd';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import IntlMessages from '@crema/utility/IntlMessages';

const FormDirection = ({
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  form,
}) => {
  const router = useRouter();
  const CheckboxGroup = Checkbox.Group;
  const {categories} = useSelector((state) => state.categories);
  const realDirectionCat = categories?.categories?.realEstateDirectionCat ?? [];

  let realDirectionOptions = [];
  realDirectionCat.forEach((ele) => {
    let eleTypesOption = {
      label: ele?.name,
      value: ele?.code,
    };
    realDirectionOptions?.push(eleTypesOption);
  });

  const onChangeDirection = (value) => {
    const newDataObject = {
      ...dataObject,
      directions: value,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      directions: value,
    };
    setMapDataObj(newMapDataObj);
  };

  // Xử lý fill value
  useEffect(() => {
    let directionArr = [];
    if (typeof dataObject?.directions === 'string') {
      directionArr = dataObject?.directions?.split(',');
    } else if (Array.isArray(dataObject?.directions)) {
      directionArr = dataObject?.directions;
    }

    form.setFieldsValue({
      direction: directionArr,
    });
  }, []);

  return (
    <>
      <Form.Item
        name='direction'
        className='form-direction'
        label={<IntlMessages id='common.direction' />}
      >
        <Checkbox.Group
          className='d-grid grid-template-4 gap-20'
          options={realDirectionOptions}
          onChange={onChangeDirection}
        />
      </Form.Item>
    </>
  );
};

export default FormDirection;
FormDirection.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  form: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
