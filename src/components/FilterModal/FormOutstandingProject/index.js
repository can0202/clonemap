import React, {useState, useEffect} from 'react';
import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const OutstandingProject = ({
  form,
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  isChecked,
  setIsChecked,
  switchMap,
}) => {
  const onChange = (e) => {
    setIsChecked(/true/.test(e.target.checked));
    const newDataObject = {
      ...dataObject,
      isOutstanding: /true/.test(e.target.checked),
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      isOutstanding: /true/.test(e.target.checked),
    };
    setMapDataObj(newMapDataObj);
  };

  // // set fill value
  useEffect(() => {
    if (switchMap) {
      form.setFieldsValue({
        outstanding: /true/.test(mapDataObj?.isOutstanding),
      });
      setIsChecked(/true/.test(mapDataObj?.isOutstanding));
    } else {
      form.setFieldsValue({
        outstanding: /true/.test(dataObject?.isOutstanding),
      });
      setIsChecked(/true/.test(dataObject?.isOutstanding));
    }
  }, []);
  return (
    <div className='filter-box'>
      <Form.Item name='outstanding' style={{marginBottom: '0'}}>
        <Checkbox checked={isChecked} onChange={onChange}>
          <IntlMessages id='home.outstandingProject' />
        </Checkbox>
      </Form.Item>
    </div>
  );
};

export default OutstandingProject;
OutstandingProject.propTypes = {
  form: PropTypes.any,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setIsChecked: PropTypes.any,
  isChecked: PropTypes.any,
  switchMap: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
