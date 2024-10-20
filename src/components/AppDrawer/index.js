import {Drawer} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const AppDrawer = (openDrawer, setOpenDrawer, title, description, width) => {
  const onClose = () => {
    setOpenDrawer(false);
  };
  return (
    <Drawer title={title} onClose={onClose} open={openDrawer} width={width}>
      {description}
    </Drawer>
  );
};

export default AppDrawer;
AppDrawer.propTypes = {
  openDrawer: PropTypes.bool,
  setOpenDrawer: PropTypes.any,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.node]),
  width: PropTypes.string,
};
