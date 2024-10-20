import {Select} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import IconArrow from 'assets/icon/ArrowDown.png';

const AppSelectLoadMore = ({
  placeholder,
  onChange,
  options,
  onSearch,
  loading,
  onPopupScroll,
  mode,
}) => {
  return (
    <Select
      showSearch
      suffixIcon={<img src={IconArrow.src} alt='' />}
      style={{
        width: '100%',
      }}
      onPopupScroll={onPopupScroll}
      placeholder={placeholder}
      onChange={onChange}
      options={options}
      onSearch={onSearch}
      loading={loading}
      mode={mode}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      filterSort={(optionA, optionB) => {
        (optionA?.label ?? '')
          .toLowerCase()
          .localeCompare((optionB?.label ?? '').toLowerCase());
      }}
    />
  );
};

export default AppSelectLoadMore;
AppSelectLoadMore.propTypes = {
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onPopupScroll: PropTypes.func,
  loading: PropTypes.bool,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.any,
  ]),
  options: PropTypes.any,
  mode: PropTypes.string,
};
