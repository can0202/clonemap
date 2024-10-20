import React from 'react';
import {Checkbox} from 'antd';
import PropTypes from 'prop-types';

const AppCheckbox = ({label, handleChange}) => {
  return <Checkbox onChange={handleChange}>{label}</Checkbox>;
};

export default AppCheckbox;
AppCheckbox.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  handleChange: PropTypes.func,
};
