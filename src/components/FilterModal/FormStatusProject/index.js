import React from 'react';
import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import IntlMessages from '@crema/utility/IntlMessages';

const FormStatusProject = ({
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  form,
}) => {
  const CheckboxGroup = Checkbox.Group;
  const router = useRouter();

  const {categories} = useSelector((state) => state.categories);
  const reProjectStatusCat = categories?.categories?.reProjectStatusCat ?? [];
  let reProjectStatusCatOptions = [];
  reProjectStatusCat.forEach((ele) => {
    let eleTypesOption = {
      label: ele?.name,
      value: ele?.code,
    };
    reProjectStatusCatOptions?.push(eleTypesOption);
  });
  const onChangeStatusProject = (value) => {
    const newDataObject = {
      ...dataObject,
      status: value,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      status: value,
    };
    setMapDataObj(newMapDataObj);
  };

  // Xử lý fill value

  useEffect(() => {
    let statusArr = [];
    if (typeof dataObject?.status === 'string') {
      statusArr = dataObject?.status?.split(',');
    } else if (Array.isArray(dataObject?.status)) {
      statusArr = dataObject?.status;
    }
    console.log('statusArr', statusArr);
    form?.setFieldsValue({
      status: statusArr,
    });
  }, []);
  return (
    <>
      <Form.Item
        name='status'
        className='form-item filter-box-bedroom'
        label={<IntlMessages id='common.openSaleStatus' />}
      >
        <CheckboxGroup
          className='d-grid grid-template-2 grid gap-10'
          options={reProjectStatusCatOptions}
          onChange={onChangeStatusProject}
        />
      </Form.Item>
    </>
  );
};

export default FormStatusProject;
FormStatusProject.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
  form: PropTypes.any,
};
