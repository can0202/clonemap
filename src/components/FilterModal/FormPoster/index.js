import React, {useState, useEffect} from 'react';
import {Checkbox, Form, Select} from 'antd';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import IntlMessages from '@crema/utility/IntlMessages';

const FormPoster = ({
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  form,
}) => {
  const router = useRouter();
  const CheckboxGroup = Checkbox.Group;
  const {categories} = useSelector((state) => state.categories);
  const rePostByCat = categories?.categories?.rePostByCat ?? [];

  let rePostByCatOptions = [];
  rePostByCat.forEach((ele) => {
    let eleTypesOption = {
      label: ele?.name,
      value: ele?.code,
    };
    rePostByCatOptions?.push(eleTypesOption);
  });

  const onChangePoster = (value) => {
    const newDataObject = {
      ...dataObject,
      postBy: value,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      postBy: value,
    };
    setMapDataObj(newMapDataObj);
  };

  // Xử lý fill value
  useEffect(() => {
    let posterArr = [];
    if (typeof dataObject?.postBy === 'string') {
      posterArr = dataObject?.postBy?.split(',');
    } else if (Array.isArray(dataObject?.postBy)) {
      posterArr = dataObject?.postBy;
    }
    console.log('posterArr', posterArr);
    form?.setFieldsValue({
      poster: posterArr,
    });
  }, []);
  return (
    <>
      <Form.Item
        name='poster'
        className='form-item'
        label={<IntlMessages id='common.poster' />}
      >
        <Checkbox.Group
          className='d-grid grid-template-2 gap-20'
          options={rePostByCatOptions}
          onChange={onChangePoster}
        />
      </Form.Item>
    </>
  );
};

export default FormPoster;
FormPoster.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  form: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
