import {Select} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import IconArrow from 'assets/icon/ArrowDown.png';
import {filterOptionSearch} from 'shared/constants/AppConst';

const AppSelect = ({
  placeholder,
  onChange,
  options,
  onSelect,
  defaultValue,
}) => {
  return (
    <Select
      showSearch
      suffixIcon={
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
        >
          <path
            d='M15.8327 7.5L9.99935 12.5L4.16602 7.5'
            stroke='#6C6868'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      }
      style={{
        width: '100%',
      }}
      placeholder={placeholder}
      onChange={onChange}
      options={options}
      onSelect={onSelect}
      defaultValue={defaultValue}
      filterOption={filterOptionSearch}
      filterSort={(optionA, optionB) => {
        (optionA?.label ?? '')
          .toLowerCase()
          .localeCompare((optionB?.label ?? '').toLowerCase());
      }}
    />
  );
};

export default AppSelect;
AppSelect.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.any,
  ]),
  options: PropTypes.any,
  onSelect: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
