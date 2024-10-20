import React, {useState} from 'react';
import {Slider, Form} from 'antd';
import PropTypes from 'prop-types';
import {useEffect} from 'react';

const FormArea = ({
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  areaLabel,
  setAreaLabel,
}) => {
  const onChangeArea = (value) => {
    const area_from = value[0] ?? '';
    const area_to = value[1] ?? '';
    const newDataObject = {
      ...dataObject,
      areaFrom: area_from,
      areaTo: area_to,
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      areaFrom: area_from,
      areaTo: area_to,
    };
    setMapDataObj(newMapDataObj);

    if (area_from == 0) {
      setAreaLabel('Dưới ' + area_to);
    } else {
      setAreaLabel(area_from + 'm²' + '-' + area_to);
    }
  };
  useEffect(() => {
    const area_from = dataObject.areaFrom ?? '';
    const area_to = dataObject.areaTo ? dataObject.areaTo : '500';
    if (area_from == 0) {
      setAreaLabel('Dưới ' + area_to);
    } else {
      setAreaLabel(area_from + 'm²' + '-' + area_to);
    }
  }, []);
  return (
    <>
      <div className='filter-box-area'>
        <h4>Diện tích</h4>
        <div className='form-item-text'>
          <div className='label-text-number'>
            {areaLabel ? areaLabel : 'Dưới 500'}m²
          </div>
        </div>
        <Form.Item name='area'>
          <>
            <Slider
              range
              step={10}
              min={0}
              max={500}
              defaultValue={[0, 500]}
              tooltip={{
                open: false,
              }}
              onAfterChange={onChangeArea}
            />
          </>
        </Form.Item>
      </div>
    </>
  );
};

export default FormArea;
FormArea.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
  areaLabel: PropTypes.any,
  setAreaLabel: PropTypes.any,
};
