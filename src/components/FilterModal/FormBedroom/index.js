import React, {useEffect} from 'react';
import {Checkbox, Col, Form, Row} from 'antd';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import IntlMessages from '@crema/utility/IntlMessages';

const FormBedroom = ({
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  form,
}) => {
  const router = useRouter();
  const CheckboxGroup = Checkbox.Group;
  const optionsBedroom = [
    {value: '0', label: '0'},
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'},
    {value: '4', label: '4'},
    {value: '5', label: '5+'},
  ];
  const onChangeBedroom = (value) => {
    const newDataObject = {
      ...dataObject,
      bedrooms: value[0] === '' ? '' : value,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      bedrooms: value[0] === '' ? [] : value,
    };
    setMapDataObj(newMapDataObj);
  };

  // Xử lý fill value
  useEffect(() => {
    let bedroomArr = [];
    if (typeof dataObject?.bedrooms === 'string') {
      bedroomArr = dataObject?.bedrooms?.split(',');
    } else if (Array.isArray(dataObject?.bedrooms)) {
      bedroomArr = dataObject?.bedrooms;
    }
    console.log('bedroomArr', bedroomArr);
    form.setFieldsValue({
      bedroom: bedroomArr,
    });
  }, []);
  return (
    <>
      <Form.Item
        name='bedroom'
        className='form-item filter-box-bedroom'
        label={<IntlMessages id='common.numberBedrooms' />}
      >
        <Checkbox.Group
          className='d-grid grid-template-6 grid gap-10'
          options={optionsBedroom}
          onChange={onChangeBedroom}
        />
      </Form.Item>
    </>
  );
};

export default FormBedroom;
FormBedroom.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
  form: PropTypes.any,
};
