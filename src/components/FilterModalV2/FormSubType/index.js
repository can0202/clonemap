import React from 'react';
import {Checkbox, Col, Form, Row} from 'antd';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import {useState} from 'react';
import {useIntl} from 'react-intl';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

const FormSubType = ({form, postType}) => {
  const {messages} = useIntl();
  const CheckboxGroup = Checkbox.Group;
  const {categories} = useSelector((state) => state.categories);
  const [checkedList, setCheckedList] = useState([]);
  const [realTypeOptions, setRealTypeOptions] = useState([]);
  const checkAll = realTypeOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < realTypeOptions.length;
  // const subTypes = Form.useWatch('realTypesFilterFilter', form);

  useEffect(() => {
    if (postType) {
      let realEstateTypeCat = categories?.categories?.realEstateTypeCat || [];
      let realTypeOptionsMock = [{label: messages['common.all'], value: 'all'}];
      realEstateTypeCat?.forEach((ele) => {
        if (ele.parent === postType) {
          let eleTypesOption = {
            parent: ele?.parent,
            label: ele?.name,
            value: ele?.code,
          };
          realTypeOptionsMock?.push(eleTypesOption);
        }
      });
      setRealTypeOptions(realTypeOptionsMock);
      setCheckedList([]);
      form.setFieldsValue({
        realTypesFilter: [],
      });
    }
  }, [postType]);

  const onChange = (e) => {
    if (e.includes('all')) {
      if (e.length === realTypeOptions.length) {
        // Nếu chọn "Tất cả", thì chọn tất cả các mục
        const allValues = realTypeOptions.map((option) => option.value);
        setCheckedList(allValues);
        form.setFieldsValue({
          realTypesFilter: allValues,
        });
      } else {
        // Nếu bỏ chọn "Tất cả", thì chỉ bỏ "Tất cả" nhưng giữ các mục khác
        const filteredValues = e.filter((value) => value !== 'all');
        setCheckedList(filteredValues);
        form.setFieldsValue({
          realTypesFilter: filteredValues,
        });
      }
    } else {
      // Nếu không có "Tất cả" trong e
      if (e.length === realTypeOptions.length - 1) {
        // Nếu tất cả các mục khác được chọn, tự động chọn "Tất cả"
        const allValues = realTypeOptions.map((option) => option.value);
        setCheckedList(allValues);
        form.setFieldsValue({
          realTypesFilter: allValues,
        });
      } else {
        // Nếu chọn hoặc bỏ chọn một mục riêng lẻ, cập nhật danh sách bình thường
        setCheckedList(e);
        form.setFieldsValue({
          realTypesFilter: e,
        });
      }
    }
  };

  const onCheckAllChange = (e) => {
    setCheckedList(
      e.target.checked ? realTypeOptions?.map((option) => option?.value) : [],
    );
    form.setFieldsValue({
      subPostTypeHeader: e.target.checked
        ? realTypeOptions?.map((option) => option?.value)
        : [],
      realTypesFilter: e.target.checked
        ? realTypeOptions?.map((option) => option?.value)
        : [],
    });
  };

  useEffect(() => {
    const formData = form.getFieldsValue();
    const subPostTypeHeader = formData.subTypeHome;
    if (subPostTypeHeader && subPostTypeHeader.length !== 0) {
      setCheckedList([subPostTypeHeader]);
      form.setFieldsValue({
        realTypesFilter: [subPostTypeHeader],
      });
    }
  }, []);
  return (
    <>
      <div className='filter-box filter-box-subtype'>
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
        <Form.Item name='realTypesFilter' valuePropName='checked'>
          <CheckboxGroup
            className='d-grid grid-template-2 gap-10'
            options={realTypeOptions}
            value={checkedList}
            onChange={onChange}
          />
        </Form.Item>
      </div>
    </>
  );
};

export default FormSubType;
FormSubType.propTypes = {
  form: PropTypes.any,
  postType: PropTypes.any,
};
