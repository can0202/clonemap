import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import IntlMessages from '@crema/utility/IntlMessages';

const BoxButtonSave = ({handleClickButtonSaveFilter}) => {
  return (
    <Button
      type='default'
      className='box-text button-save'
      onClick={handleClickButtonSaveFilter}
    >
      <IntlMessages id='common.saveFilter' />
    </Button>
  );
};

export default BoxButtonSave;
BoxButtonSave.propTypes = {
  handleClickButtonSaveFilter: PropTypes.any,
};
