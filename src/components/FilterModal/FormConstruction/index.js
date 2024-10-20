import React, {useEffect} from 'react';
import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';

const FormConstruction = ({
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  form,
}) => {
  const CheckboxGroup = Checkbox.Group;
  const {categories} = useSelector((state) => state.categories);
  const reConstructionCat =
    categories?.categories?.reConstructionStatusCat ?? [];
  let reConstructionCatOptions = [];
  reConstructionCat.forEach((ele) => {
    let eleTypesOption = {
      label: ele?.name,
      value: ele?.code,
    };
    reConstructionCatOptions?.push(eleTypesOption);
  });
  const onChangeConstruction = (value) => {
    const newDataObject = {
      ...dataObject,
      subStatus: value,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      subStatus: value,
    };
    setMapDataObj(newMapDataObj);
  };

  // Xử lý fill value
  useEffect(() => {
    let subStatusArr = [];
    if (typeof dataObject?.subStatus === 'string') {
      subStatusArr = dataObject?.subStatus?.split(',');
    } else if (Array.isArray(dataObject?.subStatus)) {
      subStatusArr = dataObject?.subStatus;
    }
    console.log('subStatusArr', subStatusArr);
    form?.setFieldsValue({
      subStatus: subStatusArr,
    });
  }, []);

  return (
    <>
      <Form.Item
        name='subStatus'
        className='form-item filter-box-bedroom'
        label={<IntlMessages id='common.constructionStatus' />}
      >
        <CheckboxGroup
          className='d-grid grid-template-2 grid gap-10'
          options={reConstructionCatOptions}
          onChange={onChangeConstruction}
        />
      </Form.Item>
    </>
  );
};

export default FormConstruction;
FormConstruction.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  form: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
