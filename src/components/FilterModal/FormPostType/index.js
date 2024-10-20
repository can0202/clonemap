import React, {useState, useEffect} from 'react';
import {Checkbox, Form, Spin} from 'antd';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const FormPostType = ({
  form,
  postType,
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
}) => {
  const {messages} = useIntl();
  const CheckboxGroup = Checkbox.Group;
  const {categories} = useSelector((state) => state.categories);
  const [realTypeByType, setRealTypeByType] = useState([]);
  const [realTypeOptions, setRealTypeOptions] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const checkAll = realTypeOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < realTypeOptions.length;

  useEffect(() => {
    if (categories) {
      let realEstateTypeCat = categories?.categories?.realEstateTypeCat || [];
      let realTypeOptionsMock = [{label: messages['common.all'], value: 'all'}];
      let realTypeByTypeMock = [];
      realEstateTypeCat?.forEach((ele) => {
        if (ele.parent === dataObject?.types) {
          let eleTypesOption = {
            parent: ele?.parent,
            label: ele?.name,
            value: ele?.code,
          };
          realTypeOptionsMock?.push(eleTypesOption);
          realTypeByTypeMock?.push(eleTypesOption);
        }
      });
      setRealTypeByType(realTypeByTypeMock);
      setRealTypeOptions(realTypeOptionsMock);
    }
  }, [categories, dataObject?.types]);

  const onChange = (e) => {
    if (e.includes('all')) {
      if (e.length === realTypeOptions.length) {
        // Nếu chọn "Tất cả", thì chọn tất cả các mục
        const allValues = realTypeOptions.map((option) => option.value);
        setCheckedList(allValues);
        form.setFieldsValue({
          realTypes: allValues,
        });
      } else {
        // Nếu bỏ chọn "Tất cả", thì chỉ bỏ "Tất cả" nhưng giữ các mục khác
        const filteredValues = e.filter((value) => value !== 'all');
        setCheckedList(filteredValues);
        form.setFieldsValue({
          realTypes: filteredValues,
        });
      }
    } else {
      // Nếu không có "Tất cả" trong e
      if (e.length === realTypeOptions.length - 1) {
        // Nếu tất cả các mục khác được chọn, tự động chọn "Tất cả"
        const allValues = realTypeOptions.map((option) => option.value);
        setCheckedList(allValues);
        form.setFieldsValue({
          realTypes: allValues,
        });
      } else {
        // Nếu chọn hoặc bỏ chọn một mục riêng lẻ, cập nhật danh sách bình thường
        setCheckedList(e);
        form.setFieldsValue({
          realTypes: e,
        });
      }
    }

    const realEstateTypeCat = categories?.categories?.realEstateTypeCat || [];
    const subTypeTextArr = [];
    for (let index = 0; index < e.length; index++) {
      const arr = realEstateTypeCat?.filter(
        (item) => item?.parent === postType && item?.code === e[index],
      );
      subTypeTextArr?.push(arr[0]?.name);
    }
    setDataObject({
      ...dataObject,
      subTypes: e?.filter((value) => value !== ''),
      subTypesText: subTypeTextArr,
    });
    setMapDataObj({
      ...mapDataObj,
      subTypes: checkedList?.filter((value) => value !== ''),
    });
  };

  const onCheckAllChange = (e) => {
    setCheckedList(
      e.target.checked ? realTypeOptions?.map((option) => option?.value) : [],
    );
    form.setFieldsValue({
      subPostTypeHeader: e.target.checked
        ? realTypeOptions?.map((option) => option?.value)
        : [],
      realTypes: e.target.checked
        ? realTypeOptions?.map((option) => option?.value)
        : [],
    });
  };

  useEffect(() => {
    // if (realTypeOptions.length > 0) {
    const formData = form.getFieldsValue();
    const subPostTypeHeader = formData.subPostTypeHeader;
    if (subPostTypeHeader && subPostTypeHeader.length !== 0) {
      setCheckedList(subPostTypeHeader);
    }
    // else {
    //   setCheckedList(realTypeOptions.map((option) => option.value));
    // }
    // }
  }, []);

  useEffect(() => {
    let subTypeArr = [];
    if (typeof dataObject?.subTypes === 'string') {
      subTypeArr = dataObject?.subTypes?.split(',');
    } else if (Array.isArray(dataObject?.subTypes)) {
      subTypeArr = dataObject?.subTypes;
    }
    setCheckedList(subTypeArr);
    form.setFieldsValue({
      realTypes: subTypeArr,
    });
  }, [dataObject]);

  return (
    <>
      <div className='filter-box filter-box-subtype'>
        {!dataObject?.types ? (
          <Spin />
        ) : (
          <>
            <h4>
              <IntlMessages id='common.typeBds' />
            </h4>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
              className='checkbox-all'
            >
              <span>{messages['common.all']}</span>
            </Checkbox>
            <Form.Item name='realTypes' valuePropName='checked'>
              <CheckboxGroup
                className='d-grid grid-template-2 gap-10'
                options={realTypeOptions}
                value={checkedList}
                onChange={onChange}
              />
            </Form.Item>
          </>
        )}
      </div>
    </>
  );
};

export default FormPostType;
FormPostType.propTypes = {
  form: PropTypes.any,
  postType: PropTypes.string,
  setPostType: PropTypes.any,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
