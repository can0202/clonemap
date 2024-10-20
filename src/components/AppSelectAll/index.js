import React, {ChangeEvent, useEffect, useState} from 'react';
import {Select, Tag} from 'antd';
import PropTypes from 'prop-types';

const {Option} = Select;
const AppSelectAll = ({form, initialValues, fieldName, onChange, options}) => {
  const handleChange = (e, option) => {
    console.log(e);
    if (onChange) {
      onChange(e, option);
    }
  };
  const [optionsCurrent, setOptionsCurrent] = useState([]);

  useEffect(() => {
    if (initialValues) {
      setOptionsCurrent(initialValues ?? []);
    }
  }, [initialValues]);

  const handleSelectStatus = (selected) => {
    const statusValue = [];
    const optionsMock = options ?? [];
    optionsMock?.map((item) => {
      statusValue.push(item.value);
    });
    if (selected === '') {
      form.setFieldsValue({
        [fieldName]: statusValue,
      });
      setOptionsCurrent(statusValue);
    } else {
      if (optionsCurrent.length === optionsMock?.length - 2) {
        setOptionsCurrent(statusValue);
        form.setFieldsValue({
          [fieldName]: statusValue,
        });
      } else {
        setOptionsCurrent([...optionsCurrent, selected]);
        form.setFieldsValue({
          [fieldName]: [...optionsCurrent, selected],
        });
      }
    }
  };
  const handleDeselectStatus = (selected) => {
    if (selected === '') {
      form.setFieldsValue({
        [fieldName]: undefined,
      });
      setOptionsCurrent([]);
    } else {
      if (optionsCurrent?.includes('')) {
        const values = optionsCurrent?.filter(
          (item) => item != selected && item !== '',
        );
        form.setFieldsValue({
          [fieldName]: values,
        });
        setOptionsCurrent(values);
      } else {
        const value = optionsCurrent?.filter((item) => item !== selected);
        form.setFieldsValue({
          [fieldName]: value.length ? value : undefined,
        });
        setOptionsCurrent(value);
      }
    }
  };
  const handleTagRender = ({label, value, closable, onClose}) => {
    const isHasAll = optionsCurrent && optionsCurrent?.includes('');
    let options = [];
    if (isHasAll) {
      options = optionsCurrent?.filter((item) => item === '');
    } else options = optionsCurrent?.filter((item) => item !== '');
    return (
      <>
        {options?.includes(value) && (
          <Tag
            color={'#bdbdbd'}
            closable={closable}
            onClose={onClose}
            style={{marginRight: 3}}
          >
            {label}
          </Tag>
        )}
      </>
    );
  };
  const handleClear = () => {
    form?.setFieldsValue({
      [fieldName]: undefined,
    });
    setOptionsCurrent([]);
  };

  return (
    <Select
      style={{width: '100%'}}
      allowClear
      showSearch
      filterOption={(input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      onClear={handleClear}
      onChange={handleChange}
      onSelect={handleSelectStatus}
      onDeselect={handleDeselectStatus}
      tagRender={handleTagRender}
      maxTagCount={'responsive'}
      mode='multiple'
    >
      {options?.map((option) => {
        return (
          <Option
            key={option.value}
            value={option.value}
            label={option.label}
            id={option.id}
          >
            {option.label}
          </Option>
        );
      })}
    </Select>
  );
};

export default AppSelectAll;
AppSelectAll.propTypes = {
  options: PropTypes.any,
  onChange: PropTypes.func,
  fieldName: PropTypes.string,
  initialValues: PropTypes.any,
  form: PropTypes.any,
};
